
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
// require
const express = require('express')
const cors = require('cors')
const app = express()

const UserRouter = require('./routes/user-route')
const FavGenreRouter = require('./routes/fav-route')
const errorHandler = require('./middlewares/errorHandler')

// setting
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// routing
app.use(UserRouter)
app.use(FavGenreRouter)
app.use(errorHandler)

// listening

module.exports = app