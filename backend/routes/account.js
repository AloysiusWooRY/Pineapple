const express = require('express')
const {
    loginAccount, createAccount
} = require('../controllers/accountController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// POST: login account
router.post('/login', loginAccount)

// POST: create an account
router.post('/create', createAccount)

module.exports = router