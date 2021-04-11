require('dotenv').config()
const jwt = require("jsonwebtoken")
const fs = require('fs')


const getNewId = (array) => {
  if (array.length > 0) {
    return array[array.length - 1].id + 1
  } else {
    return 1
  }
}

const newDate = () => new Date().toString()

function checkUserName (array, userName) {
  return new Promise((resolve, reject) => {
    const row = array.find(r => r.userName == userName)
    if (!row) {
      reject({
        message: 'userName is not good',
        status: 404
      })
    }
    resolve(row)
  })
}

function generateAccessToken (user, refresh) {
  if (!refresh) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' })
  } else {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  }

}

function mustBeInArray (array, id) {
  return new Promise((resolve, reject) => {
    const row = array.find(r => r.id == id)
    if (!row) {
      reject({
        message: 'ID is not good',
        status: 404
      })
    }
    resolve(row)
  })
}

function writeJSONFile (filename, content) {
  fs.writeFileSync(filename, JSON.stringify(content), 'utf8', (err) => {
    if (err) {
      console.log(err)
    }
  })
}

module.exports = {
  getNewId,
  newDate,
  checkUserName,
  generateAccessToken,
  mustBeInArray,
  writeJSONFile
}