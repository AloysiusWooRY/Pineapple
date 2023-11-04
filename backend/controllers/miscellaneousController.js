const mongoose = require('mongoose')
const fs = require('fs')
const logger = require("../utils/logger")
const sendEmail = require('../utils/sendEmail')
const path = require('path')
const CryptoJS = require("crypto-js")

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

module.exports = {
    ping,
    generateCSRF,
    emailTest,
    test
}