const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/task");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body)
  const task = new Task({
    ...req.body, //that's going to copy all tha body object to this obj
    owner: req.user.email, //getting from auth.js
  });
  try {
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {


  try {
    // await req.user.populate(
    //   "tasks"
    // );
    const AllTasks = await Task.find({
      $or: [
        { owner: req.user.email },
        { email: req.user.email }
      ]
    })
    res.status(200).send(AllTasks);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user.email }); //find by id and owner instead of just id
    console.log(task);

    if (!task) {
      return res.status(404).send();
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const updatesAllows = ["status"];
  const isAllowed = updates.every((update) => updatesAllows.includes(update));

  if (!isAllowed) {
    return res.status(400).send({ error: "invalid Update" });
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user.email,
    });
    if (!task) {
      res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (error) {
    res.send(error);
  }
});
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.email,
    });
    if (!task) {
      res.status(404), send("Not found");
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
