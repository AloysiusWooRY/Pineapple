const express = require('express')
const {
    loginAccount, registerAccount
} = require('../controllers/accountController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// POST: login account
router.post('/login', loginAccount)

// POST: create an account
router.post('/register', registerAccount)

module.exports = router