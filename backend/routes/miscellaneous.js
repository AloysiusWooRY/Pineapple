const express = require('express')
const {
    ping,
    generateCSRF
} = require('../controllers/miscellaneousController')
const rateLimit = require('../utils/rateLimiter')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// GET: ping server
router.get('/ping', rateLimit(), ping)

// GET: get csrf token
router.get('/get-csrf-token', rateLimit(5, 100), generateCSRF)

module.exports = router