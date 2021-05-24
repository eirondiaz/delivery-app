const Order = require('../models/order.model')
const Cart = require('../models/cart.model')
const Coupon = require('../models/coupon.model')
const Product = require('../models/product.model')
const User = require('../models/user.model')
const History = require('../models/history.model')
const moment = require('moment')

// @desc        create an order
// @route       POST /api/v1/orders/
// @access      private ADMIN
exports.createOrder =async(req,res)=>{
    const { subtotal, address, coupon } = req.body
    
    try {
        let cpn
        if (coupon) {
            cpn = await Coupon.findOne({_id: coupon})

            if(!cpn) return res.status(404).json({ok: false, msg: 'coupon not found'})

            cpn.deprecated && res.status(200).json({ok: false, msg: 'coupon deprecated'})

            let cpnApplied = await Order.findOne({$and: [{user: req.user._id}, {coupon}]})

            if(cpnApplied) return res.status(200).json({ok: false, msg: 'coupon already used'})
        }

        const carts = await Cart.find({user: req.user._id})
            .select('-user')
            .populate('product')

        carts.length === 0 && res.status(400).json({ok: false, msg: 'empty cart'})

        let discount = 0
        if (cpn) {
            let per = cpn.discount / 100
            discount = subtotal * per
        }

        const order = new Order({
            items: carts,
            user: req.user._id,
            subtotal,
            total: subtotal - discount,
            discount,
            address,
            coupon
        })

        await order.save()

        await Cart.deleteMany({user: req.user._id})

        if (coupon && cpn.type === 'uses') {
            let use = cpn.uses + 1

            if (use == cpn.usesLimit) {
                await Coupon.findByIdAndUpdate({_id: cpn._id}, {uses: use, deprecated: true})
            }
            else if (use < cpn.usesLimit) {
                await Coupon.findByIdAndUpdate({_id: cpn._id}, {uses: use})
            }
        }

        if (coupon) {
            let usercpn = cpn.usedBy

            usercpn.push({user: req.user._id, date: Date.now})

            await Coupon.findByIdAndUpdate(cpn._id, {usedBy: usercpn})
        }

        return res.status(200).json({ok: true, data: order})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// @desc        get order by id
// @route       GET /api/v1/orders/:id
// @access      private ADMIN, USER
exports.getOrderById = async(req, res)=>{
    const { id } = req.params
    const { _id, role } = req.user
    try {
        const order = await Order.findById(id)
            .populate('coupon')
            .populate('user')

        if (!order) return res.status(404).json({ok: false, msg: 'order not found'})

        if (role === 'USER_ROLE' && order.user._id.toString() !== _id.toString())
            return res.status(200).json({ok:false, msg: 'the order dont belong to you'})
        
        await Product.populate(order.items, 'product')

        return res.status(200).json({ok:true, data: order})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// @desc        get all orders
// @route       GET /api/v1/orders/
// @access      private ADMIN
exports.getAllOrders = async(req, res)=>{
    
    const { status, limit = 10 } = req.query
    try {
        
        let query = Order.find()
        
        if(status) query = Order.find({status})
        
        const orders = await query
            .sort({createdAt: -1})
            .limit(Number(limit))
            .populate('user')
            .populate('coupon')

        return res.status(200).json({ok:true, data: orders})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

}

// @desc        get all orders from user
// @route       GET /api/v1/orders/user
// @access      private USER
exports.getAllOrdersByUserLogged = async(req, res)=>{
    
    const {status} = req.query
    try {
        
        let query = Order.find({user: req.user._id}).populate('coupon')
        
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

// @desc        get top users 
// @route       GET /api/v1/orders/top-users
// @access      public
exports.getTopUsers = async (req, res) => {
    const { limit = 10 } = req.query
    try {
        //const top = await Order.aggregate([{"$sortByCount": "$user"}])
        const top = await Order.aggregate([
            {"$group": {_id: "$user", total: {$sum: "$subtotal"}}},
            {"$sort": { total : -1 } },
            {"$limit": limit },
            //{"$lookup" : { from: "User", localField: "_id", foreignField: "_id", as: "user" } },
        ])

        //let h = top.map(x => x._id)
        
        const aa = await User.find({_id: {$in: top}})

        top.map(x => x._id = aa.find(w => w._id.toString() === x._id.toString()))
        
        return res.status(200).json({ok: true, data: top})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

exports.getOrdersBycurrentDate = async (req, res) => {
    try {
        //const orders = await Order.find({createdAt: moment(Date.now()).format()})
        const orders = await Order.find({createdAt: {$eq: new Date('2021-05-22')}})
        console.log(moment().format('YYYY-MM-DD'))
        console.log(moment().subtract(1, "days").format('YYYY-MM-DD'))

        return res.status(200).json({ok: true, data: orders})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// @desc        get top products
// @route       GET /api/v1/orders/top-products
// @access      public
exports.getTopProducts = async (req, res) => {
    try {
        const prods = await Order.aggregate([
            {$unwind: "$items"}, 
            {
                $group: {
                    _id: "$items.product", 
                    total: {$sum: "$items.total"},
                    qty: {$sum: "$items.quantity"}
                }
            },
            {
                $sort: {total: -1}
            },
            { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
        ])

        return res.status(200).json({ok: true, data: prods})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}