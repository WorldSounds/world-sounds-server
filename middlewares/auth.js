const { verifyToken } = require('../helpers/jwt')
const { User } = require('../models')

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
                    req.userId = data.id
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

module.exports = {authentication}