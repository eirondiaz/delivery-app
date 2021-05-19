const { Schema, model } = require("mongoose");

const CouponSchema = Schema({
    code:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        min: 16,
        max: 16
    },
    discount:{
        type: Number,
        required:true,
        trim:true,
        default: 0,
        min: 0,
        max: 90
    },
    type:{
        type:String,
        enum: ['date', 'uses' ],
        default: 'date'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    dateLimit:{
        type:Date,
        required: true
    },
    uses:{
        type: Number,
        defaul: 0
    },
    usesLimit:{
        type: Number,
        default: 0
    },
    deprecated: {
        type: Boolean,
        default: false
    },
    usedBy:[
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            date:{
                type: Date,
                default: Date.now
            }
        }
    ]
})

module.exports = model('Coupon', CouponSchema)