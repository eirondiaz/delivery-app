const { Router } = require('express')
const router = Router()
const orderCtrl = require('../controllers/order.controller')
const { adminMdlw } = require('../middlewares/admin.middleware')
const { authMdlw } = require('../middlewares/auth.middleware')

const {check}=require('express-validator')

router.post('/',[
    authMdlw,
],  orderCtrl.createOrder)

router.get('/',[
    adminMdlw
],  orderCtrl.getAllOrders)

router.get('/top-users', orderCtrl.getTopUsers)

router.get('/user',[
    authMdlw
],  orderCtrl.getAllOrdersByUserLogged)

router.get('/:id',[
    authMdlw
],  orderCtrl.getOrderById)

router.put('/:id', [
    adminMdlw
], orderCtrl.modifyOrderStatus)

module.exports = router