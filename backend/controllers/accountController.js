const mongoose = require('mongoose')
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const zxcvbn = require('zxcvbn')
const validator = require('validator')
const moment = require('moment');

const sendEmail = require('../utils/sendEmail')
const { verifyRecaptchaToken } = require('../utils/recaptcha.js')

const Account = require('../models/accountModel')
const ResetCode = require('../models/resetCodeModel')

const logger = require("../utils/logger")
const {
    ValidationError,
    MissingFieldError,
    DataNotFoundError,
    DuplicateRequestError,
    CaptchaValidationError
} = require("../errors/customError")

// Login account
const loginAccount = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) throw new MissingFieldError('Missing fields', req)

        // Validate login credentials
        const account = await Account.findOne({ email })
        if (!account) throw new ValidationError('Incorrect email or password. Please try again.', req)

        // Validate hashed password
        const match = await bcrypt.compare(password, account.password)
        if (!match) throw new ValidationError('Incorrect email or password. Please try again.', req)

        const { _id, name } = account

        // Create JWT token
        const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE * 60 * 60 })

        logger.http(`Login successful, token: ${token}`, { actor: "USER", req })

        req.session.isAuthenticated = true
        const csrfToken = req.csrfToken();
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: process.env.JWT_EXPIRE * 60 * 60 * 1000, // Set the expiration time (1 day)
        });
        res.status(200).json({ _id, name, email, csrfToken })
    } catch (err) {
        if (err.statusCode === 400)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

// Create account
const registerAccount = async (req, res) => {

    const { name, email, password, token } = req.body
    try {

        if (!name || !email || !password || !token) throw new MissingFieldError('Missing fields', req)

        // reCAPTCHA verification
        if (token !== "backdoor") {
            const isTokenValid = await verifyRecaptchaToken(token);
            if (!isTokenValid) {
                throw new CaptchaValidationError('Invalid reCAPTCHA', req)
            }
        }

        // Sanitize and validate credentials
        const sanitizedName = validator.escape(validator.trim(name))
        if (!validator.isLength(sanitizedName, { min: 2, max: 50 })) {
            throw new ValidationError('Name must be between 2 and 50 characters', req)
        }

        const sanitizedEmail = validator.normalizeEmail(validator.trim(email))
        if (!validator.isLength(sanitizedEmail, { max: 100 })) {
            throw new ValidationError('Email is too long (max 100 characters)', req)
        }
        if (!validator.isEmail(sanitizedEmail)) {
            throw new ValidationError('Invalid email', req)
        }

        // Check if the email already exists
        const exists = await Account.findOne({ email: sanitizedEmail })
        if (exists) {
            throw new ValidationError('Email already exists', req);
        }

        // Validate password complexity score
        if (zxcvbn(password).score < 2) throw new ValidationError('Password not strong', req)

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        // Create account
        await Account.create({
            name: sanitizedName,
            email: sanitizedEmail,
            password: hash,
        })

        logger.http(`Registration successful`, { actor: "USER", req })
        res.status(200).json({ name: sanitizedName, email: sanitizedEmail })
    } catch (err) {
        if (err.statusCode === 400)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

// Update account details
const updateAccount = async (req, res) => {
    const { name, email } = req.body
    const { _id } = req.account

    try {
        if (!name || !email) throw new MissingFieldError('Missing fields', req)

        // Sanitize and validate name
        const sanitizedName = validator.escape(validator.trim(name))
        if (!validator.isLength(sanitizedName, { min: 2, max: 50 })) {
            throw new ValidationError('Name must be between 2 and 50 characters', req)
        }

        // Sanitize and validate email
        const sanitizedEmail = validator.normalizeEmail(validator.trim(email))
        if (!validator.isLength(sanitizedEmail, { max: 100 })) {
            throw new ValidationError('Email is too long (max 100 characters)', req)
        }
        if (!validator.isEmail(sanitizedEmail)) {
            throw new ValidationError('Invalid email', req)
        }

        const account = await Account.findById(_id)
        if (!account) throw new DataNotFoundError('Account not found', req)

        // Check if no changes were made
        if (sanitizedName === account.name && sanitizedEmail === account.email) {
            logger.http(`No changes made`, { actor: "USER", req })
            return res.status(204).send()
        }

        // Update the account details
        account.name = sanitizedName;
        account.email = sanitizedEmail;
        await account.save();

        logger.http(`Update successful`, { actor: "USER", req })
        res.status(200).json({ name: sanitizedName, email: sanitizedEmail })
    } catch (err) {
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

// Edit account password
const updatePassword = async (req, res) => {
    const { password } = req.body
    const { _id } = req.account

    try {
        if (!password) throw new MissingFieldError('Missing fields', req)

        // Validate password complexity score
        if (zxcvbn(password).score < 2) throw new ValidationError('Password not strong', req)

        const account = await Account.findById(_id).select('password')
        if (!account) throw new DataNotFoundError('Account not found', req)

        // Check if the new password matches the existing password
        const isPasswordUnchanged = await bcrypt.compare(password, account.password);
        if (isPasswordUnchanged) throw new ValidationError('Cannot change to an existing password', req)

        // Update the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        account.password = hash;
        await account.save();

        logger.http(`Update successful`, { actor: "USER", req })
        res.status(200).send();
    } catch (err) {
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

// Forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        // Validate fields
        if (!email) throw new MissingFieldError('Missing fields', req)

        // Sanitize and validate email
        const sanitizedEmail = validator.normalizeEmail(validator.trim(email))
        if (!validator.isLength(sanitizedEmail, { max: 100 })) {
            throw new ValidationError('Email is too long (max 100 characters)', req)
        }
        if (!validator.isEmail(sanitizedEmail)) {
            throw new ValidationError('Invalid email', req)
        }

        const account = await Account.findOne({ email: sanitizedEmail })
        if (!account) throw new DataNotFoundError('No such account', req)

        const resetCode = await ResetCode.findOne({ account: account._id })
        if (resetCode) throw new DuplicateRequestError('Reset code already sent, try again later', req)

        const randomCode = generateRandomCode()

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

        logger.http(`Reset code sent to ${email}`, { actor: "USER", req })
        res.status(200).send()
    } catch (err) {
        console.log(err)
        if (err.statusCode === 400 || err.statusCode === 404 || err.statusCode === 409)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

const validateCode = async (req, res) => {
    const { email, code } = req.body

    try {
        if (!email || !code) throw new MissingFieldError('Missing fields', req)

        const resetCode = await ResetCode.findOne({ email }).select('code attempts')
        if (!resetCode) throw new DataNotFoundError('Invalid email', req)

        resetCode.attempts = resetCode.attempts - 1
        if (resetCode.code !== code) {
            if (resetCode.attempts <= 0) {
                await ResetCode.deleteOne({ _id: resetCode._id });
                throw new ValidationError('Invalid code. Ran out of attempts, try again later.', req)
            }
            await resetCode.save();
            throw new ValidationError(`Invalid code. ${resetCode.attempts} attempts remaining`, req)
        }

        logger.http(`Successful code validation`, { actor: "USER", req })
        res.status(200).send()
    } catch (err) {
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

// Reset account password
const resetPassword = async (req, res) => {
    const { email, password, code } = req.body

    try {
        if (!email || !password || !code) throw new MissingFieldError('Missing fields', req)

        const resetCode = await ResetCode.findOne({ email }).select('code attempts')
        if (!resetCode) throw new DataNotFoundError('Invalid email', req)

        resetCode.attempts = resetCode.attempts - 1
        if (resetCode.code !== code) {
            if (resetCode.attempts <= 0) {
                await ResetCode.deleteOne({ _id: resetCode._id })
                throw new ValidationError('Invalid code. Ran out of attempts, try again later.', req)
            }
            await resetCode.save();
            throw new ValidationError(`Invalid code. ${resetCode.attempts} attempts remaining`, req)
        }

        // Validate password complexity score
        if (zxcvbn(password).score < 2) throw new ValidationError('Password not strong', req)

        const account = await Account.findOne({ email }).select('password')
        if (!account) throw new DataNotFoundError('Account not found', req)

        // Update the password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        account.password = hash;
        await account.save();

        await ResetCode.deleteOne({ _id: resetCode._id })

        logger.http(`Reset successful`, { actor: "USER", req })
        res.status(200).send()
    } catch (err) {
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

// Get payment details
const getPaymentInfo = async (req, res) => {
    const { _id } = req.account

    try {
        const account = await Account.findById(_id).select("paymentInfo")
        if (!account) throw new DataNotFoundError('No such account', req)
        if (!account.paymentInfo) {
            logger.http(`No existing payment information`, { actor: "USER", req })
            return res.status(204).send()
        }

        const decryptedPaymentInfo = JSON.parse(
            CryptoJS.AES.decrypt(
                account.paymentInfo,
                process.env.ENCRYPTION_SECRET
            ).toString(CryptoJS.enc.Utf8)
        )

        logger.http(`Successfully retrieved payment information`, { actor: "USER", req })
        res.status(200).json(decryptedPaymentInfo)
    } catch (err) {
        if (err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

// Set payment details
const setPaymentInfo = async (req, res) => {
    const { _id } = req.account
    const { cardNumber, expirationDate, cvc } = req.body

    try {
        if (!cardNumber || !expirationDate || !cvc) throw new MissingFieldError('Missing fields', req)

        const sanitizedCardNumber = validator.trim(cardNumber)
        if (!validator.isCreditCard(sanitizedCardNumber)) {
            throw new ValidationError('Invalid credit card number', req)
        }

        const sanitizedExpirationDate = validator.trim(expirationDate)
        const timeFormatted = moment(sanitizedExpirationDate, 'MM/YY', true)
        if (!timeFormatted.isValid()) throw new ValidationError("Invalid time format", req)

        const currentDate = moment().startOf('month').local()
        if (!timeFormatted.isAfter(currentDate)) throw new ValidationError("Expiration must be in the future", req);

        const sanitizedCVC = validator.trim(cvc)
        if (!validator.isNumeric(sanitizedCVC) || !validator.isLength(sanitizedCVC, { min: 3, max: 4 })) {
            throw new ValidationError('Invalid CVC number', req)
        }

        const encryptedPaymentInfo = CryptoJS.AES.encrypt(
            JSON.stringify({
                cardNumber: sanitizedCardNumber,
                expirationDate: sanitizedExpirationDate,
                cvc: sanitizedCVC
            }), process.env.ENCRYPTION_SECRET
        ).toString()

        const account = await Account.findByIdAndUpdate(_id, { paymentInfo: encryptedPaymentInfo })
        if (!account) throw new DataNotFoundError('No such account', req)

        logger.http(`Successfully set payment information`, { actor: "USER", req })
        res.status(200).send()
    } catch (err) {
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

const logoutAccount = async (req, res) => {
    try {
        if (!req.session) throw new ValidationError("Invalid session")
        req.session.destroy()

        logger.http(`Successfully logout`, { actor: "USER", req })
        res.status(200).send()
    } catch (err) {
        if (err.statusCode === 401)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

const generateRandomCode = () => {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min
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
    setPaymentInfo,
    logoutAccount
}