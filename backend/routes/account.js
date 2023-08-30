const express = require('express')
const {
    loginAccount
} = require('../controllers/accountController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// POST: login account
router.post('/login', loginAccount)

module.exports = router