const express = require("express")
require("./db/mongoose")
const userRouter = require("./routers/users")
const taskRouter = require("./routers/tasks")
const auth = require("./middleware/auth")

const app = express()
const port = 3000

app.use(express.json())//automatically parse incomming json data in to object
app.use(userRouter)//register router
app.use(taskRouter)//register router

module.exports = app

