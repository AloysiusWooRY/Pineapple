const mongoose = require('mongoose')
const validator = require('validator')
const fs = require('fs')

const Account = require('../models/accountModel')
const Organisation = require('../models/organisationModel')

const logger = require("../utils/logger")
const {
    ValidationError,
    MissingFieldError,
    DataNotFoundError
} = require("../errors/customError")
const {
    USER_ROLE,
    ORG_STATUS,
    ORG_FILTERS
} = require("../utils/globalVars")

// Get all account
const getAllAccount = async (req, res) => {
    try {
        const accounts = await Account.find().select("-password -twoFASecret")

        logger.http(`Accounts retrieved`, { actor: "USER", req })
        res.status(200).json({ accounts })
    } catch (err) {
        if (err.statusCode === 400)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

// Edit account role
const editRoleAccount = async (req, res) => {
    const { account: userId, role, moderation } = req.body
    const { _id } = req.account

    try {
        if (!userId || !role) throw new MissingFieldError('Missing fields', req)
        if (!mongoose.Types.ObjectId.isValid(userId)) throw new ValidationError("Invalid id", req)

        const existingAccount = await Account.findById(userId)
        if (!existingAccount) throw new DataNotFoundError("No such account", req)

        if (_id.equals(new mongoose.Types.ObjectId(userId))) throw new ValidationError("Invalid id", req)
        if (!USER_ROLE.includes(role)) throw new ValidationError("Invalid role", req)

        switch (role) {
            case "user":
                existingAccount.isAdmin = false
                existingAccount.moderation = []
                break
            case "moderator":
                if (moderation) {
                    moderation.forEach((mod) => {
                        if (!mongoose.Types.ObjectId.isValid(mod)) throw new ValidationError("Invalid organisation id", req)
                    })

                    const orgCount = await Organisation.countDocuments({ _id: { $in: moderation } })
                    if (orgCount !== moderation.length) throw new ValidationError("Invalid organisation id", req)
                }

                existingAccount.isAdmin = false
                existingAccount.moderation = moderation
                break
            case "administrator":
                existingAccount.isAdmin = true
                existingAccount.moderation = []
                break
            default:
                throw new Error()
        }

        await existingAccount.save()

        const sanitizedAccount = existingAccount.toObject();
        delete sanitizedAccount.password
        delete sanitizedAccount.twoFASecret

        logger.http(`Account role edited: ${userId}`, { actor: "USER", req })
        res.status(200).json({ account: sanitizedAccount })
    } catch (err) {
        if (err.statusCode === 400)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

// Get application
const getApplication = async (req, res) => {
    const { status, filter } = req.body

    try {
        if (filter && (
            !validator.isAlphanumeric(filter) ||
            !ORG_FILTERS.includes(filter.toLowerCase())
        )) throw new ValidationError('Invalid filter', req)

        if (status && (
            !validator.isAlphanumeric(status) ||
            !ORG_STATUS.includes(status.toLowerCase())
        )) throw new ValidationError('Invalid status', req)

        const sort = { createdAt: -1 }
        if (filter === "status") sort["approved"] = 1

        const query = {}
        if (status === "approved") query["approved"] = true
        if (status === "pending") query["approved"] = false

        const organisations = await Organisation.find(query).sort(sort).populate("requestedBy", "name")

        logger.http(`Organisations retrieved`, { actor: "USER", req })
        res.status(200).json({ organisations })
    } catch (err) {
        if (err.statusCode === 400)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

// Get application
const approveApplication = async (req, res) => {
    const { id } = req.params

    try {
        if (!id) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(id)) throw new ValidationError("Invalid id", req)

        const existingOrganisation = await Organisation.findById(id)
        if (!existingOrganisation) throw new DataNotFoundError("No such organisation", req)

        if (existingOrganisation.approved) throw new ValidationError("Organisation already approved", req)
        existingOrganisation.approved = true
        await existingOrganisation.save()

        logger.http(`Organisations aproved: ${id}`, { actor: "USER", req })
        res.status(200).json({ existingOrganisation })
    } catch (err) {
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

// Reject application
const rejectApplication = async (req, res) => {
    const { id } = req.params

    try {
        if (!id) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(id)) throw new ValidationError("Invalid id", req)

        const existingOrganisation = await Organisation.findById(id)
        if (!existingOrganisation) throw new DataNotFoundError("No such organisation", req)

        const { approved, imagePath } = existingOrganisation
        const { banner, poster } = imagePath
        if (approved) throw new ValidationError("Organisation already approved", req)

        await Organisation.deleteOne({ _id: id })
        const fileDir = `public/${banner.split("/").slice(0, 3).join("/")}`

        fs.rmSync(fileDir, { recursive: true })

        logger.http(`Organisations rejected: ${id}`, { actor: "USER", req })
        res.status(200).json({ existingOrganisation })
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
    getAllAccount,
    editRoleAccount,
    getApplication,
    approveApplication,
    rejectApplication
}