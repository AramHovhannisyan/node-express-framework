const path = require('path')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const compression = require('compression')

const testRouter = require('./routes/testRoutes')

const app = express()

// Middlewares

// Serving Static Files
app.use(express.static(path.join(__dirname, 'public')))

// Security http headers
app.use(helmet())

if(process.env.NODE_ENV === 'dev'){
    app.use(morgan('dev'))
}

// Allow only 100 request in 1h from 1 IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Requests Whit This Ip, Please Try Again Later'
})
app.use('/api', limiter)

// Body Parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}))
app.use(express.urlencoded({extended: true, limit: '10kb'}))
app.use(cookieParser())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent Parameter Pollusion
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}))

app.use(compression())

// CUSTOM Middleware

app.use((req, res, next) => {
    // console.log("Cookies: ", req.cookies)
    next()
})


/**
 * Routes
 * Mounting Routes
 */

app.use('/api/v1/test', testRouter)

// Start Server
// const port = process.env.PORT || 4000
// const server = app.listen(port, () => {
//     console.log(`Running On Port ${port}`);
// })

module.exports = app