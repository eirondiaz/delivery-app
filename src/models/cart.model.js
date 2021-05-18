const { Schema, model } = require("mongoose");

const CartSchema = Schema({ 
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product required']
    },
    quantity: {
        type: Number,
        required: [true, 'quantity required']
    },
    total: {
        type: Number
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user required']
    }
},{
    versionKey: false
})

module.exports = model('Cart', CartSchema)