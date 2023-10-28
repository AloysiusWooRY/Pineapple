const mongoose = require('mongoose')
const Schema = mongoose.Schema

const likeSchema = new Schema({
    comment: { type: Schema.Types.ObjectId, required: false, ref: 'Comment' },
    reply: { type: Schema.Types.ObjectId, required: false, ref: 'Reply' },
    post: { type: Schema.Types.ObjectId, required: false, ref: 'Post' },

    account: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
    value: { type: Number, required: true }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Like', likeSchema)