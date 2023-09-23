function handleUploadError(err, req, res, next) {
    if (err && err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).json({ error: `Invalid file fields found: ${err.field}` });
    } else {
        next();
    }
}

module.exports = handleUploadError