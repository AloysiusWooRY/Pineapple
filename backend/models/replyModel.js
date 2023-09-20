const mongoose = require('mongoose')

const Account = require('./accountModel')
const Schema = mongoose.Schema

const replySchema = new Schema({
    content: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, required: true, ref: Account },
    likeValue: { type: imagePathSchema, required: false },
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Reply', replySchema)