const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Account = require('./accountModel')

const resetKeySchema = new Schema({
    account: { type: Schema.Types.ObjectId, required: true, ref: Account },
    email: { type: String, required: true },
    key: { type: String, required: true }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('ResetKey', resetKeySchema)