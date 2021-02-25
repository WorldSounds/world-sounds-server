const router = require('express').Router()
const FavController = require('../controllers/fav-controller')
const { authentication, authorization } = require('../middlewares/auth')

// routing and endpoints
router.use(authentication)

router.get('/favgenre', FavController.getAll)
router.post('/favgenre', FavController.addFavGenre)

router.delete('/favgenre/:id', authorization, FavController.deleteFavGenre)

module.exports = router