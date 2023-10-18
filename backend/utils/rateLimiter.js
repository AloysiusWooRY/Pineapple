const { RateLimitError } = require("../errors/customError")
const { rateLimit: RateLimit } = require("express-rate-limit");

const rateLimit = (window = 5, max = 20) => {
    return RateLimit({
        windowMs: window * 60 * 1000, // 5 minutes
        max: max, // Requests per window
        message: "Too many attempts, please try again later",
        handler: (req, res) => {
            const rateLimitError = new RateLimitError("Too many attempts, please try again later", req);
            res.status(rateLimitError.statusCode).json({ error: rateLimitError.message })
        },
    })
}

module.exports = rateLimit