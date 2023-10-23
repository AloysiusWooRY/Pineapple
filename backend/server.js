require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")

const app = express()

const accountRoutes = require('./routes/account')
const organisationRoutes = require('./routes/organisation')

const logger = require("./utils/logger")

app.use(express.json())

const corsOptions = {
    origin: process.env.URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
}
app.use(cors())

// Middleware: for logging
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// API Routes
app.use('/api/account', accountRoutes)
app.use('/api/organisation', organisationRoutes)
app.get('/api/ping', (req,res) => {
    res.status(200).send("pong")
})
app.use(express.static(__dirname + '/public'))

app.use((req, res, next) => {
    logger.http(`Attempted access to non-existing route: ${req.url}`, { actor: "USER", req });
    res.status(404).json({ error: 'Not Found' });
});

// DB Conn
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Request Listener
        app.listen(process.env.PORT, () => {
            logger.info(`Server started. Database connection successful. Listening on port: ${process.env.PORT}`, { actor: "SERVER" })
        })
    })
    .catch((err) => console.log(err))
