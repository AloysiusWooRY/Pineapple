const moment = require('moment')
const { createLogger, transports, format } = require('winston')
const { combine, timestamp, printf, simple, json } = format

const fileLogFormat = printf(({ level, message, timestamp, actor, req }) => {
    const formattedTimestamp = moment(timestamp).format('DD.MM HH:mm:ss');

    if (actor === "USER") {
        const ip = req.headers?.["x-real-ip"] || req.ip;
        const accountId = req.account ? req.account._id : "DEV";
        const logMessage = `(${req.method} ${req.originalUrl}) ${message}`;
        return `${formattedTimestamp} [${accountId}/${ip}] ${level.toUpperCase()}: ${logMessage}`;
    }

    return `${formattedTimestamp} [SERVER] ${level.toUpperCase()}: ${message}`;
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