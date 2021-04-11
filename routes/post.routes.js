require('dotenv').config()
const jwt = require("jsonwebtoken")
const express = require('express')
const router = express.Router()
const post = require('../models/post.model')
const log = require('../models/log.model')
const m = require('../helpers/middlewares')
// Routes
module.exports = router


let refreshTokens = []
/* Login */
router.post('/login', async (userReq, userRes) => {
  await log.login(userReq.body)
    .then(token => {
      refreshTokens.push(token?.refreshToken)
      return userRes.json(token).status(200)
    })
    .catch(err => userRes.json(err))
})

/* Token */
router.post('/token', async (userReq, userRes) => {
  await log.refreshToken(userReq.body, refreshTokens)
    .then(token => userRes.json(token).status(200))
    .catch(err => userRes.json(err))
})

/* Logout */
router.delete('/logout', async (userReq, userRes) => {
  refreshTokens = refreshTokens.filter(token => token !== userReq.body.token)
  userRes.sendStatus(204)
})

/* All posts */
router.get('/', m.authenticateToken, async (req, res) => {
  await post.getPosts()
    .then(posts => {
      const { userAuth } = posts.find(it => it.id == req.user.userId)
      if (userAuth > 1) return res.json(posts)
      throw {
        message: '權限不足'
      }
    })
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message })
      } else {
        res.status(500).json({ message: err.message })
      }
    })
})

/* A post by Employee ID */
router.get('/:id', m.mustBeInteger, async (req, res) => {
  const id = req.params.id
  await post.getPost(id)
    .then(post => res.json(post))
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message })
      } else {
        res.status(500).json({ message: err.message })
      }
    })
})

/* Insert a new post */
router.post('/', m.checkFieldsPost, async (req, res) => {
  await post.insertPost(req.body)
    .then(post => res.status(201).json({
      message: `The post #${post.id} has been created`,
      content: post
    }))
    .catch(err => res.status(500).json({ message: err.message }))
})

/* Update a post */
router.put('/:id', m.mustBeInteger, m.checkFieldsPost, async (req, res) => {
  const id = req.params.id
  await post.updatePost(id, req.body)
    .then(post => res.json({
      message: `The post #${id} has been updated`,
      content: post
    }))
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message })
      }
      res.status(500).json({ message: err.message })
    })
})

/* Delete a post */
router.delete('/:id', m.mustBeInteger, async (req, res) => {
  const id = req.params.id

  await post.deletePost(id)
    .then(post => res.json({
      message: `The post #${id} has been deleted`
    }))
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message })
      }
      res.status(500).json({ message: err.message })
    })
})