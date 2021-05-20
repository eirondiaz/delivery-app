const { Schema, model } = require("mongoose");

const OrderSchema = Schema({
    items: [{
        type: Object,
        required: [true, 'items required']
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    total: {
        type: Number,
        required: [true, 'total required']
    },
    status:{
        type: String,
        enum:['ordered', 'accepted', 'in-transit', 'delivered'],
        default: 'ordered'
    },
    address:{
        type: String,
        default: 'Empty'
    },
    coupon: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon'
    }
},{
    versionKey: false,
    timestamps: true
})

module.exports = model('Order', OrderSchema)