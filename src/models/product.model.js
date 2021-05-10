const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name required!'],
        trim: true,
        unique: true
    },
    photo: {
        type: String,
        required: [true, 'Photo required']
    },
    price: {
        type: Number,
        required: [true, 'Price required!'],
    },
    desc: {
        type: String
    }
},{
    versionKey: false
})

module.exports = model('Product', ProductSchema)