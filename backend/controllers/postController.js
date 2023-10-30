const mongoose = require('mongoose')
const validator = require('validator')
const fs = require('fs')
const moment = require('moment');

const Organisation = require('../models/organisationModel')
const Post = require('../models/postModel')
const Like = require('../models/likeModel')
const logger = require("../utils/logger")

const {
    ValidationError,
    MissingFieldError,
    DataNotFoundError,
    DuplicateRequestError,
    CaptchaValidationError
} = require("../errors/customError")
const {
    POST_FILTERS,
    POST_CATEGORIES,
    MAX_TEXT_LEN,
    MAX_LONG_TEXT_LEN
} = require("../utils/globalVars")

// Get post by category and filter
const getAllPost = async (req, res) => {
    const { organisation, category, filter, sortByPinned } = req.body
    const { _id: userId } = req.account

    try {
        if (category && (
            !validator.isAlphanumeric(category) ||
            !POST_CATEGORIES.includes(category.toLowerCase())
        )) throw new ValidationError('Invalid category', req)

        if (filter && (
            !validator.isAlphanumeric(filter) ||
            !POST_FILTERS.includes(filter.toLowerCase())
        )) throw new ValidationError('Invalid filter', req)

        if (organisation &&
            !mongoose.Types.ObjectId.isValid(organisation)
        ) throw new ValidationError('Invalid organisation id', req)

        let query = {}
        if (organisation) {
            const orgID = mongoose.Types.ObjectId(organisation)
            const organisationObj = await Organisation.findOne({ _id: orgID, approved: true })
            if (!organisationObj) throw new DataNotFoundError('No such organisation', req)

            query["organisation"] = mongoose.Types.ObjectId(orgID)
        }
        if (category === 'event' || category === 'donation') {
            query[category] = { $exists: true }
        }

        let sort = {}
        if (sortByPinned) sort["isPinned"] = -1
        if (filter === "top") sort["likes"] = -1

        const posts = await Post.find(query).sort(sort)

        const postIds = posts.map(post => post._id)
        const userLiked = await Like.find({ post: { $in: postIds }, account: userId }).select("post value")
        const postsWithLikes = posts.map(post => {
            const userLike = userLiked.find(like => like.post.equals(post._id));
            const liked = userLike ? userLike.value : 0

            return { ...post._doc, liked }
        })

        logger.http(`Post retrieve successfully, (Category: ${category}, Filter: ${filter})`, { actor: "USER", req })
        res.status(200).json({ posts: postsWithLikes })
    } catch (err) {
        if (err.statusCode === 400)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

const createPost = async (req, res) => {

    const userId = req.account._id
    try {
        const { title, description, time, organisation, attachment, event, donation } = req.info ?? req.body

        const newOrg = { owner: userId }

        // Fields validation
        if (!title) throw new MissingFieldError("Missing title", req)
        const sanitizedTitle = validator.escape(validator.trim(title))
        if (sanitizedTitle.length > MAX_TEXT_LEN) throw new ValidationError("Length of 'title' too long (Max: 256 characters)", req)
        newOrg["title"] = sanitizedTitle

        if (!description) throw new MissingFieldError("Missing description", req)
        const sanitizedDescription = validator.escape(validator.trim(description))
        if (sanitizedDescription.length > MAX_LONG_TEXT_LEN) throw new ValidationError("Length of 'description' too long (Max: 2048 characters)", req)
        newOrg["description"] = sanitizedDescription

        if (!organisation) throw new MissingFieldError("Missing organisation", req)
        if (!mongoose.Types.ObjectId.isValid(organisation)) throw new ValidationError('Invalid organisation id', req)
        const existingOrganisation = await Organisation.findById(organisation)
        if (!existingOrganisation) throw new DataNotFoundError(`No such organisation`, req)
        newOrg["organisation"] = organisation

        if (event === "true" && donation === "true") throw new ValidationError("A post cannot be both event and donation", req)
        if (event === "true") {
            const { event_location, event_capacity, event_time } = req.info ?? req.body
            newOrg["event"] = {}

            if (!event_location) throw new MissingFieldError("Missing event location", req)
            const sanitizedLocation = validator.escape(validator.trim(event_location))
            if (sanitizedLocation.length > MAX_TEXT_LEN) throw new ValidationError("Length of 'location' too long (Max: 256 characters)", req)
            newOrg["event"]["location"] = sanitizedLocation

            if (!event_capacity) throw new MissingFieldError("Missing event capacity", req)
            const sanitizedCapacity = validator.escape(validator.trim(event_capacity))
            if (!validator.isNumeric(sanitizedCapacity)) throw new ValidationError("Invalid capacity", req)
            if (!validator.isInt(sanitizedCapacity, { gt: 0, lt: 99999 })) throw new ValidationError("Capacity out of range (1 to 99999)", req)
            newOrg["event"]["capacity"] = sanitizedCapacity

            if (!event_time) throw new MissingFieldError("Missing time", req)
            const sanitizedTime = validator.escape(validator.trim(event_time))
            const timeFormatted = moment(`${sanitizedTime}+00:00`, 'YYYY-MM-DDTHH:mmZ', true)
            if (!timeFormatted.isValid()) throw new ValidationError("Invalid date format", req)

            const currentDate = moment().local().add(8, 'hours')
            if (!timeFormatted.isAfter(currentDate.add(1, 'day'))) throw new ValidationError("Time must be at least 1 day in the future", req);

            newOrg["event"]["time"] = timeFormatted.toDate()
        }
        if (donation === "true") {
            const { donation_goal } = req.info ?? req.body
            newOrg["donation"] = {}

            if (!donation_goal) throw new MissingFieldError("Missing donation goal", req)
            const sanitizedGoal = validator.escape(validator.trim(donation_goal))
            if (!validator.isNumeric(sanitizedGoal)) throw new ValidationError("Invalid goal", req)
            if (!validator.isFloat(sanitizedGoal, { gt: 0.00, lt: 10000000 })) throw new ValidationError("Capacity out of range (1 to 10000000)", req)
            if (!validator.isCurrency(sanitizedGoal, { digits_after_decimal: [0, 1, 2] })) throw new ValidationError("Invalid goal currency format", req)
            newOrg["donation"]["goal"] = sanitizedGoal
        }

        const _id = new mongoose.Types.ObjectId()

        if (attachment) {
            const orgPath = `media/organisation/${organisation}`
            const attachmentPath = `${orgPath}/post/${_id}/${attachment.dateFilename}`
            newOrg["imagePath"] = attachmentPath

            // Create new path for image to be stored in
            if (!fs.existsSync(orgPath)) {
                logger.info(`Created organisation folder: ${organisation}`, { actor: "SERVER" });
                fs.mkdirSync(`public/${orgPath}/post/${_id}`, { recursive: true })
            }
            fs.renameSync(`uploads/attachment/${attachment.filename}`, `public/${attachmentPath}`)
        }

        const post = await Post.create(newOrg)

        logger.http(`Post successfully create: ${_id}`, { actor: "USER", req })
        res.status(200).json({ post })
    } catch (err) {
        if (req.info && req.info.attachment) fs.unlinkSync(`uploads/attachment/${req.info.attachment.filename}`)
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

const getPostById = async (req, res) => {
    let { id } = req.params
    try {
        if (!id) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(id)) throw new ValidationError("Invalid id", req)

        const post = await Post.findOne({ _id: id })
            .select("-donation.donors -event.members")
            .populate("owner", "_id name")
            .populate("organisation", "-requestedBy")

        if (!post) throw new DataNotFoundError('No such post', req)

        logger.http(`Post retrieved successfully, (ID: ${id})`, { actor: "USER", req })
        res.status(200).json({ post })
    } catch (err) {
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

const editPost = async (req, res) => {
    const { id } = req.params
    const userId = req.account._id
    try {
        if (!id) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(id)) throw new ValidationError("Invalid id", req)

        const existingPost = await Post.findById(id)
        if (!existingPost) throw new DataNotFoundError("No such post", req)

        if (!(new mongoose.Types.ObjectId(userId)).equals(existingPost.owner)) throw new ValidationError("Unauthorised to edit non-personal post", req)

        const { title, description, attachment, event, donation } = req.info ?? req.body

        // Fields validation
        if (title) {
            const sanitizedTitle = validator.escape(validator.trim(title))
            if (sanitizedTitle.length > MAX_TEXT_LEN) throw new ValidationError("Length of 'title' too long (Max: 256 characters)", req)
            existingPost.title = sanitizedTitle
        }

        if (description) {
            const sanitizedDescription = validator.escape(validator.trim(description))
            if (sanitizedDescription.length > MAX_LONG_TEXT_LEN) throw new ValidationError("Length of 'description' too long (Max: 2048 characters)", req)
            existingPost.description = sanitizedDescription
        }

        if (event === "true" && donation === "true") throw new ValidationError("A post cannot be both event and donation", req)
        if (event === "true") {
            if (!existingPost.event) throw new ValidationError("Post has no event", req)
            const { event_location, event_capacity, event_time } = req.info ?? req.body

            if (event_location) {
                const sanitizedLocation = validator.escape(validator.trim(event_location))
                if (sanitizedLocation.length > MAX_TEXT_LEN) throw new ValidationError("Length of 'location' too long (Max: 256 characters)", req)
                existingPost.event.location = sanitizedLocation
            }

            if (event_capacity) {
                const sanitizedCapacity = validator.escape(validator.trim(event_capacity))
                if (!validator.isNumeric(sanitizedCapacity)) throw new ValidationError("Invalid capacity", req)
                if (!validator.isInt(sanitizedCapacity, { gt: 0, lt: 99999 })) throw new ValidationError("Capacity out of range (1 to 99999)", req)
                existingPost.event.capacity = sanitizedCapacity
            }

            if (event_time) {
                const sanitizedTime = validator.escape(validator.trim(event_time))
                const timeFormatted = moment(`${sanitizedTime}+00:00`, 'YYYY-MM-DDTHH:mmZ', true)
                if (!timeFormatted.isValid()) throw new ValidationError("Invalid date format", req)

                const currentDate = moment().local().add(8, 'hours')
                if (!timeFormatted.isAfter(currentDate.add(1, 'day'))) throw new ValidationError("Time must be at least 1 day in the future", req);

                existingPost.event.time = timeFormatted.toDate()
            }
        }
        if (donation === "true") {
            if (!existingPost.donation) throw new ValidationError("Post has no donation", req)

            const { donation_goal } = req.info ?? req.body
            if (donation_goal) {
                const sanitizedGoal = validator.escape(validator.trim(donation_goal))
                if (!validator.isNumeric(sanitizedGoal)) throw new ValidationError("Invalid goal", req)
                if (!validator.isFloat(sanitizedGoal, { gt: 0.00, lt: 10000000 })) throw new ValidationError("Capacity out of range (1 to 10000000)", req)
                if (!validator.isCurrency(sanitizedGoal, { digits_after_decimal: [0, 1, 2] })) throw new ValidationError("Invalid goal currency format", req)
                existingPost.donation.goal = sanitizedGoal
            }
        }

        if (attachment) {
            const { _id, organisation, imagePath } = existingPost
            if (imagePath) fs.unlinkSync(`public/${imagePath}`)

            const orgPath = `media/organisation/${organisation}`
            const attachmentPath = `${orgPath}/post/${_id}/${attachment.dateFilename}`
            existingPost["imagePath"] = attachmentPath

            // Create new path for image to be stored in
            if (!fs.existsSync(orgPath)) {
                logger.info(`Created organisation folder: ${organisation}`, { actor: "SERVER" });
                fs.mkdirSync(`public/${orgPath}/post/${_id}`, { recursive: true })
            }
            fs.renameSync(`uploads/attachment/${attachment.filename}`, `public/${attachmentPath}`)
        }

        await existingPost.save()

        logger.http(`Post successfully edited: ${existingPost._id}`, { actor: "USER", req })
        res.status(200).json({ post: existingPost })
    } catch (err) {
        if (req.info && req.info.attachment && fs.existsSync(`uploads/attachment/${req.info.attachment.filename}`))
            fs.unlinkSync(`uploads/attachment/${req.info.attachment.filename}`)
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

const deletePostImage = async (req, res) => {
    const { id } = req.params
    const userId = req.account._id

    try {
        if (!id) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(id)) throw new ValidationError("Invalid id", req)

        const existingPost = await Post.findById(id)
        if (!existingPost) throw new DataNotFoundError("No such post", req)

        const { _id, owner, imagePath } = existingPost

        if (!(new mongoose.Types.ObjectId(userId)).equals(owner)) throw new ValidationError("Unauthorised to edit non-personal post", req)
        if (!imagePath) throw new DataNotFoundError("No image found in post", req)

        existingPost.imagePath = undefined
        await existingPost.save()

        fs.unlinkSync(`public/${imagePath}`)

        logger.http(`Post image successfully deleted: ${_id}`, { actor: "USER", req })
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

const deletePost = async (req, res) => {
    const { id } = req.params
    const { _id: userId, isAdmin, moderation } = req.account

    try {
        if (!id) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(id)) throw new ValidationError("Invalid id", req)

        const existingPost = await Post.findById(id)
        if (!existingPost) throw new DataNotFoundError("No such post", req)

        const { _id, imagePath, owner, organisation } = existingPost

        if (!isAdmin &&
            (moderation && !moderation.includes(organisation)) &&
            !(new mongoose.Types.ObjectId(userId)).equals(owner)
        ) throw new ValidationError("Unauthorised to delete non-personal post", req)

        await Post.deleteOne({ _id })

        if (imagePath) fs.unlinkSync(`public/${imagePath}`)

        logger.http(`Post image successfully deleted: ${_id}`, { actor: "USER", req })
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

const likePost = async (req, res) => {
    const { _id } = req.account
    const { id: postId } = req.params

    try {
        if (!postId) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(postId)) throw new ValidationError("Invalid id", req)

        const existingPost = await Post.findById(postId)
        if (!existingPost) throw new DataNotFoundError("No such post", req)

        let value
        const existinglike = await Like.findOne({ post: postId, account: _id })
        if (existinglike && existinglike.value === 1) {
            await Like.deleteOne({ _id: existinglike._id })
            value = 0
        } else if (existinglike && existinglike.value === -1) {
            existinglike.value = 1
            await existinglike.save()
            value = 1
        } else {
            await Like.create({
                post: postId,
                account: _id,
                value: 1
            })
            value = 1
        }

        const getSum = await Like.aggregate([
            { $match: { post: new mongoose.Types.ObjectId(postId) } },
            { $group: { _id: null, totalValue: { $sum: '$value' } } }
        ])
        const sum = getSum[0]?.totalValue ?? 0

        existingPost.likes = sum
        await existingPost.save()

        logger.http(`Post liked: ${_id}`, { actor: "USER", req })
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

const dislikePost = async (req, res) => {
    const { _id } = req.account
    const { id: postId } = req.params

    try {
        if (!postId) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(postId)) throw new ValidationError("Invalid id", req)

        const existingPost = await Post.findById(postId)
        if (!existingPost) throw new DataNotFoundError("No such post", req)

        let value
        const existinglike = await Like.findOne({ post: postId, account: _id })
        if (existinglike && existinglike.value === -1) {
            await Like.deleteOne({ _id: existinglike._id })
            value = 0
        } else if (existinglike && existinglike.value === 1) {
            existinglike.value = -1
            await existinglike.save()
            value = -1
        } else {
            await Like.create({
                post: postId,
                account: _id,
                value: -1
            })
            value = -1
        }

        const getSum = await Like.aggregate([
            { $match: { post: new mongoose.Types.ObjectId(postId) } },
            { $group: { _id: null, totalValue: { $sum: '$value' } } }
        ])
        const sum = getSum[0]?.totalValue ?? 0

        existingPost.likes = sum
        await existingPost.save()

        logger.http(`Post disliked: ${_id}`, { actor: "USER", req })
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
    getAllPost,
    createPost,
    getPostById,
    editPost,
    deletePostImage,
    deletePost,
    likePost,
    dislikePost
}