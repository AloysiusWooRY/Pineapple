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
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// POST: login account
router.post('/login', loginAccount)

// POST: create an account
router.post('/register', registerAccount)

// POST: forgot password
router.post('/forgot-password', forgotPassword)

// POST: validate reset code
router.post('/validate-code', validateCode)

// POST: reset password (change)
router.post('/reset-password', resetPassword)

// PATCH: update account details
router.patch('/update', requireAuth(isAdmin = false), updateAccount)

// PATCH: update account password
router.patch('/update-password', requireAuth(isAdmin = false), updatePassword)

// GET: get payment info
router.get('/payment-info', requireAuth(isAdmin = false), getPaymentInfo)

// PUT: set payment info
router.put('/payment-info', requireAuth(isAdmin = false), setPaymentInfo)


// PUT: set payment info
router.get('/test', test)


module.exports = router