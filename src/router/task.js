const express = require('express');
const Task = require('../models/task');
const router = express.Router();
const { auth } = require('../midlleware/auth');

router.post('/tasks', auth , async (req,res) => {
    try { 
        const task = new Task({
            ... req.body,
            author : req.user._id
        })
        await task.save()
        res.send(task)
    }catch(e) {
        console.log(e)
    }
})

router.get('/tasks', auth ,async (req,res) => {
    try{
        const task = await Task.find({ author : req.user.id})
        // await req.user.populate('tasks').execPopulate()
        if(!task){
            res.status(401).send()
        }
        res.send(task)
    }catch(e){
        console.log(e)
    }
})

router.get('/tasks/:id', auth , async (req,res) => {
    const _id = req.params.id
   try { 
       const task  = await Task.findOne({ _id: _id , author : req.user._id})
       if(!task){
           res.status(401).send()
       }
       res.send(task)
   }catch(e){
       console.log(e)
   }
})

router.patch('/tasks/:id', auth , async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description' , 'complete']
    const isvalidateUpdates = updates.every((update) => allowedUpdates.includes(update))

    if(!isvalidateUpdates){
        return res.status(404).json({
            error : 'Updates Not allowed'
        })
    }

    try{
        const task  = await Task.findOne({_id : req.params.id , author : req.user._id})
        // const task = await Task.findById(req.params.id)
        if(!task){
            res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        // const task  = await Task.findByIdAndUpdate(req.params.id, req.body , { new : true, runValidators : true})
        res.send(task)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

router.delete('/tasks/:id', auth , async (req,res) => {
    try{
        const task = await Task.findOne({ _id : req.params.id , author : req.user._id})
        if(!task){
            return res.sendStatus(401).json({
                message : "Task with that id do not exist"
            })
        }
        task.delete()
        res.send(task)
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router