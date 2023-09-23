require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")

const app = express()

const accountRoutes = require('./routes/account')
const organisationRoutes = require('./routes/organisation')

app.use(express.json())
app.use(cors())

// Middleware: for logging
app.use((request, response, next) => {
    console.log(request.path, request.method)
    next()
})

// API Routes
app.use('/api/account', accountRoutes)
app.use('/api/organisation', organisationRoutes)
app.use(express.static(__dirname + '/public'))

// DB Conn
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Request Listener
        app.listen(process.env.PORT, () => {
            console.log('Database connection successful')
            console.log('Listening on port:', process.env.PORT)
        })
    })
    .catch((err) => console.log(err))