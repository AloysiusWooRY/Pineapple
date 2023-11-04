const jwt = require('jsonwebtoken')
const Account = require('../models/accountModel')
const logger = require("../utils/logger")
const { AuthenticationError } = require("../errors/customError")
const requireAuth = (isAdmin = false) => async (req, res, next) => {

    try {
        // Verify authentication
        if (!req.session || !req.session.isAuthenticated) throw new AuthenticationError("Unauthorized access", req)
        if (!req.cookies || !req.cookies.jwt) throw new AuthenticationError('Unauthorized access', req)

        const token = req.cookies.jwt

        // Validate JWT
        const { _id } = jwt.verify(token, process.env.JWT_SECRET)
        const account = await Account.findOne({ _id }).select('_id isAdmin isTester moderation')
        if (!account) throw new AuthenticationError('Account not found', req)

        req.account = account

        if (isAdmin && !account.isAdmin) throw new AuthenticationError("Unauthorized admin access", req)

        next()
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            logger.http(`${err.name} - ${err.message}`, { actor: "USER", req })
            res.status(401).json({ error: "Unauthorized access (Expired Token)", Expired: true })
        }
        else if (err.name === "JsonWebTokenError") {
            logger.http(`${err.name} - ${err.message}`, { actor: "USER", req })
            res.status(401).json({ error: "Invalid token" })
        }
        else if (err.name === "AuthenticationError")
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }

}

module.exports = requireAuth