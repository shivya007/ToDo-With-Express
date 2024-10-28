let inp = document.querySelector("#title");
let list = document.querySelector(".unordered-list1");
let list2 = document.querySelector(".unordered-list2");
let current = document.querySelector(".currentTask");
let completed = document.querySelector(".completedTask");
let date = document.querySelector("#date");
let Addtaskbtn = document.querySelector("#Addtaskbtn");

Addtaskbtn.addEventListener("click", (event) => {

    let inptask = inp.value.trim();
    let selecteddate = date.value;
    
    if (inptask && selecteddate) {
      addtoTask(list, inptask, selecteddate);
      saveTaskToDatabase(inptask, selecteddate);
    }
    else {
      // Show an alert or a message indicating the date is required
      alert("Please enter a task and select a due date.");
  }
    inp.value = "";
    date.value = "";
}); 

function addtoTask(targetlist, task, selecteddate) {
  let liitem = document.createElement("li");
  let checkinp = document.createElement("input");
  checkinp.setAttribute("type", "checkbox");
  

  liitem.appendChild(checkinp);
  liitem.appendChild(document.createTextNode(task));
  targetlist.appendChild(liitem);
  current.appendChild(liitem);

  let dateText = document.createTextNode(` (Due: ${selecteddate})`);
  liitem.appendChild(dateText);

  // check if its checkbox is marked or not

  checkinp.addEventListener("change", () => {
    handleCheckboxChange(checkinp, liitem);
  });
}

function handleCheckboxChange(checkinp, liitem) {
  // check if task is completed or not
  let targetlist = checkinp.checked ? list2 : list;

  let newitem = document.createElement("li");
  let newcheckinp = document.createElement("input");

  newcheckinp.setAttribute("type", "checkbox");
  newcheckinp.checked = checkinp.checked;
  newitem.appendChild(newcheckinp);
  newitem.appendChild(document.createTextNode(liitem.textContent));
  targetlist.appendChild(newitem);

  if (targetlist === list2) {
    completed.appendChild(newitem);
  } else {
    current.appendChild(newitem);
  }
  liitem.remove();

  newcheckinp.addEventListener("change", () => {
    handleCheckboxChange(newcheckinp, newitem);
  });
}

async function saveTaskToDatabase(task, selecteddate) {
//  const dueDateObject = new Date(selecteddate);
  await fetch("/add-task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: task, duedate: selecteddate }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Task saved:", data);
    })
    .catch((error) => {
      console.error("Error saving task:", error);
    });
}


