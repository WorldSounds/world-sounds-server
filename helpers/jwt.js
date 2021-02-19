const jwt = require('jsonwebtoken')
const SECRET_KEY = 'worldsound'

function generateToken(payload) {
    const token = jwt.sign(payload, SECRET_KEY)

    return token
}

function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY)
}

module.exports = { generateToken, verifyToken }