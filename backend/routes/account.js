const express = require('express')
const {
    loginAccount,
    loginOTP,
    registerAccount,
    updateAccount,
    updatePassword,
    forgotPassword,
    validateCode,
    resetPassword,
    getPaymentInfo,
    setPaymentInfo,
    logoutAccount,
    verify2FA
} = require('../controllers/accountController')
const rateLimit = require('../utils/rateLimiter')
const requireAuth = require('../middleware/requireAuth')
const requireAuthSetup = require('../middleware/requireAuthSetup')
const requireAuthLogin = require('../middleware/requireAuthLogin')

const router = express.Router()

// POST: login account
router.post('/login', rateLimit(), loginAccount)

// POST: login otp
router.post('/login-otp', rateLimit(), requireAuthLogin, loginOTP)

// POST: create an account
router.post('/register', rateLimit(), registerAccount)

// POST: create an account
router.post('/verify-otp', rateLimit(), requireAuthSetup, verify2FA)

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
router.post('/payment-info', rateLimit(5, 20), requireAuth(isAdmin = false), getPaymentInfo)

// PUT: set payment info
router.put('/payment-info', rateLimit(5, 15), requireAuth(isAdmin = false), setPaymentInfo)

// PUT: set payment info
router.post('/logout', rateLimit(5, 10), requireAuth(isAdmin = false), logoutAccount)

module.exports = router