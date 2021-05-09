const { Schema } = require("mongoose");

const AddressSchema = Schema({
    street:{
        type: String,
        required: [true, 'Street required!'],
    },
    home: {
        type: String,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    desc:{
        type: String,
    }
},{
    versionKey: false,
})

module.exports = model('Address', AddressSchema)