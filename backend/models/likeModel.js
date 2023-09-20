const mongoose = require('mongoose')

const Account = require('./commentModel')
const Account = require('./accountModel')
const Account = require('./accountModel')
const Schema = mongoose.Schema

const likeSchema = new Schema({
    comment: { type: Schema.Types.ObjectId, required: false, ref: Comment },
    reply: { type: Schema.Types.ObjectId, required: false, ref: Reply },
    account: { type: Schema.Types.ObjectId, required: true, ref: Account },
    value: { type: String, required: true, default: false }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Like', likeSchema)