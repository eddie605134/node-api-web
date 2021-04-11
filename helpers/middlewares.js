require('dotenv').config()
const jwt = require("jsonwebtoken");

function mustBeInteger (req, res, next) {
  const id = req.params.id
  if (!Number.isInteger(parseInt(id))) {
    res.status(400).json({ message: 'ID must be an integer' })
  } else {
    next()
  }
}

function checkFieldsPost (req, res, next) {
  const { userName, userAuth, department, tourData } = req.body
  if (userName && userAuth && department && tourData) {
    next()
  } else {
    res.status(400).json({ message: 'fields are not good' })
  }
}

function authenticateToken (req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

function setHeader (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next()
}

module.exports = {
  mustBeInteger,
  checkFieldsPost,
  authenticateToken,
  setHeader
}