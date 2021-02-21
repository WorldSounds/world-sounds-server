const { User } = require('../models')
const { Op } = require("sequelize")
const { comparePassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')
const querystring = require('querystring')
const redirect_uri = 'http://localhost:6300/callbacks'


class Controller {
    static register(req, res, next) {
        const user = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }
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
                // next({
                //     message: 'Internal server error',
                //     code: 500,
                //     from: 'Controller user: register user'
                // })
                next(err)
            })
    }

    static login(req, res, next) {
        const { validator, password } = req.body
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
                    next()
                }

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
                    next()
                }

            })
            .catch(err => {
                // next({
                //     message: err.message,
                //     code: 400,
                //     from: 'Controller User: login user'
                // })
                next(err)
                // res.status(500).json('salah')
            })
    }
    static loginSpotify(req, res, next) {
        // console.log(process.env.SPOTIFY_CLIENT_ID)
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
            response_type: 'code',
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope: 'user-read-private user-read-email',
            redirect_uri
        }))
    }
    static callbackLoginSpotify(req, res, next){
        let code = req.query.code || null
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
            code: code,
            redirect_uri,
            grant_type: 'authorization_code'
            },
            headers: {
            'Authorization': 'Basic ' + (new Buffer(
                process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
            ).toString('base64'))
            },
            json: true
        }
        const request = require('request')
        request.post(authOptions, function(error, response, body) {
            var access_token = body.access_token
            var refresh_token = body.refresh_token
            console.log(refresh_token, '<<<< ini refresh tokenya ')
            let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
            const option = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            }
            // https://accounts.spotify.com/id/login?continue=https:%2F%2Faccounts.spotify.com%2Fauthorize%3Fscope%3Duser-read-private%2Buser-read-email%26response_type%3Dcode%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A6300%252Fcallbacks%26client_id%3Dd0574f1b62714617865db1237adeb779
            const axios = require('axios')
            let user;
            axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            })
                .then(({data}) => {
                    user = data
                    return User.findOne({
                        where: {
                            email: data.email
                        }
                    })
                })
                .then(userData => {
                    if(userData){
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
                    
                    const access_token_local = generateToken({email: userData.email, id: userData.id})
                    res.redirect(uri + '?access_token=' + access_token + '&access_token_lokal=' + access_token_local)
                })
                .catch(err => {
                    console.log(err)
                })
                // request.get(option, function(error, response, body) {
                    //     console.log(body)
                    // })
        })
    }
}

module.exports = Controller