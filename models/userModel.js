const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName :{
        type: String,
        required: true
    },
    lastName :{
        type: String,
        required: true
    },
    email :{
        type: String,
        required: true,
        unique: true
    },
    phone :{
        type: Number,
        required: true
    },
    password :{
        type: String,
        required: true
    },
    role :{
        type: Number,
        default: 0
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Users', UserSchema)