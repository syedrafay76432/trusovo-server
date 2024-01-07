const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    amount: { type: String, required: true },
    date: { type: Date, required: true },
    role: { type: String, required: true },
    status: { type: String, required: true },
    email: { type: String, required: true },
    owner: {
      type: String,
      required: true,
      ref: "User", //makes a reference from one field to another model now we can easily fetch user detail from
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
