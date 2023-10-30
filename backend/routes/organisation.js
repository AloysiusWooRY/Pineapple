const express = require('express')
const fs = require('fs')
const { ValidationError } = require("../errors/customError")
const {
    applyOrganisation,
    getAllOrganisation,
    getAllCategories,
    getOrganisationById
} = require('../controllers/organisationController')
const rateLimit = require('../utils/rateLimiter')
const requireAuth = require('../middleware/requireAuth')
const fileUploadErrorHandler = require('../middleware/fileUploadErrorHandler')
const logger = require("../utils/logger")
const upload = require('../middleware/fileUpload')

const router = express.Router()

const uploadFields = upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'poster', maxCount: 1 }
])

// POST: new org application
router.post('/apply', requireAuth(isAdmin = false), uploadFields, fileUploadErrorHandler, applyOrganisation);

// GET: Category
router.post('/categories', rateLimit(10, 50), requireAuth(isAdmin = false), getAllCategories)

// GET: Organisation by category
router.post('/all', rateLimit(10, 50), requireAuth(isAdmin = false), getAllOrganisation)

// GET: Organisation by id
router.post('/:id', rateLimit(10, 50), requireAuth(isAdmin = false), getOrganisationById)

module.exports = router