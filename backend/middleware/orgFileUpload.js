const multer = require('multer')
const fs = require('fs')
const path = require('path')
const moment = require('moment')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = "uploads/" + file.fieldname
        checkUploadPath(path)
        cb(null, path)
    },
    filename: function (req, file, cb) {
        const timestamp = moment().format('YYYYMMDDHHmmss');
        const randomString = Math.random().toString(36).substring(2, 15); // Generate a random string
        const originalName = path.parse(file.originalname).name; // Get the original filename without extension
        const uniqueFilename = `${originalName}_${timestamp}_${randomString}${path.extname(file.originalname)}`;

        if (!req.info)
            req.info = {
                name: req.body.name,
                description: req.body.description
            };

        req.info[file.fieldname] = {
            filename: uniqueFilename,
            originalFilename: file.originalname
        }

        cb(null, uniqueFilename);
    }
})

const fileFilter = async (req, file, cb) => {
    try {
        if (file.mimetype !== 'image/png' &&
            file.mimetype !== 'image/jpg' &&
            file.mimetype !== 'image/jpeg'
        ) throw Error('Invalid file type')

        cb(null, true)
    } catch (err) {
        req.fileValidationError = err.message
        cb(null, false)
    }
}

const checkUploadPath = (path) => {
    if (!fs.existsSync("uploads")) {
        console.log("New folder created: uploads")
        fs.mkdirSync("uploads", (err) => {
            if (err) console.log("Error in folder creation", err)
        })
    }
    if (!fs.existsSync(path)) {
        console.log("New path " + path)
        fs.mkdirSync(path, (err) => {
            if (err) console.log("Error in folder creation", err)
        })
    }
}

const upload = multer({
    storage,
    fileFilter
})

module.exports = upload