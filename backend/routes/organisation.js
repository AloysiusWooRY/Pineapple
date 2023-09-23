const express = require('express')
const {
    applyOrganisation
} = require('../controllers/organisationController')
const requireAuth = require('../middleware/requireAuth')
const upload = require('../middleware/orgFileUpload')
const handleUploadError = require('../middleware/orgHandleFileUploadError')

const router = express.Router()
router.use(requireAuth(isAdmin = true))

const uploadFields = upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'poster', maxCount: 1 }
])

// POST: new org application
router.post('/apply', uploadFields, handleUploadError, applyOrganisation)

module.exports = router