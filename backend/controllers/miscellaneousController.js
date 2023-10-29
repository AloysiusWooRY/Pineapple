const mongoose = require('mongoose')
const fs = require('fs')
const logger = require("../utils/logger")
const sendEmail = require('../utils/sendEmail')

// Ping pong
const ping = async (req, res) => {
    res.status(200).send("pong")
}

// Generate anti-CSRF token
const generateCSRF = async (req, res) => {
    console.log(req.session)
    const csrfToken = req.csrfToken()
    res.status(200).json({ csrfToken })
}

// Email test
const emailTest = async (req, res) => {
    const { email } = req.body
    await sendEmail("PasswordReset", email, {
        code: 696969,
        name: "Jia Hao"
    })
    res.status(200).send()
}

module.exports = {
    ping,
    generateCSRF,
    emailTest
}