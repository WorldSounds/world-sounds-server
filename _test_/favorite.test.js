const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize
const { verifyToken } = require('../helpers/jwt')

let access_token = null
let UserId = null
let favGenreId = null

beforeAll((done) => {
    queryInterface.bulkInsert('Users', [{
        email: 'test@mail.com',
        username: 'test123',
        password: hashPassword('okokok'),
        createdAt: new Date(),
        updatedAt: new Date()
    }], { returning: true })
        .then(user => {
            // done()
            const input = {
                email: 'test@mail.com',
                password: 'okokok'
            }

            return request(app)
                .post('/login')
                .send(input)
                .end((err, res) => {
                    if (err) {
                        done(err)
                    }

                    access_token = res.body.access_token
                    let decoded = verifyToken(access_token)
                    UserId = decoded.id

                    //done()
                    return queryInterface.bulkInsert('FavoriteGenres', [{
                        UserId,
                        Genre: 'rock',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }], { returning: true })
                        .then(user => {
                            favGenreId = user.id
                            done()
                        })
                        .catch(err => {
                            done(err)
                        })
                })
        })
        .catch(err => {
            done(err)
        })

})

afterAll(done => {
    queryInterface.bulkDelete('FavoriteGenres')
        .then(_ => {
            done()
        })
        .catch(err => {
            done(err)
        })
})

describe('favorite genre add/get by id/delete', (done) => {
    describe('add fav genre successfully', (done) => {
        it('add fav genre success with status code 201', (done) => {
            request(app)
                .post('/favgenre')
                .set('access_token', access_token)
                .send({ UserId: 1, Genre: 'pop' })
                .end((err, res) => {
                    const { status, body } = res
                    if (err) return done(err)
                        .expect(status).toBe(201)
                        .expect(body).toHaveProperty(
                            'id',
                            expect.any(Number)
                        )
                        .expect(body).toHaveProperty(
                            'genre',
                            expect.any(String)
                        )

                    done()
                })
        })
    })

    describe('get all favorite genre based on user id ', (done) => {
        it('get all fav genre success with status code 200', (done) => {
            request(app)
                .get('/favgenre')
                .set('access_token', access_token)
                .UserId(UserId)
                .end((err, res) => {
                    const { status, body } = res
                    if (err) return done(err)
                        .expect(status).toBe(200)
                        .expect(body).toHaveProperty(
                            'id',
                            expect.any(Number)
                        )
                        .expect(body).toHaveProperty(
                            'genre',
                            expect.any(String)
                        )

                    done()
                })
        })
    })

    describe('delete single favorite genre based on user id', (done) => {
        it('delete successfully with status code 200', (done) => {
            request(app)
                .get('/favgenre' + `/${favGenreId}`)
                .set('access_token', access_token)
                .UserId(UserId)
                .end((err, res) => {
                    const { status, body } = res
                    if (err) return done(err)
                        .expect(status).toBe(200)
                        .expect(body).toHaveProperty(
                            'message',
                            expect.any(String)
                        )

                    done()
                })
        })
    })
})