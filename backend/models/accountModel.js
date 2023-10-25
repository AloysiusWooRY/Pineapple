const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Organisation = require('./organisationModel')

const accountSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, required: true, default: false },
    hasTwoFA: { type: Boolean, required: true, default: false },
    twoFASecret: { type: String, required: true },
    moderation: [{ type: Schema.Types.ObjectId, required: false, ref: Organisation }],
    paymentInfo: { type: String, required: false }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Account', accountSchema)