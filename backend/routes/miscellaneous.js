const express = require('express')
const {
    ping,
    generateCSRF
} = require('../controllers/miscellaneousController')
const rateLimit = require('../utils/rateLimiter')

const router = express.Router()

// POST: login account
router.get('/ping', rateLimit(), ping)

// POST: create an account
router.get('/get-csrf-token', rateLimit(5, 100), generateCSRF)

module.exports = router