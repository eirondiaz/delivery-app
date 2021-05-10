const { Router } = require('express')
const router = Router()
const historyCtrl = require('../controllers/history.controller')

router.get('/',[], historyCtrl.getAllHistory)

router.get('/user', [], historyCtrl.getHistoryByUserLogged)

router.get('/:id', [], historyCtrl.getHistoryById)

module.exports = router

