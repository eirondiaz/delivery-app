const Order = require('../models/order.model')
const Product = require('../models/product.model')
const {isValidObjectId} = require('mongoose')

// @desc        create an order
// @route       POST /api/v1/orders/
// @access      private ADMIN

exports.createOrder =async(req,res)=>{
    const { products, address } = req.body

    let total = 0
    
    await Promise.all( products.map (async _id => {
        !isValidObjectId (_id) && res.status(400).json({ok: false, msg: 'Product does not exist' + _id})

        let prod = await Product.findById(_id)
    
        !prod && res.status(400).json({ok: false, msg: 'Product does not exist' + _id})

        total = total + prod.price
    }))
    
    try {
        
        const newOrder = new Order({
            products,
            address,
            user: req.user._id,
            total
        })

        await newOrder.save()

        res.status(200).json({ok: true, data: newOrder})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// @desc        get all orders
// @route       GET /api/v1/orders/
// @access      private ADMIN

exports.getAllOrders = async(req, res)=>{
    
    const {status} = req.query
    try {
        
        let query = Order.find()
        
        if(status) query = Order.find({status})
        
        const orders = await query.populate('products').populate('user')

        res.status(200).json({ok:true, data: orders})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

}


// @desc        get all orders from user
// @route       GET /api/v1/orders/user
// @access      public USER

exports.getAllOrdersByUserLogged = async(req, res)=>{
    
    const {status} = req.query
    try {
        
        let query = Order.find({user: req.user._id})
        
        if(status) query = Order.find({$and:[{status}, {user: req.user._id}] })
        
        const orders = await query.populate('products').populate('user')

        res.status(200).json({ok:true, data: orders})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

}

// @desc        get orders by order status
// @route       GET /api/v1/orders/
// @access      private ADMIN

exports.getAllOrdersByProduct = async(req, res)=>{
    
    const { product }= req.query
    try {

        const orders = await Order.find({products: product})
        res.status(200).json({ok:true, data: orders})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

exports.modifyOrderStatus = async (req, res)=> {
    
    const {id} = req.params

    try {
        const order = await Order.findById(id)

        !order && res.status(404).json({ok:false, msg: `Order ${id} not found!`})

        let editedOrder = 'nada'
        const {status} = order
        
        if (status === 'ordered'){
            editedOrder = await Order.findByIdAndUpdate(id, {status: 'accepted'}, {new: true})
            .populate('products')
            .populate('user')
        } 
        if (status === 'accepted'){
            editedOrder = await Order.findByIdAndUpdate(id, {status:'in-transit'}, {new: true})
            .populate('products')
            .populate('user')
        } 
        if (status === 'in-transit'){
            editedOrder = await Order.findByIdAndUpdate(id, {status: 'delivered'}, {new: true})
            .populate('products')
            .populate('user')
        } 

        if(status==='delivered'){
            return res.status(200).json({ok:true, data: order})
            .populate('products')
            .populate('user')
        }

        return res.status(200).json({ok:true, data: editedOrder})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}