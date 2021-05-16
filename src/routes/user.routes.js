const { Router } = require('express')
const router = Router()
const { authMdlw } = require('../middlewares/auth.middleware')
const userCtrl = require('../controllers/user.controller')

router.get('/',[
    authMdlw
],  userCtrl.getAllUsers )

router.get('/current-user',[
    authMdlw
],  userCtrl.getCurrentUser )

router.get('/:id',[
    authMdlw
],  userCtrl.getUserById )

router.put('/:id', [

],  userCtrl.editUser)

router.delete('/:id', [

],  userCtrl.deleteUser)

module.exports = router