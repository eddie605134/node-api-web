require('dotenv').config()
const jwt = require("jsonwebtoken")
const path = require('path');
const filename = path.resolve(__dirname, '../data/posts.json')
let posts = require(filename)
const helper = require('../helpers/helper.js')

function login (userPost) {
  return new Promise((resolve, reject) => {
    const userName = userPost.userName
    helper.checkUserName(posts, userName)
      .then(({ password, id, userAuth }) => {
        const userId = id
        console.log(password)
        if (password != userPost.password) {
          resolve({
            message: 'password is not good',
            status: 404
          })
        }
        const accessToken = helper.generateAccessToken({ userName, userId, userAuth });
        const refreshToken = helper.generateAccessToken({ userName, userId, userAuth }, true);
        resolve({ accessToken, refreshToken, userName, userAuth, userId })
      })
  })
}

function refreshToken ({ token }, refreshTokens) {
  return new Promise((resolve, reject) => {
    const refToken = token
    if (refToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refToken)) return res.sendStatus(401)

    jwt.verify(refToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      const accessToken = helper.generateAccessToken({ userName: user.userName })
      resolve(accessToken)
    })
  })
}

module.exports = {
  login,
  refreshToken
}