const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize
const { hashPassword } = require('../helpers/bcrypt')

let access_token = null

beforeAll(done => {
  queryInterface.bulkInsert('Users', [{
    email: 'test@mail.com',
    username: 'test123',
    password: hashPassword('okokok'),
    createdAt: new Date(),
    updatedAt: new Date()
  }], { returning: true })
    .then(_ => {
      done()

      // return request(app)
      //   .post('/login')
      //   .send({ validator: 'test@mail.com', password: 'okokok' })
      //   .end((err, res) => {
      //     const { status, body } = res
      //     if (err) return done(err)

      //     access_token = body.access_token

      //     done()
      //   })
    })
    .catch(err => {
      console.log(err, '<<<<<<<<<<<<<<<<<< before alll')
      done(err)
    })
})

afterAll(done => {
  queryInterface.bulkDelete('Users')
    .then(_ => {
      done()
    })
    .catch(err => {
      done(err)
    })
})

describe('Login User Post /login', () => {
  describe('Login Successfull', () => {
    it('Succes Login With Email', (done) => {
      request(app)
        .post('/login')
        .send({ validator: 'test@mail.com', password: 'okokok' })
        .end((err, res) => {
          const { status, body } = res
          if (err) return done(err)
            .expect(status).toBe(200)
            .expect(body).toHaveProperty(
              'access_token',
              expect.any(String)
            )
          done()

        })
    })

    it('Success Login With Username', (done) => {
      request(app)
        .post('/login')
        .send({ validator: 'test123', password: 'okokok' })
        .end((err, res) => {
          const { status, body } = res
          if (err) return done(err)
            .expect(status).toBe(200)
            .expect(body).toHaveProperty(
              'access_token',
              expect.any(String)
            )
          done()
        })
    })

    it('get user data based on its id', (done) => {
      request(app)
        .get('/user')
        .set('access_token', access_token)
        .end((err, res) => {
          const { status, body } = res
          if (err) return done(err)
            .expect(status).toBe(200)
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

  describe('Failed Login', () => {
    it('Failed login because email does not exist in db ', (done) => {
      request(app)
        .post('/login')
        .send({ validator: 'wadiwaw@mail.com', password: 'okokok' })
        .end((err, res) => {
          const { status, body } = res
          if (err) return done(err)
            .expect(status).toBe(400)
            .expect(body).toHaveProperty(
              'msg',
              'Invalid Email / Username / Password'
            )
          done()
        })
    })

    it('Failed login because username not exist in db', (done) => {
      request(app)
        .post('/login')
        .send({ validator: 'wadiwaw', password: 'okokok' })
        .end((err, res) => {
          const { status, body } = res
          if (err) return done(err)
            .expect(status).toBe(400)
            .expect(body).toHaveProperty(
              'msg',
              'Invalid Email / Username / Password'
            )
          done()
        })
    })

    it('Failed login because email / username / password wrong ', (done) => {
      request(app)
        .post('/login')
        .send({ validator: 'wadiwaw@mail.com', password: 'okokok' })
        .end((err, res) => {
          const { status, body } = res
          if (err) return done(err)
            .expect(status).toBe(400)
            .expect(body).toHaveProperty(
              'msg',
              'Invalid Email / Username / Password'
            )
          done()
        })
    })
  })

})
