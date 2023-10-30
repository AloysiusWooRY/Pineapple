const express = require('express')
const {
    addReply,
    deleteReply,
    likeReply,
    dislikeReply
} = require('../controllers/replyController')
const rateLimit = require('../utils/rateLimiter')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// POST: New reply
router.post('/new', rateLimit(), requireAuth(isAdmin = false), addReply)

// DELETE: Delete reply
router.delete('/:id', rateLimit(), requireAuth(isAdmin = false), deleteReply)

// POST: Like reply
router.post('/:id/like', rateLimit(), requireAuth(isAdmin = false), likeReply)

// POST: Disike reply
router.post('/:id/dislike', rateLimit(), requireAuth(isAdmin = false), dislikeReply)


module.exports = router