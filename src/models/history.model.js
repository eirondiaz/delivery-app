const { Schema, model } = require("mongoose");

const HistorySchma = Schema({
    order:{
        type:  Schema.Types.ObjectId,
        ref: 'Order'
    },
    user:{
        type:  Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    versionKey: false,
})

module.exports = model('History', HistorySchma)