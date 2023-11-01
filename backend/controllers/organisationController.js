const mongoose = require('mongoose')
const fs = require('fs')
const validator = require('validator')

const Organisation = require('../models/organisationModel')
const logger = require("../utils/logger")
const {
    ValidationError,
    MissingFieldError,
    DataNotFoundError,
} = require("../errors/customError")
const { ORG_CATEGORIES, MAX_TEXT_LEN, MAX_LONG_TEXT_LEN } = require("../utils/globalVars")

// Apply for new organisation
const applyOrganisation = async (req, res) => {

    const userId = req.account._id

    try {
        if (!req.info) throw new MissingFieldError("Missing images", req)
        const { name, description, category, banner, poster } = req.info

        // Fields validation
        if (!name) throw new MissingFieldError("Missing name", req)
        if (!description) throw new MissingFieldError("Missing description", req)
        if (!banner) throw new MissingFieldError("Missing banner image", req)
        if (!poster) throw new MissingFieldError("Missing poster image", req)
        if (!category) throw new MissingFieldError("Missing category", req)

        const sanitizedName = validator.escape(validator.trim(name))
        if (sanitizedName.length > MAX_TEXT_LEN) throw new ValidationError("Length of 'name' too long (Max: 256 characters)", req)

        const sanitizedDescription = validator.escape(validator.trim(description))
        if (sanitizedDescription.length > MAX_LONG_TEXT_LEN) throw new ValidationError("Length of 'description' too long (Max: 2048 characters)", req)

        const sanitizedCategory = validator.escape(validator.trim(category))
        if (!ORG_CATEGORIES.includes(sanitizedCategory)) throw new DataNotFoundError("No such category", req)

        // Check duplicate org name
        const existingOrganisation = await Organisation.findOne({ name: sanitizedName })
        if (existingOrganisation) throw ValidationError(`Organisation with name '${sanitizedName}' already exist`, req)

        // Create new db entry
        const _id = new mongoose.Types.ObjectId()
        const orgPath = `media/organisation/${_id}`
        const bannerPath = `${orgPath}/banner/${banner.originalFilename}`
        const posterPath = `${orgPath}/poster/${poster.originalFilename}`
        const organisation = await Organisation.create({
            _id,
            name,
            description,
            imagePath: {
                banner: bannerPath,
                poster: posterPath
            },
            requestedBy: userId,
            category
        })

        // Create new path for image to be stored in
        if (!fs.existsSync(orgPath)) {
            logger.info(`Created organisation folder: ${_id}`, { actor: "SERVER" });
            fs.mkdirSync(`public/${orgPath}/banner`, { recursive: true })
            fs.mkdirSync(`public/${orgPath}/poster`, { recursive: true })
        }
        fs.renameSync(`uploads/banner/${banner.filename}`, `public/${bannerPath}`)
        fs.renameSync(`uploads/poster/${poster.filename}`, `public/${posterPath}`)

        logger.http(`Organisation application successful: ${_id}`, { actor: "USER", req })
        res.status(200).json({})
    } catch (err) {
        if (req.info && req.info.banner) fs.unlinkSync(`uploads/banner/${req.info.banner.filename}`)
        if (req.info && req.info.poster) fs.unlinkSync(`uploads/poster/${req.info.poster.filename}`)
        if (err.statusCode === 400 || err.statusCode === 404)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

const getAllCategories = async (req, res) => {
    res.status(200).json({ categories: ORG_CATEGORIES })
}

const getAllOrganisation = async (req, res) => {
    let { category } = req.body

    try {
        if (category && (
            !validator.isAlphanumeric(category) ||
            !ORG_CATEGORIES.includes(category.toLowerCase())
        )) throw new ValidationError('Invalid category')

        let query = { approved: true }
        if (category) {
            query["category"] = category
        }

        const organisations = await Organisation.find(query).select('name category posts imagePath')

        logger.http(`Organisations retrieved successfully, (Category: "${category ?? 'None'}")`, { actor: "USER", req })
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

const getAllOrganisationName = async (req, res) => {

    try {
        const organisations = await Organisation.find({}, { approved: true }).select('name')
        const orgNames = organisations.map(org => [org._id, org.name])

        logger.http(`Organisation name retrieved successfully`, { actor: "USER", req })
        res.status(200).json({ organisations: orgNames })
    } catch (err) {
        if (err.statusCode === 400)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
}

const getOrganisationById = async (req, res) => {
    let { id } = req.params

    try {
        if (!id) throw new MissingFieldError("Missing id", req)
        if (!mongoose.Types.ObjectId.isValid(id)) throw new ValidationError("Invalid id", req)

        const organisation = await Organisation.findOne({ _id: id, approved: true }).select("-requestedBy")
        if (!organisation) throw new DataNotFoundError('No such organisation', req)

        logger.http(`Organisation retrieved successfully, (ID: ${id})`, { actor: "USER", req })
        res.status(200).json({ organisation })
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
    applyOrganisation,
    getAllOrganisation,
    getAllOrganisationName,
    getAllCategories,
    getOrganisationById
}