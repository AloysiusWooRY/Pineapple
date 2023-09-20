const mongoose = require('mongoose')

const Reply = require('./replyModel')
const Post = require('./postModel')
const Like = require('./likeModel')
const Account = require('./likeModel')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    content: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, required: true, ref: Account },
    post: { type: Schema.Types.ObjectId, required: true, ref: Post },
    replies: [{ type: Schema.Types.ObjectId, required: false, ref: Reply }],
    likeValue: { type: Number, required: true, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, required: false, ref: Like }],
    approved: { type: Boolean, required: true, default: false }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Comment', commentSchema)