const mongoose = require('mongoose')
const fs = require('fs')

const Organisation = require('../models/organisationModel')

// Apply for new organisation
const applyOrganisation = async (req, res) => {

    const userId = req.account._id
    const { name, description, banner, poster } = req.info

    try {
        // Check if there is error from file upload
        if (req.fileValidationError) throw Error(req.fileValidationError)

        // Fields validation
        if (!name) throw Error("Missing name")
        if (!description) throw Error("Missing description")

        // TODO: Check for fields length here

        // Check duplicate org name
        const existingOrganisation = await Organisation.findOne({ name })
        if (existingOrganisation) throw Error(`Organisation with name '${name}' already exist`)

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
            console.log("New organisation folder created")
            fs.mkdirSync(`public/${orgPath}/banner`, { recursive: true }, (err) => {
                if (err) console.log("Error in folder creation", err)
            })
            fs.mkdirSync(`public/${orgPath}/poster`, (err) => {
                if (err) console.log("Error in folder creation", err)
            })
        }
        fs.renameSync(`uploads/banner/${banner.filename}`, `public/${bannerPath}`)
        fs.renameSync(`uploads/poster/${poster.filename}`, `public/${posterPath}`)

        res.status(200).send()

    } catch (err) {
        if (banner) fs.unlinkSync(`uploads/banner/${banner.filename}`)
        if (poster) fs.unlinkSync(`uploads/poster/${poster.filename}`)
        res.status(400).json({ Error: err.message })
    }

}

module.exports = {
    applyOrganisation
}