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

const getCommentByPost = async (req, res) => {
    const { post: postId, filter } = req.body
    const { _id: userId } = req.account
    try {
        if (!postId) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(postId)) throw new ValidationError("Invalid id", req)

        const post = await Post.findOne({ _id: postId })
        if (!post) throw new DataNotFoundError('No such post', req)

        const comments = await Comment.find({ post: postId }).populate("owner", "name")
        const commentIds = comments.map(comment => comment._id)

        const sort = {}
        if (filter === "top") sort["likes"] = -1
        const replies = await Reply.find({ comment: { $in: commentIds } })
            .sort(sort)
            .populate("owner", "name")
        const commentsWithReplies = comments.map(comment => {
            return {
                ...comment._doc, replies: replies.filter(reply => reply.comment.toString() === comment._id.toString())
            }
        })

        logger.http(`Got all comments successful`, { actor: "USER", req })
        res.status(200).json({ comments: commentsWithReplies })
    } catch (err) {
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

const addComment = async (req, res) => {
    const { post: postId, content } = req.body
    const { _id: userId } = req.account
    try {
        if (!postId) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(postId)) throw new ValidationError("Invalid id", req)

        const post = await Post.findOne({ _id: postId })
        if (!post) throw new DataNotFoundError('No such post', req)

        // Fields validation
        if (!content) throw new MissingFieldError("Missing content", req)
        const sanitizedContent = validator.escape(validator.trim(content))
        if (!validator.isLength(sanitizedContent, { min: 1, max: MAX_LONG_TEXT_LEN })) throw new ValidationError("Length of 'content' too long (Max: 2048 characters)", req)

        const comment = await Comment.create({
            content: sanitizedContent,
            post: postId,
            owner: userId
        })

        logger.http(`Comment successfully added`, { actor: "USER", req })
        res.status(200).json({ comment })

    } catch (err) {
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

const deleteComment = async (req, res) => {
    const { id: commentId } = req.params
    const { _id: userId, isAdmin, moderation } = req.account
    try {
        if (!commentId) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(commentId)) throw new ValidationError("Invalid id", req)

        const comment = await Comment.findById(commentId).populate("post")
        if (!comment) throw new DataNotFoundError('No such comment', req)

        const { post, owner } = comment
        if (!isAdmin &&
            (moderation && !moderation.includes(post.organisation)) &&
            !(new mongoose.Types.ObjectId(userId)).equals(owner)
        ) throw new ValidationError("Unauthorised to delete non-personal comments", req)

        const deletedReplies = await Reply.find({ comment: commentId }).select('_id')
        const replyIds = deletedReplies.map(reply => reply._id)

        await Comment.deleteOne({ _id: commentId })
        await Reply.deleteMany({ comment: commentId })
        await Like.deleteMany({ comment: commentId })
        await Like.deleteMany({ reply: { $in: replyIds } })

        logger.http(`Comment successfully deleted`, { actor: "USER", req })
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

const likeComment = async (req, res) => {
    const { _id: userId } = req.account
    const { id: commentId } = req.params

    try {
        if (!commentId) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(commentId)) throw new ValidationError("Invalid id", req)

        const existingComment = await Comment.findOne({ _id: commentId })
        if (!existingComment) throw new DataNotFoundError('No such comment', req)

        let value
        const existinglike = await Like.findOne({ comment: commentId, account: userId })
        if (existinglike && existinglike.value === 1) {
            await Like.deleteOne({ _id: existinglike._id })
            value = 0
        } else if (existinglike && existinglike.value === -1) {
            existinglike.value = 1
            await existinglike.save()
            value = 1
        } else {
            await Like.create({
                comment: commentId,
                account: userId,
                value: 1
            })
            value = 1
        }

        const getSum = await Like.aggregate([
            { $match: { comment: new mongoose.Types.ObjectId(commentId) } },
            { $group: { _id: null, totalValue: { $sum: '$value' } } }
        ])
        const sum = getSum[0]?.totalValue ?? 0

        existingComment.likes = sum
        await existingComment.save()

        logger.http(`Comment liked: ${existingComment._id}`, { actor: "USER", req })
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

const dislikeComment = async (req, res) => {
    const { _id: userId } = req.account
    const { id: commentId } = req.params

    try {
        if (!commentId) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(commentId)) throw new ValidationError("Invalid id", req)

        const existingComment = await Comment.findOne({ _id: commentId })
        if (!existingComment) throw new DataNotFoundError('No such comment', req)

        let value
        const existinglike = await Like.findOne({ comment: commentId, account: userId })
        if (existinglike && existinglike.value === 1) {
            await Like.deleteOne({ _id: existinglike._id })
            value = 0
        } else if (existinglike && existinglike.value === 1) {
            existinglike.value = -1
            await existinglike.save()
            value = -1
        } else {
            await Like.create({
                comment: commentId,
                account: userId,
                value: -1
            })
            value = -1
        }

        const getSum = await Like.aggregate([
            { $match: { comment: new mongoose.Types.ObjectId(commentId) } },
            { $group: { _id: null, totalValue: { $sum: '$value' } } }
        ])
        const sum = getSum[0]?.totalValue ?? 0

        existingComment.likes = sum
        await existingComment.save()

        logger.http(`Comment disliked: ${existingComment._id}`, { actor: "USER", req })
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
    getCommentByPost,
    addComment,
    deleteComment,
    likeComment,
    dislikeComment
}