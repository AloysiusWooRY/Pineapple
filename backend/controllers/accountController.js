const mongoose = require('mongoose')
const crypto = require("crypto")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const zxcvbn = require('zxcvbn')
const validator = require('validator')

const Account = require('../models/accountModel')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

// Login account
const loginAccount = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) throw Error('Missing fields')

        // Validate login credentials
        const account = await Account.findOne({ email })
        if (!account) throw Error('Incorrect email or password. Please try again.')

        // Validate hashed password
        const match = await bcrypt.compare(password, account.password)
        if (!match) throw Error('Incorrect email or password. Please try again.')

        const { _id, name } = account

        // Create JWT token
        const token = createToken(account._id)

        res.status(200).json({ _id, name, email, token })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// Create account
const registerAccount = async (req, res) => {

    const { name, email, password } = req.body
    try {

        if (!name || !email || !password) throw Error('Missing fields')

        // Validate signup credentials
        if (!validator.isEmail(email)) throw Error('Invalid email')
        const exists = await Account.findOne({ email })
        if (exists) throw Error('Email already exist')

        // Validate password complexity score
        if (zxcvbn(password).score < 2) throw Error('Password not strong')

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        // Create account
        const account = await Account.create({
            name, email, password: hash
        })
        res.status(200).json({ account })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

module.exports = {
    loginAccount,
    registerAccount
}