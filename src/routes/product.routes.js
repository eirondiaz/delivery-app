const { Router } = require('express')
const router = Router()
const productCtrl = require('../controllers/product.controller')
const { adminMdlw } = require('../middlewares/admin.middleware')

router.get('/', productCtrl.getAllProducts)

router.get('/:id', productCtrl.getProductById)

router.post('/', adminMdlw, productCtrl.createProduct)

router.put('/:id', adminMdlw, productCtrl.updateProduct)

router.delete('/:id', adminMdlw, productCtrl.deleteProduct)

module.exports = router