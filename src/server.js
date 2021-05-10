const express = require('express')
const cors = require('cors')
require('./db/database')

//settings
const app = express()
require('dotenv').config()
app.set('PORT', process.env.PORT || 3800)

//middlewares
app.use(cors())
app.use(express.json())

//routes
app.get('/', (req, res) => res.send('hola'))
app.use('/api/v1/auth', require('./routes/auth.routes'))
app.use('/api/v1/users', require('./routes/user.routes'))
app.use('/api/v1/products', require('./routes/product.routes'))
app.use('/api/v1/orders', require('./routes/order.routes'))
app.use('/api/v1/history', require('./routes/history.routes'))
app.use('/api/v1/address', require('./routes/address.routes'))

module.exports = app