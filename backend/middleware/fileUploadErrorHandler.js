const { ValidationError } = require("../errors/customError")
const logger = require("../utils/logger")
const fs = require('fs')

const fileUploadErrorHandler = async (err, req, res, next) => {

    if (err || req.errorCode) {
        try {
            if (err.code === 'LIMIT_UNEXPECTED_FILE')
                throw new ValidationError(`Invalid file fields found: ${err.field}`, req)
            else if (err.code === 'LIMIT_FILE_SIZE')
                throw new ValidationError(`File too large`, req)
            else if (err.code === 'LIMIT_FIELD_KEY')
                throw new ValidationError(`File name too long`, req)
            else if (err.code === 'ENOENT')
                throw new Error(`Error in folder creation: ${err.message}`)
            else if (req.errorCode === 'LIMIT_UNEXPECTED_FILE_TYPE')
                throw new ValidationError(`Invalid file type found`, req)
            else
                throw new Error(err.message)
        } catch (err) {
            if (req.info) {
                const { banner, poster, attachment } = req.info
                if (attachment && fs.existsSync(`uploads/attachment/${attachment.filename}`)) fs.unlinkSync(`uploads/attachment/${attachment.filename}`)
                if (banner && fs.existsSync(`uploads/banner/${banner.filename}`)) fs.unlinkSync(`uploads/banner/${banner.filename}`)
                if (poster && fs.existsSync(`uploads/poster/${poster.filename}`)) fs.unlinkSync(`uploads/poster/${poster.filename}`)
            }

            if (err.statusCode === 400)
                res.status(err.statusCode).json({ error: err.message })
            else {
                logger.error(err.message, { actor: "USER", req })
                res.status(500).json({ error: "Something went wrong, try again later" })
            }
        }
    } else {
        next();
    }
}

module.exports = fileUploadErrorHandler