const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false

    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' //makes a reference from one field to another model now we can easily fetch user detail from
    }

}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)
module.exports = Task