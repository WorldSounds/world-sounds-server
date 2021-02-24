const router = require('express').Router()
const UserController = require('../controllers/user-controller')

// routing and endpoints
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/user', UserController.getById)
router.get('/loginSpotify', UserController.loginSpotify)
router.get('/callbacks', UserController.callbackLoginSpotify)
router.post('/refresh', UserController.refresh_token)

module.exports = router