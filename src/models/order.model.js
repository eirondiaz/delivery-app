const { Schema, model } = require("mongoose");

const OrderSchema = Schema({
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Cart',
        required: [true, 'item required']
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    total: {
        type: Number
    },
    status:{
        type: String,
        enum:['ordered', 'accepted', 'in-transit', 'delivered'],
        default: 'ordered'
    },
    address:{
        type: String,
    }
},{
    versionKey: false,
    timestamps: true
})

module.exports = model('Order', OrderSchema)