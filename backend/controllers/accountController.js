const mongoose = require('mongoose')
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const zxcvbn = require('zxcvbn')
const validator = require('validator')

const sendEmail = require('../utils/sendEmail')

const Account = require('../models/accountModel')
const ResetCode = require('../models/resetCodeModel')

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
        const token = createToken(_id)

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

        // Sanitize and validate credentials
        const sanitizedName = validator.escape(validator.trim(name))
        if (!validator.isLength(sanitizedName, { min: 2, max: 50 })) {
            throw new Error('Name must be between 2 and 50 characters')
        }

        const sanitizedEmail = validator.normalizeEmail(validator.trim(email))
        if (!validator.isLength(sanitizedEmail, { max: 100 })) {
            throw new Error('Email is too long (max 100 characters)')
        }
        if (!validator.isEmail(sanitizedEmail)) {
            throw new Error('Invalid email')
        }

        // Check if the email already exists
        const exists = await Account.findOne({ email: sanitizedEmail })
        if (exists) {
            throw new Error('Email already exists');
        }

        // Validate password complexity score
        if (zxcvbn(password).score < 2) throw Error('Password not strong')

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        // Create account
        await Account.create({
            name: sanitizedName,
            email: sanitizedEmail,
            password: hash,
        })

        res.status(200).json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// Update account details
