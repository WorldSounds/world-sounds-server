const { verifyToken } = require('../helpers/jwt')
const { User, FavoriteGenre } = require('../models')

function authentication(req, res, next) {
    try {
        let decoded = verifyToken(req.headers.access_token)
        User.findOne({
            where: {email: decoded.email}
        })
            .then(data => {
                if (!data) {
                    next({
                        name: 'noAuth',
                        status: 401
                    })
                } else {
                    req.UserId = data.id
                    next()
                }
            })
    } catch (error) {
        // next({
        //     message: error.message,
        //     code: 500,
        //     from: 'middleware: authentication'
        // })
        next(err)
    }
}

function authorization(req, res, next) {
    const favGenreId = +req.params.id
    const UserId = +req.UserId

    FavoriteGenre.findOne({
        where: { id: favGenreId }
    })
        .then(data => {
            if (!data || data.UserId !== UserId) {
                next({
                    name: 'noAuthorized',
                    status: 401,
                })
            } else {
                next()
            }
        })
        .catch(err => {
            next(err)
        })
}

module.exports = { authentication, authorization }