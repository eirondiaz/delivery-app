const Coupon = require('../models/coupon.model')

// @desc        get all coupons
// @route       GET /api/v1/coupons/
// @access      private ADMIN
exports.getAll = async (req, res) => {
    const { deprecated } = req.query
    try {
        let query = Coupon.find()
        if (deprecated === 'true' || deprecated === 'false') {
            deprecated === 'true'? deprecated = true: deprecated = false 
            query = Coupon.find({deprecated})
        }

        const coupons = await query

        return res.status(200).json({ok: true, data: coupons})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// @desc        get coupon by code
// @route       GET /api/v1/coupons/:code
// @access      private ADMIN USER
exports.getByCode = async (req, res) => {
    const { code } = req.params
    try {
        const coupon = await Coupon.findOne({code})

        if (!coupon)
            return res.status(404).json({ok: false, msg: 'coupon not found'})

        if (req.user.role === 'USER_ROLE') {
            if (coupon.deprecated)
                return res.status(200).json({ok: false, msg: 'coupon deprecated'})

            return res.status(200).json({ok: true, data: coupon})
        }

        return res.status(200).json({ok: true, data: coupon})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// @desc        create coupon
// @route       POST /api/v1/coupons
// @access      private ADMIN
exports.create = async (req, res) => {
    const { code, discount, type, dateLimit, usesLimit } = req.body
    try {
        const coupon = new Coupon({
            code,
            discount,
            type,
            dateLimit,
            usesLimit
        })

        await coupon.save()

        return res.status(201).json({ok: true, data: coupon})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// @desc        uodate used by property
// @route       PUT /api/v1/coupons/
// @access      private USER
exports.updateUsedBy = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// @desc        uodate deprecated property
// @route       PUT /api/v1/coupons/
// @access      private USER, ADMIN
exports.updateDeprecated = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}