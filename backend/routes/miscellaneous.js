const express = require('express')
const {
    ping,
    generateCSRF,
    emailTest,
    test,
    clamTest
} = require('../controllers/miscellaneousController')
const rateLimit = require('../utils/rateLimiter')

const router = express.Router()

// GET: ping server
router.get('/ping', rateLimit(), ping)

// GET: get csrf token
router.get('/get-csrf-token', rateLimit(5, 100), generateCSRF)

// GET: Send email
router.get('/email', rateLimit(5, 100), emailTest)

// GET: Test
router.get('/test', rateLimit(5, 100), test)

// GET: Clam Test
router.get('/clam-test', rateLimit(5, 100), clamTest)

module.exports = router