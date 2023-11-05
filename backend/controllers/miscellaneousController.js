const logger = require("../utils/logger")

// Ping pong
const ping = async (req, res) => {
    res.status(200).send("pong")
}

// Generate anti-CSRF token
const generateCSRF = async (req, res) => {
    const csrfToken = req.csrfToken()
    res.cookie('csrf', csrfToken, {
        maxAge: process.env.JWT_EXPIRE * 60 * 60 * 1000, // Set the expiration time (1 day)
    })
    logger.http(`Requested CSRF token successful`, { actor: "USER", req })
    res.status(200).json({ csrfToken })
}

module.exports = {
    ping,
    generateCSRF
}