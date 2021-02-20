// require
const express = require('express')
const app = express()
const port = 6300

const UserRouter = require('./routes/user-route')
const FavGenreRouter = require('./routes/fav-route')

// setting
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// routing
app.use(UserRouter)
app.use(FavGenreRouter)

// listening
app.listen(port, () => {
    console.log('listening on port ', port)
})
