const jwt  = require('jsonwebtoken');
const User = require('../models/user');

exports.auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const isAuth = jwt.verify(token,'generatetoken');
        const user = await User.findOne({ _id : isAuth._id , 'tokens.token' : token })
        if(!user){
            throw new Error()
            }
        req.token = token
        req.user = user

        next()
    }catch(e){
        console.log(e)
        res.status(401).json({
            message : 'Please Authenticate'
        })
    }
}