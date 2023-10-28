const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    time: ({ type: Date, required: true }),
    membersCount: { type: Number, required: true, default: 0 },
    members: [{ type: Schema.Types.ObjectId, required: false, ref: 'Account' }],
})

const donorSchema = new Schema({
    account: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
    amount: { type: Number, required: true },
    createdAt: { type: Date, required: true, default: Date.now }
}, { _id: false })

const donationSchema = new Schema({
    goal: { type: Number, required: true },
    amount: { type: Number, required: true, default: 0 },
    donors: [{ type: donorSchema, required: false }],
})

const postSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
    organisation: { type: Schema.Types.ObjectId, required: true, ref: 'Organisation' },
    isPinned: { type: Boolean, required: true, default: false },
    event: { type: eventSchema, required: false },
    donation: { type: donationSchema, required: false },
    imagePath: { type: String, required: false },
    likes: { type: Number, required: true, default: 0 },
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Post', postSchema)