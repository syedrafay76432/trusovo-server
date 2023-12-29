const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,//that's going to copy all tha body object to this obj
        owner: req.user._id //getting from auth.js
    })
    try {
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed ==="true"
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] =  parts[1]=='desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path:'tasks',
            match,//which task we are trying to match
            options:{
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        })
        res.status(200).send(req.user.tasks)
    } catch (error) {
        res.status(400).send(error)
    }

})
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })//find by id and owner instead of just id
        console.log(task)

        if (!task) {
            return res.status(404).send()
        }

        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }

})
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const updatesAllows = ['name', 'completed']
    const isAllowed = updates.every((update) => updatesAllows.includes(update))

    if (!isAllowed) {
        return res.status(400).send({ error: 'invalid Update' })
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)

    } catch (error) {
        res.send(error)
    }

})
router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if(!task){
            res.status(404),send("Not found")
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router