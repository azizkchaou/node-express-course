require('dotenv').config()
const express = require('express')
const errorHandlerMiddleware =  require('./middleware/error-handler')
const notFound = require('./middleware/not-found')
const app = express()
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')
const path = require('path')

//middleware
//parse json
app.use(express.json())

//serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')))

//CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

//routes
app.use('/api/v1/products' , productsRouter)

//serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//not found error
app.use(notFound)
//error handler
app.use(errorHandlerMiddleware)

const start  = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        const PORT = process.env.PORT || 5000
        app.listen(PORT , () => {
            console.log(`Server is listening on port ${PORT}...`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()