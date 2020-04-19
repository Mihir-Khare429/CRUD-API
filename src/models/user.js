const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        unique : true,
        trim : true,
        required : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password : {
        type : String,
        trim : true,
        required : true,
        minlength : 6,
        validate(value){
            if ( value == "password" || value == "PASSWORD" || value == "Password"){
                throw new Error('Password cannot be password or Password or PASSWORD')
            }
        }
    },
    age : {
        type : Number,
        default : 0,
        validate(value){
            if( value < 0){
                throw new Error("Age cannot be negative")
            }
        }
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }]
},{
    timestamps : true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'author'
})

userSchema.methods.toJSON = function() {
    const user = this 
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateToken = async function()  {
    const user  = this
    const token = jwt.sign({ '_id' : user._id }, 'generatetoken')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email , password) => {
    const user = await  User.findOne({ email : email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password , user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user;

}

//Converting Plain text to Hashed Password
userSchema.pre('save',async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,8)
    }
    next()
})
const User = mongoose.model('User',userSchema)
module.exports = User
