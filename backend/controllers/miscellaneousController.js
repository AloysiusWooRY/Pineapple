const mongoose = require('mongoose')
const fs = require('fs')
const logger = require("../utils/logger")
const sendEmail = require('../utils/sendEmail')
const validator = require('validator')
const moment = require('moment');

const Account = require('../models/accountModel')

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

// Test
const test = async (req, res) => {
    const t = await Account.find().select('_id').lean()
    const h = await Account.find().select('_id')
    res.status(200).send([t, h])
}

module.exports = {
    ping,
    generateCSRF,
    emailTest,
    test
}