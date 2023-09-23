const mongoose = require('mongoose')

const Comment = require('./commentModel')
const Account = require('./accountModel')
const Reply = require('./replyModel')
const Schema = mongoose.Schema

const likeSchema = new Schema({
    comment: { type: Schema.Types.ObjectId, required: false, ref: Comment },
    reply: { type: Schema.Types.ObjectId, required: false, ref: Reply },
    account: { type: Schema.Types.ObjectId, required: true, ref: Account },
    value: { type: String, required: true, default: false }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Like', likeSchema)