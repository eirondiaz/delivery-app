const Order = require('../models/order.model')
const Cart = require('../models/cart.model')
const Coupon = require('../models/coupon.model')
const {isValidObjectId} = require('mongoose')
const History = require('../models/history.model')

// @desc        create an order
// @route       POST /api/v1/orders/
// @access      private ADMIN
exports.createOrder =async(req,res)=>{
    const { total, address, coupon } = req.body
    
    try {
        const cpn =  Coupon.findOne({code: coupon})

        !cpn && res.status(404).json({ok: false, msg: 'coupon not found'})

        cpn.deprecated && res.status(200).json({ok: false, msg: 'coupon deprecated'})

        const cpnApplied = await Order.findOne({$and: [{user: req.user._id}, {coupon}]})

        cpnApplied && res.status(200).json({ok: false, msg: 'coupon already used'})

        const carts = await Cart.find({user: req.user._id})
            .select('-user')
            .populate('product')

        carts.length === 0 && res.status(400).json({ok: false, msg: 'empty cart'})

        const order = new Order({
            items: carts,
            user: req.user._id,
            total,
            address,
            coupon
        })

        await order.save()

        await Cart.deleteMany({user: req.user._id})

        if (cpn.type === 'uses') {
            let use = cpn.uses + 1

            if (use == cpn.usesLimit) {
                await Coupon.findByIdAndUpdate(cpn._id, {uses: use, deprecated: true})
            }
            else if (use < cpn.usesLimit) {
                await Coupon.findByIdAndUpdate(cpn._id, {uses: use})
            }
        }

        return res.status(200).json({ok: true, data: order})
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
        
        const orders = await query.populate('user')

        return res.status(200).json({ok:true, data: orders})
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
        
        const orders = await query.populate('user')

        return res.status(200).json({ok:true, data: orders})
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
            
            const history = new History({order: order._id, user: order.user})
            
            await history.save()
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