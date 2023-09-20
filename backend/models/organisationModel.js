const mongoose = require('mongoose')

const Schema = mongoose.Schema

const imagePathSchema = new Schema({
    banner: { type: String, required: false },
    icon: { type: String, required: false }
})

const organisationSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imagePath: { type: imagePathSchema, required: false },
    approved: { type: Boolean, required: true, default: false }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Organisation', organisationSchema)