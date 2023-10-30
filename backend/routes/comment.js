const express = require('express')
const {
    addComment,
    deleteComment,
    likeComment,
    dislikeComment,
    getCommentByPost
} = require('../controllers/commentController')
const rateLimit = require('../utils/rateLimiter')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// POST: Like comment
router.post('/all', rateLimit(), requireAuth(isAdmin = false), getCommentByPost)

// POST: New comment
router.post('/new', rateLimit(), requireAuth(isAdmin = false), addComment)

// DELETE: Delete comment
router.delete('/:id', rateLimit(), requireAuth(isAdmin = false), deleteComment)

// POST: Like comment
router.post('/:id/like', rateLimit(), requireAuth(isAdmin = false), likeComment)

// POST: Like comment
router.post('/:id/dislike', rateLimit(), requireAuth(isAdmin = false), dislikeComment)


module.exports = router