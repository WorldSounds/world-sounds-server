const { User } = require('../models')
const { Op } = require("sequelize")
const { comparePassword } = require('../helpers/bcrypt')
const { generateToken, verifyToken } = require('../helpers/jwt')
const querystring = require('querystring')
const axios = require('axios')
const redirect_uri = process.env.REDIRECT_URI
const request = require('request')

class Controller {
    static register(req, res, next) {
        const user = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }
        console.log(user)
        User.create(user)
            .then(data => {
                const sent = {
                    id: data.id,
                    email: data.email,
                    username: data.username
                }
                res.status(201).json(sent)
            })
            .catch(err => {
                next(err)
            })
    }

    static login(req, res, next) {
        const { validator, password } = req.body
        console.log(req.body.password, '<<<<<< ini bos')
        console.log(validator)
        User.findOne({
            where: {
                [Op.or]: [
                    { email: validator },
                    { username: validator }
                ]
            }
        })
            .then(data => {
                if (!data) {
                    next({
                        name: 'invalidLogin',
                        code: 401
                    })
                }
                else {
                    const isValid = comparePassword(password, data.password)
                    if (isValid) {
                        // kirim jwt
                        const payload = {
                            id: data.id,
                            email: data.email
                        }

                        const access_token = generateToken(payload)
                        res.status(200).json({ access_token })
                    } else {
                        next({
                            name: 'invalidLogin',
                            code: 401,
                        })
                    }

                }

            })
            .catch(err => {
                next(err)
            })
    }

    static getById(req, res, next) {
        let decoded = verifyToken(req.headers.access_token)
        let { id } = decoded

        User.findOne({ where: { id } })
            .then(data => {
                if (!data) {
                    next({
                        name: 'item not found',
                        code: 401
                    })
                } else {
                    res.status(200).json(data)
                }
            })
            .catch(err => {
                res.send(err)
            })
    }

    static loginSpotify(req, res, next) {
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: process.env.SPOTIFY_CLIENT_ID,
                scope: 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private',
                redirect_uri
            }))
    }

    static callbackLoginSpotify(req, res, next) {
        let code = req.query.code || null
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
                ).toString('base64')
            },
            json: true
        }
        const request = require('request')
        request.post(authOptions, function (error, response, body) {
            var access_token = body.access_token
            var refresh_token = body.refresh_token
            console.log(body, '<<<< ini refresh tokenya ')
            let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
            const option = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            }
            const axios = require('axios')
            let user;
            axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            })
                .then(({ data }) => {
                    user = data
                    return User.findOne({
                        where: {
                            email: data.email
                        }
                    })
                })
                .then(userData => {
                    if (userData) {
                        return userData
                    }
                    else {
                        const username = user.email.split('@')
                        console.log(userData, '<<<< ini user data', user, '<<<<<< ini data global', 'then2')
                        return User.create({ email: user.email, username: username[0], password: 'random' })
                    }
                })
                .then(userData => {
                    console.log(userData, '<<<< ini user data', user, '<<<<<< ini data global', 'then3')
                    const access_token_spotify = access_token

                    const access_token_local = generateToken({ email: userData.email, id: userData.id })
                    console.log(refresh_token, '<<<<< ini refresh tokennya', access_token, '<<<< access_token biasa')
                    console.log(access_token_local)
                    res.redirect(`${uri}/dashboard/${access_token}/${access_token_local}/${refresh_token}`)
                })
                .catch(err => {
                    console.log(err)
                })
        })
    }
    static async refresh_token(req, res, next) {
        var refresh_token = req.body.refresh_token;
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { "Authorization": "Basic " + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64")) },
            form: {
                grant_type: "refresh_token",
                refresh_token: refresh_token
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            console.log(response)
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token;
                console.log(body, 'masuk<<<<<<')
                res.status(response.statusCode).json({ body })
            }
            else {
                res.send(error)
            }
        });
    }
}

module.exports = Controller