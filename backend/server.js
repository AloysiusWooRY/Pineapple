require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const cookieParser = require('cookie-parser');
const session = require('express-session');

const csurf = require('csurf');
const csrfErrorHandler = require('./middleware/csrfErrorHandler')

const app = express()

const accountRoutes = require('./routes/account')
const organisationRoutes = require('./routes/organisation')
const miscellaneousRoutes = require('./routes/miscellaneous')

const logger = require("./utils/logger")

app.use(express.json())
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}));

const corsOptions = {
    origin: process.env.WEBPAGE_URL,
    credentials: true,
    optionsSuccessStatus: 204,
}
app.use(cors(corsOptions))

const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection)
app.use(csrfErrorHandler)

// Middleware: for logging
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// API Routes
app.use('/api/account', accountRoutes)
app.use('/api/organisation', organisationRoutes)
app.use('/api', miscellaneousRoutes)
app.use(express.static(__dirname + '/public'))

app.use((req, res) => {
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
