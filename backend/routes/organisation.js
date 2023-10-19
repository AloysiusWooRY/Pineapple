const express = require('express')
const fs = require('fs')
const { ValidationError } = require("../errors/customError")
const {
    applyOrganisation
} = require('../controllers/organisationController')
const requireAuth = require('../middleware/requireAuth')
const upload = require('../middleware/fileUpload')
const logger = require("../utils/logger")

const router = express.Router()
router.use(requireAuth(isAdmin = true))

const uploadFields = upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'poster', maxCount: 1 }
])

// POST: new org application
router.post('/apply', async function (req, res, next) {
    uploadFields(req, res, async function (err) {
        if (err || req.errorCode) {
            try {
                if (err && err.code === 'LIMIT_UNEXPECTED_FILE')
                    throw new ValidationError(`Invalid file fields found: ${err.field}`, req);
                else if (err && err.code === 'ENOENT')
                    throw new Error(`Error in folder creation: ${err.message}`);
                else if (req.errorCode && req.errorCode === 'LIMIT_UNEXPECTED_FILE_TYPE')
                    throw new ValidationError(`Invalid file type`, req);
                else
                    throw new Error(err.message);
            } catch (err) {
                if (err.statusCode === 400)
                    res.status(err.statusCode).json({ error: err.message });
                else {
                    logger.error(err.message, { actor: "USER", req });
                    res.status(500).json({ error: "Something went wrong, try again later" });
                }
            }
        } else {
            next()
        }
    });
}, applyOrganisation);


module.exports = router