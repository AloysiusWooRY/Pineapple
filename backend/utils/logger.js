const moment = require('moment')
const { createLogger, transports, format } = require('winston')
const { combine, timestamp, printf, simple, json } = format

const fileLogFormat = printf(({ level, message, timestamp, actor, req }) => {
    const formattedTimestamp = moment(timestamp).format('DD.MM HH:mm:ss')

    const logObject = actor === "SERVER" ? {
        timestamp: formattedTimestamp,
        actor: "SERVER",
        level: level.toUpperCase(),
        message: message,
    } : {
        timestamp: formattedTimestamp,
        actor: "SERVER",
        account: req.account?._id ?? null,
        ip: req.headers?.["x-real-ip"] || req.ip || null,
        session: req.sessionID ?? null,
        level: level.toUpperCase(),
        message: message,
        httpmethod: req.method,
        httprequest: req.originalUrl
    }

    return JSON.stringify(logObject);
})

const consoleLogFormat = printf(({ level, message }) => {
    return `${level.toUpperCase()}: ${message}`;
})

const logger = createLogger({
    level: 'http',
    transports: [
        new transports.Console({
            format: combine(timestamp(), consoleLogFormat)
        }),
        new transports.File({
            filename: 'server-info.log',
            format: combine(timestamp(), fileLogFormat)
        }),
    ]
})

module.exports = logger