const updateAccount = async (req, res) => {
    const { name, email } = req.body
    const { _id } = req.account

    try {
        if (!name || !email) throw Error('Missing fields')

        // Sanitize and validate name
        const sanitizedName = validator.escape(validator.trim(name))
        if (!validator.isLength(sanitizedName, { min: 2, max: 50 })) {
            throw new Error('Name must be between 2 and 50 characters')
        }

        // Sanitize and validate email
        const sanitizedEmail = validator.normalizeEmail(validator.trim(email))
        if (!validator.isLength(sanitizedEmail, { max: 100 })) {
            throw new Error('Email is too long (max 100 characters)')
        }
        if (!validator.isEmail(sanitizedEmail)) {
            throw new Error('Invalid email')
        }

        if (!sanitizedName || !sanitizedEmail) {
            throw new Error('Missing fields')
        }

        const account = await Account.findById(_id)
        if (!account) throw new Error('Account not found')

        // Check if no changes were made
        if (sanitizedName === account.name && sanitizedEmail === account.email) {
            return res.status(200).json({ msg: "No changes made" })
        }

        // Update the account details
        account.name = sanitizedName;
        account.email = sanitizedEmail;
        const updatedAccount = await account.save();

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// Edit account password
const updatePassword = async (req, res) => {
    const { password } = req.body
    const { _id } = req.account

    try {
        if (!password) throw Error('Missing fields')

        // Validate password complexity score
        if (zxcvbn(password).score < 2) throw new Error('Password not strong')

        const account = await Account.findById(_id).select('password')
        if (!account) throw new Error('Account not found')

        // Check if the new password matches the existing password
        const isPasswordUnchanged = await bcrypt.compare(password, account.password);
        if (isPasswordUnchanged) throw new Error('Cannot change to an existing password')

        // Update the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        account.password = hash;
        await account.save();

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// Forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        // Validate fields
        if (!email) throw Error('Missing fields')

        // Sanitize and validate email
        const sanitizedEmail = validator.normalizeEmail(validator.trim(email))
        if (!validator.isLength(sanitizedEmail, { max: 100 })) {
            throw new Error('Email is too long (max 100 characters)')
        }
        if (!validator.isEmail(sanitizedEmail)) {
            throw new Error('Invalid email')
        }

        const account = await Account.findOne({ email: sanitizedEmail })
        if (!account) throw Error('No such account')

        const resetCode = await ResetCode.findOne({ account: account._id })
        if (resetCode) throw Error('Reset code already sent, try again later')

        const randomCode = generateRandomCode();

        // Create reset code
        await ResetCode.create({
            account: account._id,
            email: account.email,
            code: randomCode
        })

        // Prepare and send email
        await sendEmail("PasswordReset", account.email, {
            code: randomCode,
            name: account.name
        })

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const validateCode = async (req, res) => {
    const { email, code } = req.body

    try {
        if (!email || !code) throw Error('Missing fields')

        const resetCode = await ResetCode.findOne({ email }).select('code attempts')
        if (!resetCode) throw new Error('Invalid email')

        resetCode.attempts = resetCode.attempts - 1
        if (resetCode.code !== code) {
            if (resetCode.attempts <= 0) {
                await ResetCode.deleteOne({ _id: resetCode._id });
                throw new Error('Invalid code. Ran out of attempts, try again later.')
            }
            await resetCode.save();
            throw new Error(`Invalid code. ${resetCode.attempts} attempts remaining`)
        }

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// Reset account password
const resetPassword = async (req, res) => {
    const { email, password, code } = req.body

    try {
        if (!email || !password || !code) throw Error('Missing fields')

        const resetCode = await ResetCode.findOne({ email }).select('code attempts')
        if (!resetCode) throw new Error('Invalid email')

        resetCode.attempts = resetCode.attempts - 1
        if (resetCode.code !== code) {
            if (resetCode.attempts <= 0) {
                await ResetCode.deleteOne({ _id: resetCode._id });
                throw new Error('Invalid code. Ran out of attempts, try again later.')
            }
            await resetCode.save();
            throw new Error(`Invalid code. ${resetCode.attempts} attempts remaining`)
        }

        // Validate password complexity score
        if (zxcvbn(password).score < 2) throw new Error('Password not strong')

        const account = await Account.findOne({ email }).select('password')
        if (!account) throw new Error('Account not found')

        // Update the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        account.password = hash;
        await account.save();

        await ResetCode.deleteOne({ _id: resetCode._id });

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// Get payment details
const getPaymentInfo = async (req, res) => {
    const { _id } = req.account

    try {
        const account = await Account.findById(_id).select("paymentInfo")
        if (!account) throw Error('No such account')
        if (!account.paymentInfo) throw Error('No existing payment info')

        const decryptedPaymentInfo = JSON.parse(
            CryptoJS.AES.decrypt(
                account.paymentInfo,
                process.env.ENCRYPTION_SECRET
            ).toString(CryptoJS.enc.Utf8)
        )

        res.status(200).json(decryptedPaymentInfo)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// Set payment details
const setPaymentInfo = async (req, res) => {
    const { _id } = req.account
    const { cardNumber, expirationDate, cvc } = req.body

    try {
        if (!cardNumber || !expirationDate || !cvc) throw Error('Missing fields')

        const sanitizedCardNumber = validator.trim(cardNumber)
        if (!validator.isCreditCard(sanitizedCardNumber)) {
            throw new Error('Invalid credit card number')
        }

        const sanitizedExpirationDate = validator.trim(expirationDate)
        if (!validator.isLength(sanitizedExpirationDate, { min: 5, max: 5 })) {
            throw new Error('Invalid expiration date')
        }

        const sanitizedCVC = validator.trim(cvc)
        if (!validator.isNumeric(sanitizedCVC) && validator.isLength(sanitizedCVC, { min: 3, max: 4 })) {
            throw new Error('Invalid CVC number')
        }

        const encryptedPaymentInfo = CryptoJS.AES.encrypt(
            JSON.stringify({
                cardNumber: sanitizedCardNumber,
                expirationDate: sanitizedExpirationDate,
                cvc: sanitizedCVC
            }), process.env.ENCRYPTION_SECRET
        ).toString()

        const account = await Account.findByIdAndUpdate(_id, { paymentInfo: encryptedPaymentInfo })
        if (!account) throw new Error('No such account')

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

function generateRandomCode() {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    loginAccount,
    registerAccount,
    updateAccount,
    updatePassword,
    forgotPassword,
    validateCode,
    resetPassword,
    getPaymentInfo,
    setPaymentInfo
}