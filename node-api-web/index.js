const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()


app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require('./routes/index.routes'))
const port = 1337;

// app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port)


