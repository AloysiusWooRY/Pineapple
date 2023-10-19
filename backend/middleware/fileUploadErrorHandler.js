const { ValidationError } = require("../errors/customError")

const fileUploadErrorHandler = async (err, req, res, next) => {

    console.log(req)
    if (err || req.errorCode) {
        try {
            if (err.code === 'LIMIT_UNEXPECTED_FILE')
                throw new ValidationError(`Invalid file fields found: ${err.field}`, req)
            else if (err.code === 'ENOENT')
                throw new Error(`Error in folder creation: ${err.message}`)
            else if (req.errorCode === 'LIMIT_UNEXPECTED_FILE_TYPE')
                throw new ValidationError(`Invalid file fields found: ${err.field}`, req)
            else
                throw new Error(err.message)
        } catch (err) {
            const { banner, poster } = req.info
            if (banner) fs.unlinkSync(`uploads/banner/${banner.filename}`)
            if (poster) fs.unlinkSync(`uploads/poster/${poster.filename}`)

            res.status(400).json({ error: err.message })
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