const { Schema, model } = require("mongoose");

const CouponSchema = Schema({
    code:{
        type: String,
        required: [true, 'code required'],
        trim: true,
        unique: true,
        min: [16, 'min must be 16'],
        max: [16, 'max must be 16']
    },
    discount:{
        type: Number,
        required:[true, 'disscount required'],
        trim:true,
        default: 0,
        min: [0, 'min must be 0'],
        max: [90, 'max must be 90']
    },
    type:{
        type:String,
        enum: ['uses', 'date'],
        default: 'uses'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    dateLimit:{
        type:Date
    },
    uses:{
        type: Number,
        default: 0
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
}, { versionKey: false })

module.exports = model('Coupon', CouponSchema)