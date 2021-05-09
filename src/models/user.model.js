const { Schema, model } = require("mongoose");

const UserSchema = Schema({
    user:{
        type: String,
        required: [true, 'User required!'],
        trim: true,
        unique: true
    },
    name:{
        type: String,
        required: [true, 'Name required!'],
        trim: true,
    },
    lastName:{
        type: String,
        required: [true, 'Lastname required!'],
        trim: true,
    },
    phone:{
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: ['USER_ROLE','ADMIN_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    }
    
}, {
    versionKey: false,
    timestamps: true
})

module.exports = model('User', UserSchema)