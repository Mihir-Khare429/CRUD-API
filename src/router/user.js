const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { auth } = require('../midlleware/auth')
const multer = require('multer')

const upload = multer({
    dest : 'avatar'
})

router.post('/users',async (req,res) => {
    try{
        const user = new User(req.body)
        const token = await user.generateToken()
        await user.save()
        res.status(201)
        res.send({user , token })
    }catch(error){
        res.status(400)
        res.send(error)
    }
})

router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken()
        res.status(201).send({user , token })
    }catch(e){
        console.log(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.json({
            message : 'Logged Out Successfully'
        })
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth , async(req,res) => {
    try{
        req.users.tokens = []
        await req.user.save()
        res.send(200)
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})
//Will be for only admin in future
router.get('/users', async (req,res) => {
    try { 
        const users = await  User.find({})
        res.send(users)
    }catch(e) {
        res.status(400)
        res.send(e)
    }
})

router.get('/users/me', auth , (req,res) => {
   res.send(req.user)
})

router.patch('/users/me', auth , async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isvalidateUpdates = updates.every((update) => allowedUpdates.includes(update))

    if(!isvalidateUpdates){
        return res.status(404).json({
            error : 'Not Valid Updates'
        })
    }
    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
    //    const user= await User.findByIdAndUpdate(req.params.id , req.body , { new : true , runValidators : true})

       res.send(req.user)
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

router.delete('/users/me', auth , async (req,res) => {
    try { 
        req.user.delete()
        res.send(req.user)
    }catch(e){
        res.sendStatus(500)
    }
})

router.post('/users/me/avatar' , upload.single('avatar'), (req,res) => {
    res.send()
})


module.exports = router