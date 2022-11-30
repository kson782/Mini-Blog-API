const {verify} = require('jsonwebtoken');
const User = require('./models/User')

const verifyAuth = async(req, res, next) => {
  token = req.cookies.token 
  if (!token) throw new Error('Not Authorized')
  payload = verify(token, process.env.REFRESH_TOKEN_SECRET)
  const user = await User.findById(payload.userId)
  req.user = user
  next()
}

module.exports = {
  verifyAuth
};
