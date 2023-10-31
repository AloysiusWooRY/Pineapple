const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Account = require('./accountModel')
const Post = require('./postModel')

const transactionSchema = new Schema({
    account: { type: Schema.Types.ObjectId, required: true, ref: Account },
    paymentInfo: { type: String, required: true },
    amount: { type: Number, required: true },
    post: { type: Schema.Types.ObjectId, required: true, ref: Post },
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Transaction', transactionSchema)