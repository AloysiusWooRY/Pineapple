const mongoose = require('mongoose')
const validator = require('validator')
const fs = require('fs')
const moment = require('moment');

const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
const Like = require('../models/likeModel')
const Reply = require('../models/replyModel')
const logger = require("../utils/logger")

const {
    ValidationError,
    MissingFieldError,
    DataNotFoundError
} = require("../errors/customError")
const {
    POST_FILTERS,
    POST_CATEGORIES,
    MAX_TEXT_LEN,
    MAX_LONG_TEXT_LEN
} = require("../utils/globalVars")

const addReply = async (req, res) => {
    const { comment: commentId, content } = req.body
    const { _id: userId } = req.account
    try {
        if (!commentId) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(commentId)) throw new ValidationError("Invalid id", req)

        const comment = await Comment.findOne({ _id: commentId })
        if (!comment) throw new DataNotFoundError('No such comment', req)

        // Fields validation
        if (!content) throw new MissingFieldError("Missing content", req)
        const sanitizedContent = validator.escape(validator.trim(content))
        if (!validator.isLength(sanitizedContent, { min: 1, max: MAX_LONG_TEXT_LEN })) throw new ValidationError("Length of 'content' too long (Max: 2048 characters)", req)

        const reply = await Reply.create({
            content: sanitizedContent,
            comment: commentId,
            owner: userId
        })

        logger.http(`Reply successfully added`, { actor: "USER", req })
        res.status(200).json({ reply })
    } catch (err) {
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

const deleteReply = async (req, res) => {
    const { id: replyId } = req.params
    const { _id: userId, isAdmin, moderation } = req.account
    try {
        if (!replyId) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(replyId)) throw new ValidationError("Invalid id", req)

        const reply = await Reply.findById(replyId).populate({
            path: 'post',
            populate: { path: 'comment' }
        })
        if (!reply) throw new DataNotFoundError('No such reply', req)

        const { comment, owner } = reply
        const { post } = comment
        if (!isAdmin &&
            (moderation && !moderation.includes(post.organisation)) &&
            !(new mongoose.Types.ObjectId(userId)).equals(owner)
        ) throw new ValidationError("Unauthorised to delete non-personal reply", req)

        await Reply.deleteOne({ _id: replyId })
        await Like.deleteMany({ reply: replyId })

        logger.http(`Reply successfully deleted`, { actor: "USER", req })
        res.status(200).send()
    } catch (err) {
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

const likeReply = async (req, res) => {
    const { _id: userId } = req.account
    const { id: replyId } = req.params

    try {
        if (!replyId) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(replyId)) throw new ValidationError("Invalid id", req)

        const existingReply = await Reply.findOne({ _id: replyId })
        if (!existingReply) throw new DataNotFoundError('No such reply', req)

        let value
        const existinglike = await Like.findOne({ reply: replyId, account: userId })
        if (existinglike && existinglike.value === 1) {
            await Like.deleteOne({ _id: existinglike._id })
            value = 0
        } else if (existinglike && existinglike.value === -1) {
            existinglike.value = 1
            await existinglike.save()
            value = 1
        } else {
            await Like.create({
                reply: replyId,
                account: userId,
                value: 1
            })
            value = 1
        }

        const getSum = await Like.aggregate([
            { $match: { comment: new mongoose.Types.ObjectId(replyId) } },
            { $group: { _id: null, totalValue: { $sum: '$value' } } }
        ])
        const sum = getSum[0]?.totalValue ?? 0

        existingReply.likes = sum
        await existingReply.save()

        logger.http(`Reply liked: ${existingReply._id}`, { actor: "USER", req })
        res.status(200).json({ total: sum, value })
    } catch (err) {
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

const dislikeReply = async (req, res) => {
    const { _id: userId } = req.account
    const { id: replyId } = req.params

    try {
        if (!replyId) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(replyId)) throw new ValidationError("Invalid id", req)

        const existingReply = await Reply.findOne({ _id: replyId })
        if (!existingReply) throw new DataNotFoundError('No such reply', req)

        let value
        const existinglike = await Like.findOne({ reply: replyId, account: userId })
        if (existinglike && existinglike.value === 1) {
            await Like.deleteOne({ _id: existinglike._id })
            value = 0
        } else if (existinglike && existinglike.value === 1) {
            existinglike.value = -1
            await existinglike.save()
            value = -1
        } else {
            await Like.create({
                reply: replyId,
                account: userId,
                value: -1
            })
            value = -1
        }

        const getSum = await Like.aggregate([
            { $match: { comment: new mongoose.Types.ObjectId(replyId) } },
            { $group: { _id: null, totalValue: { $sum: '$value' } } }
        ])
        const sum = getSum[0]?.totalValue ?? 0

        existingReply.likes = sum
        await existingReply.save()

        logger.http(`Reply disliked: ${existingReply._id}`, { actor: "USER", req })
        res.status(200).json({ total: sum, value })
    } catch (err) {
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

module.exports = {
    addReply,
    deleteReply,
    likeReply,
    dislikeReply
}