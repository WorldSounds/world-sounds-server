module.exports = (err, req, res, next) => {
  switch(err.name){
    case 'SequelizeValidationError':
      return res.status(400).json({
        msg: err.errors[0].message
      })
    case 'SequelizeUniqueConstraintError':
      return res.status(400).json({
        msg: 'email already registered'
      })
    case 'invalidLogin':
      return res.status(400).json({
        msg: 'Invalid Email / Username / Password'
      })
    case 'noAuth':
    return res.status(401).json({
      msg: 'Please Login first'
    })
    default:
      return res.status(500).json()
  }
}