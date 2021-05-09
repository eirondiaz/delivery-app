const { Schema, model } = require("mongoose");

const HistorySchma = Schema({
    order:{
        type:  Schema.Types.ObjectId,
        ref: 'Order'
    },
})

module.exports = model('History', HistorySchma)