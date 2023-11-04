const mongoose = require('mongoose')
const validator = require('validator')
const moment = require('moment')
const CryptoJS = require("crypto-js")

const Account = require('../models/accountModel')
const Post = require('../models/postModel')
const Transaction = require('../models/transactionModel')
const logger = require("../utils/logger")

const {
    ValidationError,
    MissingFieldError,
    DataNotFoundError
} = require("../errors/customError")

const createTransaction = async (req, res) => {
    const { post: postId, cvc, amount } = req.body
    const { _id: userId } = req.account
    try {
        if (!postId) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(postId)) throw new ValidationError("Invalid id", req)

        const existingPost = await Post.findOne({ _id: postId })
        if (!existingPost) throw new DataNotFoundError('No such post', req)
        if (!existingPost.donation) throw new ValidationError("Post have no active donations", req)

        const sanitizedCVC = validator.trim(cvc)
        if (!validator.isNumeric(sanitizedCVC) || !validator.isLength(sanitizedCVC, { min: 3, max: 4 })) {
            throw new ValidationError('Invalid CVC number', req)
        }

        if (!amount) throw new MissingFieldError("Missing amount", req)
        const sanitizedAmount = validator.escape(validator.trim(amount))
        if (!validator.isNumeric(sanitizedAmount)) throw new ValidationError("Invalid amount", req)
        if (!validator.isFloat(sanitizedAmount, { gt: 0.00, lt: 10000000 })) throw new ValidationError("Amount out of range (1 to 10000000)", req)
        if (!validator.isCurrency(sanitizedAmount, { digits_after_decimal: [0, 1, 2] })) throw new ValidationError("Invalid amount currency format", req)

        const account = await Account.findById(userId).select("paymentInfo")
        const { paymentInfo } = account
        if (!paymentInfo) throw new ValidationError("No available payment info", req)
        const decryptedPaymentInfo = JSON.parse(
            CryptoJS.AES.decrypt(
                paymentInfo,
                process.env.ENCRYPTION_SECRET
            ).toString(CryptoJS.enc.Utf8)
        )
        const { expirationDate } = decryptedPaymentInfo

        const timeFormatted = moment(expirationDate, 'MM/YY', true)
        const currentDate = moment().startOf('month').local()
        if (!timeFormatted.isAfter(currentDate)) throw new ValidationError("Card expired, please update in profile", req)

        await Transaction.create({
            account: userId,
            paymentInfo: paymentInfo,
            amount: sanitizedAmount,
            post: postId
        })

        const getSum = await Transaction.aggregate([
            { $match: { post: new mongoose.Types.ObjectId(postId) } },
            { $group: { _id: null, totalValue: { $sum: '$amount' } } }
        ])
        const sum = getSum[0]?.totalValue ?? 0

        existingPost.donation.amount = sum
        existingPost.donation.donors.push({
            account: userId,
            amount: sanitizedAmount
        })
        await existingPost.save()

        logger.http(`Donation successful`, { actor: "USER", req })
        res.status(200).json({ total: sum })
    } catch (err) {
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}




module.exports = {
    createTransaction
}