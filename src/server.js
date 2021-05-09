const express = require('express')
const cors = require('cors')
require('./db/database')

//config
const app = express()
require('dotenv').config()
app.set('PORT', process.env.PORT || 3800)

//middlewares
app.use(cors())
app.use(express.json())

//routes
app.get('/', (req, res) => res.send('hola'))

module.exports = app