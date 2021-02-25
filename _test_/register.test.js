const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize

afterAll(done => {
    queryInterface.bulkDelete('Users')
        .then(_ => {
            done()
        })
        .catch(err => {
            done(err)
        })
})

describe('Register User post/register', () => {
    describe('Register Successfully', () => {
        it('Register Success with code 201', (done) => {
            request(app)
                .post('/register')
                .send({ email: 'test@mail.com', username: 'test123', password: 'okokok' })
                .end((err, res) => {
                    const { status, body } = res
                    if (err) return done(err)
                        .expect(status).toBe(201)
                        .expect(body).toHaveProperty(
                            'id',
                            expect.any(Number)
                        )
                        .expect(body).toHaveProperty(
                            'email',
                            expect.any(String)
                        )
                        .expect(body).toHaveProperty(
                            'username',
                            expect.any(String)
                        )
                    done()

                })
        })
    })

    describe('Register Failed', () => {
        it('Register failed caused by empty email', (done) => {
            request(app)
                .post('/register')
                .send({ email: '', username: 'test123', password: 'okokok' })
                .end((err, res) => {
                    const { status, body } = res
                    if (err) return done(err)
                        .expect(status).toBe(500)
                        .expect(body).toHaveProperty(
                            'msg',
                            expect.any(String)
                        )
                        .expect(body.msg).toEqual('Internal Server Error')
            
                    done()

                })
        })

        it('Register failed caused by empty username', (done) => {
            request(app)
                .post('/register')
                .send({ email: 'test@mail.com', username: '', password: 'okokok' })
                .end((err, res) => {
                    const { status, body } = res
                    if (err) return done(err)
                        .expect(status).toBe(500)
                        .expect(body).toHaveProperty(
                            'msg',
                            expect.any(String)
                        )
                        .expect(body.msg).toEqual('Internal Server Error')
            
                    done()

                })
        })

        it('Register failed caused by empty password', (done) => {
            request(app)
                .post('/register')
                .send({ email: 'test@mail.com', username: 'test123', password: '' })
                .end((err, res) => {
                    const { status, body } = res
                    if (err) return done(err)
                        .expect(status).toBe(500)
                        .expect(body).toHaveProperty(
                            'msg',
                            expect.any(String)
                        )
                        .expect(body.msg).toEqual('Internal Server Error')
            
                    done()

                })
        })

        it('Register failed caused by invalid email format', (done) => {
            request(app)
                .post('/register')
                .send({ email: 'test', username: 'test123', password: 'okokok' })
                .end((err, res) => {
                    const { status, body } = res
                    console.log(status, '<<<<< sama')
                    console.log(body, '<<<<<<< email format test')
                    if (err) return done(err)
                        .expect(status).toBe(400)
                        .expect(body).toHaveProperty(
                            'msg',
                            'Invalid email format'
                        )
            
                    done()

                })
        })

        it('Register failed caused by username character less than 6 characters', (done) => {
            request(app)
                .post('/register')
                .send({ email: 'test@mail.com', username: 'test', password: 'okokok' })
                .end((err, res) => {
                    const { status, body } = res
                    if (err) return done(err)
                        .expect(status).toBe(400)
                        .expect(body).toHaveProperty(
                            'msg',
                            'Username length at least 6 characters'
                        )
                    done()

                })
        })

        it('Register failed caused by password length less than 6 characters', (done) => {
            request(app)
                .post('/register')
                .send({ email: 'test@mail.com', username: 'test123', password: 'okok' })
                .end((err, res) => {
                    const { status, body } = res
                    if (err) return done(err)
                        .expect(status).toBe(400)
                        .expect(body).toHaveProperty(
                            'msg',
                            'Password length at least 6 characters'
                        )
                    done()

                })
        })
    })
})