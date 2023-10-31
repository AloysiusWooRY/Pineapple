const express = require('express')
const {
    createTransaction
} = require('../controllers/transactionController')
const rateLimit = require('../utils/rateLimiter')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// POST: New transaction
router.post('/new', rateLimit(), requireAuth(isAdmin = false), createTransaction)

module.exports = router