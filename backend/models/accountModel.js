const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const zxcvbn = require('zxcvbn')

const Organisation = require('./organisationModel')
const Schema = mongoose.Schema

const accountSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    moderation: [{ type: Schema.Types.ObjectId, required: false, ref: Organisation }],
    paymentInfo: { type: paymentInfoSchema, required: true },
}, { timestamps: true, versionKey: false })

const paymentInfoSchema = new Schema({
    cardNumber: { type: Number, required: true },
    expirationDate: { type: String, required: true },
    cvc: { type: Number, required: true },
})

// Login Method
accountSchema.statics.login = async function (email, password) {
    // Validate fields
    if (!email || !password) throw Error('Missing fields')

    const account = await this.findOne({ email })
    if (!account) throw Error('Incorrect email')

    // Validate hashed password
    const match = await bcrypt.compare(password, account.password)
    if (!match) throw Error('Incorrect password')

    return account
}

accountSchema.statics.createNew = async function (name, email, password) {
    if (!name || !email || !password) throw Error('Missing fields')

    if (!validator.isEmail(email)) throw Error('Invalid email')
    const exists = await this.findOne({ email })
    if (exists) throw Error('Email already exist')

    if (zxcvbn(password).score < 2) throw Error('Password not strong')

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const account = await this.create({
        name, email, password: hash
    })
    return account
}


module.exports = mongoose.model('Account', accountSchema)