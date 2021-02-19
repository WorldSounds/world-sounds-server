const router = require('express').Router()
const UserController = require('../controllers/user-controller')

// routing and endpoints
route.post('/register', UserController.register)
route.post('/login', UserController.login)

module.exports = router