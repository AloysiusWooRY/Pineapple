const multer = require('multer')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const moment = require('moment')

function handleUploadError(err, req, res, next) {
    if (err && err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).json({ error: `Invalid file fields found: ${err.field}` });
    } else {
        next();
    }
}

module.exports = handleUploadError