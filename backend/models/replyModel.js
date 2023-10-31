const mongoose = require('mongoose')
const Schema = mongoose.Schema

const replySchema = new Schema({
    content: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
    likes: { type: Number, required: true, default: 0 },
    comment: { type: Schema.Types.ObjectId, required: true, ref: 'Comment' }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Reply', replySchema)