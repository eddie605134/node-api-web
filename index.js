const express = require('express')
const morgan = require('morgan')
const app = express()


app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require('./routes/index.routes'))
const port = 3000;

app.listen(port)


