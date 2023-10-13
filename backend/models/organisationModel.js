const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imagePathSchema = new Schema({
    banner: { type: String, required: false },
    poster: { type: String, required: false }
}, { _id: false })

const organisationSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imagePath: { type: imagePathSchema, required: false },
    approved: { type: Boolean, required: true, default: false },
    requestedBy: { type: Schema.Types.ObjectId, required: true, ref: 'Account' }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Organisation', organisationSchema)