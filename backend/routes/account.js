const express = require('express')
const {
    loginAccount,
    registerAccount,
    updateAccount,
    updatePassword,
    forgotPassword,
    validateCode,
    resetPassword,
    getPaymentInfo,
    setPaymentInfo,
    test
} = require('../controllers/accountController')
const rateLimit = require('../utils/rateLimiter')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// POST: login account
router.post('/login', rateLimit(), loginAccount)

// POST: create an account
router.post('/register', rateLimit(), registerAccount)

// POST: forgot password
router.post('/forgot-password', rateLimit(), forgotPassword)

// POST: validate reset code
router.post('/validate-code', rateLimit(), validateCode)

// POST: reset password (change)
router.post('/reset-password', rateLimit(), resetPassword)

// PATCH: update account details
router.patch('/update', rateLimit(5, 10), requireAuth(isAdmin = false), updateAccount)

// PATCH: update account password
router.patch('/update-password', rateLimit(5, 10), requireAuth(isAdmin = false), updatePassword)

// GET: get payment info
router.get('/payment-info', rateLimit(5, 20), requireAuth(isAdmin = false), getPaymentInfo)

// PUT: set payment info
router.put('/payment-info', rateLimit(5, 10), requireAuth(isAdmin = false), setPaymentInfo)

// PUT: set payment info
router.get('/test', test)

module.exports = router