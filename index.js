const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 6767;
const path = require("path");
const Task = require("./models/tasks.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Todo");
}
main()
  .then(() => {
    console.log("Mongodb connected successfully");
  })
  .catch((error) => {
    console.log("error occured while connected with database", error);
  });

app.listen(port, (req, res) => {
  console.log(`listening on port ${port}`);
});

app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("connected");
});

app.get("/create", async (req, res) => {
  let result = await Task.find({});
  res.render("create.ejs", { result });
});

app.post("/add-task", async (req, res) => {
  try {
    const { title, duedate } = req.body;
    const newTask = new Task({ title, duedate });

    await newTask.save();
    res.status(201).json({ message: "Task saved successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error saving task", error });
  }
});

// Get all the tasks exits in the database --> Show Route
app.get("/create/tasks", async (req, res) => {
  let result = await Task.find({});
  res.render("show.ejs", { result });
});

// get the task by their id --> edit route
app.get("/create/tasks/:id", async (req, res) => {
  let { id } = req.params;
  let taskdata = await Task.findById(id);
  res.render("edit.ejs", { taskdata });
});

// update the tasks --> update route
app.put("/create/tasks/:id", async (req, res) => {
  let { id } = req.params;
  let result = req.body;
  let newtitle = result.tasks.title;
  let newdescription = result.tasks.description;
  let newduedate = result.tasks.duedate;
  const newstatus = result.tasks.status;
  await Task.findByIdAndUpdate(
    id,
    {
      title: newtitle,
      description: newdescription,
      duedate: newduedate,
      status: newstatus,
    },
    { new: true, runValidators: true }
  );

  res.redirect("/create/tasks");
});

app.delete("/create/tasks/:id", async (req, res) => {
  let { id } = req.params;
  let deletetask = await Task.findByIdAndDelete(id);

  res.redirect("/create/tasks");
});
