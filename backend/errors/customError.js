const logger = require("../utils/logger")

class ValidationError extends Error {
    constructor(message, req) {
        super(message)
        this.statusCode = 400
        this.name = this.constructor.name

        logger.http(`${this.name} - ${message}`, { actor: "USER", req })
        Error.captureStackTrace(this, this.constructor)
    }
}

class MissingFieldError extends Error {
    constructor(message, req) {
        super(message)
        this.statusCode = 400
        this.name = this.constructor.name

        logger.http(`${this.name} - ${message}`, { actor: "USER", req })
        Error.captureStackTrace(this, this.constructor)
    }
}

class DataNotFoundError extends Error {
    constructor(message, req) {
        super(message)
        this.statusCode = 404
        this.name = this.constructor.name

        logger.http(`${this.name} - ${message}`, { actor: "USER", req })
        Error.captureStackTrace(this, this.constructor)
    }
}

class DuplicateRequestError extends Error {
    constructor(message, req) {
        super(message)
        this.statusCode = 409
        this.name = this.constructor.name

        logger.http(`${this.name} - ${message}`, { actor: "USER", req })
        Error.captureStackTrace(this, this.constructor)
    }
}

class AuthenticationError extends Error {
    constructor(message, req) {
        super(message)
        this.statusCode = 401
        this.name = this.constructor.name

        logger.warn(`${this.name} - ${message}`, { actor: "USER", req })
        Error.captureStackTrace(this, this.constructor)
    }
}

class CaptchaValidationError extends Error {
    constructor(message, req) {
        super(message)
        this.statusCode = 400
        this.name = this.constructor.name

        logger.warn(`${this.name} - ${message}`, { actor: "USER", req })
        Error.captureStackTrace(this, this.constructor)
    }
}

class RateLimitError extends Error {
    constructor(message, req) {
        super(message)
        this.statusCode = 429
        this.name = this.constructor.name

        logger.warn(`${this.name} - ${message}`, { actor: "USER", req })
        Error.captureStackTrace(this, this.constructor)
    }
}

class InfectedFileError extends Error {
    constructor(message, req) {
        super(message)
        this.statusCode = 400
        this.name = this.constructor.name

        logger.warn(`${this.name} - ${message}`, { actor: "USER", req })
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = {
    ValidationError,
    MissingFieldError,
    DataNotFoundError,
    DuplicateRequestError,
    AuthenticationError,
    CaptchaValidationError,
    RateLimitError,
    InfectedFileError
} 