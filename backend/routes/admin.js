const express = require('express')
const {
    editRoleAccount,
    getAllAccount,
    getApplication,
    approveApplication,
    rejectApplication
} = require('../controllers/adminController')
const rateLimit = require('../utils/rateLimiter')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// POST: Edit account role
router.post('/account/edit-role', rateLimit(), requireAuth(isAdmin = true), editRoleAccount)

// GET: Get all accounts
router.post('/account/all', rateLimit(), requireAuth(isAdmin = true), getAllAccount)

// GET: Get applications
router.post('/application', rateLimit(), requireAuth(isAdmin = true), getApplication)

// POST: Approve application
router.post('/application/:id/approve', rateLimit(), requireAuth(isAdmin = true), approveApplication)

// POST: Reject application
router.post('/application/:id/reject', rateLimit(), requireAuth(isAdmin = true), rejectApplication)


module.exports = router