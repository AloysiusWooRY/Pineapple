const { SessionValidationError } = require("../errors/customError")
const logger = require("../utils/logger")

const csrfErrorHandler = async (err, req, res, next) => {

    try {
        if (err && err.code === 'EBADCSRFTOKEN') {
            throw new SessionValidationError('Session forbidden', req)
        } else {
            next()
        }
    } catch (err) {
        if (err.statusCode === 403)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }

    }

}

module.exports = csrfErrorHandler