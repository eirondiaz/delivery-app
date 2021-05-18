const { findByIdAndDelete } = require('../models/cart.model')
const Cart = require('../models/cart.model')
const Product = require('../models/product.model')

exports.getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find({user: req.user._id})
            .populate('product')

        return res.status(200).json({ok: true, data: carts})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

exports.createCart = async (req, res) => {
    const { product, quantity } = req.body
    try {
        const prod = await Product.findById(product)

        !prod && res.status(404).json({ok: false, msg: 'product not found'})

        const cart = new Cart({
            product,
            quantity: Number(quantity),
            total: Number(prod.price) * Number(quantity),
            user: req.user._id
        })

        await cart.save()

        return res.status(201).json({ok: true, data: cart})        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

exports.deleteCart = async (req, res) => {
    try {
        const cardDeleted = await Cart.findByIdAndDelete(req.params.id)

        return res.status(200).json({ok: true, data: cardDeleted})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}