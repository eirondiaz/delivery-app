const Order = require('../models/order.model')


// @desc        create an order
// @route       POST /api/v1/orders/
// @access      private ADMIN

exports.createOrder =async(req,res)=>{
    
    try {
        const newOrder = await Order.save( req.body)

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
    
    try {
        
        const orders = await Order.find()

        res.status(200).json({ok:true, data: orders})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

}

// @desc        get orders by order status
// @route       GET /api/v1/orders/
// @access      private ADMIN

exports.getOrdersByStatus = async (req ,res)=>{
    const {status} = req.params

    try {
        const orders = Order.find(status, {new: true})

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
    
    const { product }= req.params
    try {

        const orders = await Order.find({products: product})
        res.status(200).json({ok:true, data: orders})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}