const { Router } =require('express')
const router = Router()
const cartCtrl = require('../controllers/cart.controller')
const { authMdlw } = require('../middlewares/auth.middleware')

router.get('/', authMdlw, cartCtrl.getAllCarts)

router.post('/', authMdlw, cartCtrl.createCart)

router.delete('/:id', authMdlw, cartCtrl.deleteCart)

module.exports = router