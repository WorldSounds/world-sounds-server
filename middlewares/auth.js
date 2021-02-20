const { verifyToken } = require('../helpers/jwt')
const { User, FavoriteGenre } = require('../models')

function authentication(req, res, next) {
    try {
        let decoded = verifyToken(req.headers.access_token)

        User.findOne({
            where: { email: decoded.email }
        })
            .then(data => {
                if (!data) {
                    // next({
                    //     message: 'Please login first',
                    //     code: 401,
                    //     from: 'middleware: authentication'
                    // })
                    next()
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
        next()
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
                    message: 'disallowed',
                    code: 401,
                    from: 'middleware: authorization'
                })
            } else {
                next()
            }
        })
        .catch(err => {
            next({
                message: 'Internal server error',
                code: 500,
                from: 'middleware: authorization'
            })
        })
}

module.exports = { authentication, authorization }