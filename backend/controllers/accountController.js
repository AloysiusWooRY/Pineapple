const mongoose = require('mongoose')
const crypto = require("crypto")
const jwt = require('jsonwebtoken')

const Account = require('../models/accountModel')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

// Login account
const loginAccount = async (req, res) => {
    const { email, password } = req.body
    try {
        // Validate login credentials
        const account = await Account.login(email, password)
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
        // Create new account
        const account = await Account.createNew(name, email, password)
        res.status(200).json({ account })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

module.exports = {
    loginAccount,
    registerAccount
}