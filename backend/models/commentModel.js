const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    content: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    likes: { type: Number, required: true, default: 0 },
    owner: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Comment', commentSchema)