const Product = require('../models/product.model')

// @desc        get all products
// @route       GET /api/v1/products
// @access      public
exports.getAllProducts = async (req, res) => {
    const { sort } = req.query

    try {
        let query = Product.find()
        if (sort === 'asc' || sort === 'desc') 
            query = Product.find().sort({price: sort})

        const prods = await query

        return res.status(200).json({ok: true, data: prods})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// @desc        get product by id
// @route       GET /api/v1/products/:id
// @access      public
exports.getProductById = async (req, res) => {
    const { id } = req.params
    try {
        const prod = await Product.findById(id)

        return res.status(200).json({ok: true, data: prod})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// @desc        create product
// @route       POST /api/v1/products
// @access      private ADMIN
exports.createProduct = async (req, res) => {
    // const {}
    try {
        const newProd = new Product(req.body)

        await newProd.save()

        return res.status(201).json({ok: true, data: newProd})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// @desc        update product
// @route       PUT /api/v1/products/:id
// @access      private ADMIN
exports.updateProduct = async (req, res) => {
    const {_id, ...rest} = req.body
    const { id } = req.params
    try {
        const prod = await Product.findById(id)

        !prod && res.status(404).json({ok: false, msg: 'product not found'})

        const updatedProd = await Product.findByIdAndUpdate(id, rest, { new: true })

        return res.status(200).json({ok: true, data: updatedProd})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// @desc        delete product
// @route       DELETE /api/v1/products/:id
// @access      private ADMIN
exports.deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        const prod = await Product.findById(id)

        !prod && res.status(404).json({ok: false, msg: 'product not found'})

        const deletedProd = await Product.findByIdAndDelete(id)

        return res.status(200).json({ok: true, data: deletedProd}) 
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}