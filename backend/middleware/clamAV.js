const ClamScan = require('clamscan');
const clamscan = new ClamScan();
const fs = require('fs')
const logger = require("../utils/logger")

const { InfectedFileError } = require("../errors/customError")

const clamAV = async (req, res, next) => {
    const { banner, poster } = req.info;
    const bannerPath = `uploads/banner/${banner.filename}`
    const posterPath = `uploads/poster/${poster.filename}`

    try {
        // Check files for viruses
        const { isInfected, file, viruses } = await clamscan.isInfected(bannerPath);
        // const scanResultsPoster = await clamscan.isInfected(posterPath);
        if (isInfected) throw new InfectedFileError('Infected file detected');

        res.status(200).send()
        // next();
    } catch (err) {
        console.log(err)
        if (banner) fs.unlinkSync(`uploads/banner/${banner.filename}`)
        if (poster) fs.unlinkSync(`uploads/poster/${poster.filename}`)

        if (err.statusCode === 400)
            res.status(err.statusCode).json({ error: err.message })
        else {
            logger.error(err.message, { actor: "USER", req })
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
};

module.exports = clamAV;