const mongoose = require('mongoose')
const fs = require('fs')
const logger = require("../utils/logger")

// Ping pong
const ping = async (req, res) => {
    res.status(200).send("pong")
}

// Generate anti-CSRF token
const generateCSRF = async (req, res) => {
    const csrfToken = req.csrfToken()
    res.status(200).json({ csrfToken })
}

module.exports = {
    ping,
    generateCSRF
}