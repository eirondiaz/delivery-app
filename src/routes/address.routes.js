const { Router } = require('express')
const router = Router()

const {authMdlw} = require('../middlewares/auth.middleware')
const addressCtrl = require('../controllers/address.controller')

router.get('/',[
    authMdlw
], addressCtrl.getAddressByUserLogged)

router.post('/',[
    authMdlw
], addressCtrl.createAddress)

router.put('/:id',[
    authMdlw
], addressCtrl.editAddress)

router.delete('/:id',[
    authMdlw
], addressCtrl.deleteAddress)

module.exports = router