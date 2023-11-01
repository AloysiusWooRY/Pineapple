const express = require('express')
const {
    getAllPost,
    createPost,
    getPostById,
    editPost,
    deletePostImage,
    deletePost,
    likePost,
    dislikePost,
    pinPost,
    unpinPost,
    joinEvent,
    leaveEvent
} = require('../controllers/postController')
const rateLimit = require('../utils/rateLimiter')
const requireAuth = require('../middleware/requireAuth')
const upload = require('../middleware/fileUpload')
const fileUploadErrorHandler = require('../middleware/fileUploadErrorHandler')


const router = express.Router()

// GET: Post by category and filter
router.post('/all', rateLimit(10, 50), requireAuth(isAdmin = false), getAllPost)

// POST: New Post
router.post('/new', rateLimit(10, 50), requireAuth(isAdmin = false), upload.single("attachment"), fileUploadErrorHandler, createPost)

// GET: Post by category and filter
router.post('/:id', rateLimit(10, 50), requireAuth(isAdmin = false), getPostById)

// PATCH: Post by category and filter
router.patch('/:id', rateLimit(10, 50), requireAuth(isAdmin = false), upload.single("attachment"), fileUploadErrorHandler, editPost)

// DELETE: Post image
router.delete('/:id/image', rateLimit(), requireAuth(isAdmin = false), deletePostImage)

// DELETE: Post
router.delete('/:id', rateLimit(), requireAuth(isAdmin = false), deletePost)

// POST: Like Post
router.post('/:id/like', rateLimit(10, 50), requireAuth(isAdmin = false), likePost)

// POST: Dislike Post
router.post('/:id/dislike', rateLimit(10, 50), requireAuth(isAdmin = false), dislikePost)

// POST: Dislike Post
router.post('/:id/pin', rateLimit(), requireAuth(isAdmin = false), pinPost)

// POST: Dislike Post
router.post('/:id/unpin', rateLimit(), requireAuth(isAdmin = false), unpinPost)

// POST: Join event
router.post('/:id/join', rateLimit(), requireAuth(isAdmin = false), joinEvent)

// POST: Leave event
router.post('/:id/leave', rateLimit(), requireAuth(isAdmin = false), leaveEvent)

module.exports = router