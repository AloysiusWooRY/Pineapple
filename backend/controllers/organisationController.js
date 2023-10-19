const mongoose = require('mongoose')
const fs = require('fs')

const Organisation = require('../models/organisationModel')
const logger = require("../utils/logger")
const {
    ValidationError
} = require("../errors/customError")

// Apply for new organisation
const applyOrganisation = async (req, res) => {

    const userId = req.account._id
    const { name, description, banner, poster } = req.info

    try {
        // Fields validation
        if (!name) throw Error("Missing name")
        if (!description) throw Error("Missing description")
        if (!banner) throw Error("Missing banner image")
        if (!poster) throw Error("Missing poster image")

        // TODO: Check for fields length here

        // Check duplicate org name
        const existingOrganisation = await Organisation.findOne({ name })
        if (existingOrganisation) throw ValidationError(`Organisation with name '${name}' already exist`)

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
            requestedBy: userId
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
        res.status(200).send()
    } catch (err) {
        if (banner) fs.unlinkSync(`uploads/banner/${banner.filename}`)
        if (poster) fs.unlinkSync(`uploads/poster/${poster.filename}`)
        if (err.statusCode === 400)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }

}

module.exports = {
    applyOrganisation
}