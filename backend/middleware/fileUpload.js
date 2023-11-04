const multer = require('multer')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const logger = require("../utils/logger")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = "uploads/" + file.fieldname
        checkUploadPath(path)
        cb(null, path)
    },
    filename: function (req, file, cb) {
        const forbiddenCharacters = /[/?<>\\:*|"]/g

        const timestamp = moment().format('YYYYMMDDHHmmss')
        const randomString = Math.random().toString(36).substring(2, 15) // Generate a random string
        const originalName = path.parse(file.originalname).name // Get the original filename without extension
        const sanitisedFilename = originalName.replace(forbiddenCharacters, '_')
        const uniqueFilename = `${sanitisedFilename}_${timestamp}_${randomString}${path.extname(file.originalname)}`
        const dateFilename = `${sanitisedFilename}_${timestamp}${path.extname(file.originalname)}`

        if (!req.info)
            req.info = { ...req.body }

        req.info[file.fieldname] = {
            filename: uniqueFilename,
            dateFilename: dateFilename,
            originalFilename: `${sanitisedFilename}${path.extname(file.originalname)}`
        }

        cb(null, uniqueFilename)
    }
})

const fileFilter = async (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) cb(null, true)
    else {
        req.errorCode = 'LIMIT_UNEXPECTED_FILE_TYPE'
        cb(new Error()) //cb(null, false)
    }
}

const checkUploadPath = (path, next) => {
    if (!fs.existsSync("uploads")) {
        logger.info("New folder created: 'uploads'", { actor: "SERVER" })
        try {
            fs.mkdirSync("uploads")
        } catch (err) {
            next(err)
        }
    }
    if (!fs.existsSync(path)) {
        logger.info(`New path created: '${path}'`, { actor: "SERVER" })
        try {
            fs.mkdirSync(path)
        } catch (err) {
            next(err)
        }
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fieldNameSize: 512,
        fileSize: 8 * 1024 * 1024
    }
})

module.exports = upload