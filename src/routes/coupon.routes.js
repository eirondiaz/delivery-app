const { Router } = require('express')
const router = Router()
const couponCtrl = require('../controllers/coupon.controller')
const { authMdlw } = require('../middlewares/auth.middleware')
const { adminMdlw } = require('../middlewares/admin.middleware')

router.get('/', adminMdlw, couponCtrl.getAll)

router.get('/:code', authMdlw, couponCtrl.getByCode)

router.post('/', adminMdlw, couponCtrl.create)

module.exports = router