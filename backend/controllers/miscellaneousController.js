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

// Email test
const emailTest = async (req, res) => {
    const { email } = req.body
    await sendEmail("PasswordReset", email, {
        code: 696969,
        name: "Jia Hao"
    })
    res.status(200).json({})
}

// Test
const test = async (req, res) => {
    const t = CryptoJS.lib.WordArray.random(32).toString()
    res.status(200).json({ t })
}

const clamTest = async (req, res) => {
    const filePath = path.join(__dirname, '../uploads/1.png')
    try {
        // clamscan.scan(filePath, (err, file, isInfected) => {
        //     if (err) console.log(err)
        //     else console.log(`Infection: ${isInfected}`)
        // })
        res.status(200).json({})
    } catch (err) {
        console.log(err)
        logger.error(err.message, { actor: "USER", req })
        res.status(500).json({ error: "Something went wrong, try again later" })
    }
}

module.exports = {
    ping,
    generateCSRF,
    emailTest,
    test,
    clamTest
}