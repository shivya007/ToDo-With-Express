
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tasksSchema = new Schema({
    title:{
        type: String,
    },
    description:{
        type: String,
        default: "",
    },
    duedate:{
        type: Date,
        required: true,
    },
    status:{
        type: String,
        default: "pending",
        required: true,
    }

})

const Task = mongoose.model("Task", tasksSchema);

module.exports = Task;
