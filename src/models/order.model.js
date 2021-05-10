const { Schema, model } = require("mongoose");

const OrderSchema = Schema({
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product required']
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    total: {
        type: Number,
        required: [true, 'Total required']
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