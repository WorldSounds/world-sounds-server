const router = require('express').Router()
const UserController = require('../controllers/user-controller')

// routing and endpoints
router.post('/register', UserController.register)
router.post('/login', UserController.login)

module.exports = router