class TaskManager {
  //constructor to avoid global variable issues
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("task")) || [];
    this.dialog = document.querySelector("dialog");
    this.currentEditId = null;
    this.isOpen = false;
  }
  // to manage the modal box
  toggleModal(isOpen) {
    this.isOpen = isOpen;
    document.querySelector(".modal-wrapper").style.display = isOpen
      ? "block"
      : "none";
  }

  openModal() {
    this.toggleModal(true);
  }

  closeModal() {
    this.toggleModal(false);
    this.resetForm();
  }

  // Add or edit task
  // get all the values of input feilds
  getTaskDetails() {
    return {
      title: document.getElementById("title").value.trim(),
      description: document.getElementById("desc").value.trim(),
      date: document.getElementById("date").value,
      priority: document.getElementById("priority").value,
      member: document.getElementById("member").value.trim(),
    };
  }

  validateTaskDetails({ title, description, date, priority, member }) {
    const errors = {};

    if (!title) {
      errors.title = "Title is required.";
    }
    if (!description) {
      errors.desc = "Description is required.";
    }
    if (!date) {
      errors.date = "Date is required.";
    }
    if (!priority) {
      errors.priority = "Priority is required.";
    }
    if (!member) {
      errors.member = "Member is required.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
  //display errors
  displayErrors(errors) {
    Object.keys(errors).forEach((field) => {
      document.getElementById(`${field}Error`).innerText = errors[field];
    });
  }
  // add tasks
  addTask(e) {
    e.preventDefault();
    const taskDetails = this.getTaskDetails();
    //validate all the input values
    const { isValid, errors } = this.validateTaskDetails(taskDetails);
    if (!isValid) {
      this.displayErrors(errors);
      return;
    }

    // Clear previous error messages since validation passed
    const errorFields = ["title", "desc", "date", "priority", "member"];
    errorFields.forEach((field) => {
      document.getElementById(`${field}Error`).textContent = ""; // Clear error messages
    });

    // create object for task
    const task = {
      ...taskDetails,
      id: this.currentEditId || Date.now(),
      status: "Pending",
    };
    // update the task if there is any
    if (this.currentEditId !== null) {
      const index = this.tasks.findIndex(
        (task) => task.id === this.currentEditId
      );
      this.tasks[index] = task;
    } else {
      // push the task to array
      this.tasks.push(task);
    }
    // save rhe task to local
    this.saveTasks();
    //close the modal
    this.closeModal();
    // display all the tasks
    this.displayTasks(this.tasks);
    this.resetForm(); // clear all the input fields after task is added
  }

  saveTasks() {
    localStorage.setItem("task", JSON.stringify(this.tasks));
  }

  resetForm() {
    document.querySelector("form").reset();
    this.currentEditId = null;
  }
  //displat tasks
  displayTasks(tasks) {
    const taskContainer = document.querySelector(".task-listing");
    taskContainer.innerHTML = "";

    tasks.forEach((task) => {
      taskContainer.innerHTML += `
         <li class="list-item">
            <div class="list-title-box">
              <div class="list-icon">
                <i class="fa-solid fa-circle-info"></i>
              </div>
              <div class="list-title">
                <h2>Title :${task.title}</h2>
                <p>assign to :${task.member}</p>
              </div>
              <div class="priority">
                <p>Priority :${task.priority}</p>
              <p>${task.status}</p>

              </div>
            </div>
            <div class="list-other-info-box">
              <div class="list-icon">
        <i class="fa-solid fa-calendar"></i>
              </div>
              <div class="list-title">
                <h2>${task.date}</h2>
              </div>
            </div>
            <div class="list-actions-box">
              <a href="#" onclick="taskManager.deleteTask(${task.id})"
                >Delete</a
              >
              <a href="#" onclick="taskManager.editTask(${task.id})">Edit</a>
          
            <select name="" id="status" value="" onchange="taskManager.updateStatus(${task.id})">
            <option value="">Change status</option>
            <option value="Pending">Pending</option>
            <option value="Delayed">Delayed</option>
            <option value="In-process">In-process</option>
            <option value="Completed">Completed</option>
          </select>
            </div>
          </li>
            
        `;
    });
  }

  // Display tasks by category
  displayTasksByCategory(category) {
    let filteredTasks;

    switch (category) {
      case "high":
        filteredTasks = this.tasks.filter((task) => task.priority === "high");
        break;
      case "pending":
        filteredTasks = this.tasks.filter((task) => task.status === "Pending");
        break;
      case "completed":
        filteredTasks = this.tasks.filter(
          (task) => task.status === "Completed"
        );
        break;
      default:
        filteredTasks = this.tasks;
    }

    if (filteredTasks.length === 0) {
      alert("No tasks found in this category");
    } else {
      this.displayTasks(filteredTasks);
    }
  }

  // Delete task
  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
    this.displayTasks(this.tasks);
  }

  // Edit task
  editTask(id) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      this.fillTaskForm(task);
      this.currentEditId = id;
      this.openModal();
    }
  }
  //fill the form
  fillTaskForm({ title, description, date, priority, member }) {
    document.getElementById("title").value = title;
    document.getElementById("desc").value = description;
    document.getElementById("date").value = date;
    document.getElementById("priority").value = priority;
    document.getElementById("member").value = member;
  }
  // Search task
  searchTask() {
    const search = document.getElementById("search");

    let searchValue = search.value.trim().toLowerCase();
    const searchedData = this.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchValue) ||
        task.member.toLowerCase().includes(searchValue)
    );

    if (searchedData.length === 0) {
      alert("No data found");
    } else {
      this.displayTasks(searchedData);
    }

    document.getElementById("search").value = "";
  }

  updateStatus(id) {
    const statusValue = document.getElementById("status");
    const task = this.tasks.find((task) => task.id === id);

    if (task && statusValue.value) {
      task.status = statusValue.value || task.status; // Update status or keep current
      this.saveTasks();
      this.displayTasks(this.tasks);
    }

    statusValue.value = ""; // Clear selection
    document.querySelector(".status-modal").style.display = "none";
  }

  // Progress bar
  progress() {
    const scroll = document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollProgress = (scroll / height) * 100;

    document.getElementById(
      "scroll-progress"
    ).style.width = `${scrollProgress}%`;
  }

  //single member task list
  singleMemberTask(memberName) {
    let membetListContainer = document.querySelector(".member-task");
    membetListContainer.innerHTML = "";
    const memberTasks = this.tasks.filter((task) => task.member === memberName);
    console.log(memberTasks);

    membetListContainer.innerHTML += `<h2>Total ${memberTasks.length} Task assigned to ${memberName}</h2>
    <div><p id="list">Click here to see the list</p> <p class="close-list">close</p> </div>`;

    if (memberTasks.length == 0) {
      membetListContainer.innerHTML = "<h2>No Task assigned yet</h2>";
    }

    document.getElementById("list").addEventListener("click", () => {
      document.getElementById("list").style.display = "none";
      this.displayMemberTask(memberTasks);
    });
  }

  displayMemberTask(task) {
    let taskBox = document.querySelector(".member-task");
    let table = document.createElement("table");
    console.log(taskBox);

    console.log(task);
    task.forEach((singleTask) => {
      table.innerHTML += `<tr><td>Title:${singleTask.title}</td>
      <td>status:${singleTask.status}</td><td onclick="taskManager.memberTaskDetails(${singleTask.id})">more details</td></tr></>`;
    });
    taskBox.appendChild(table);
    document.querySelector(".close-list").addEventListener("click", () => {
      taskBox.innerHTML = "";
    });
  }
  memberTaskDetails(taskId) {
    this.dialog.showModal();
    let taskDetails = this.tasks.find((task) => task.id === taskId);
    this.dialog.innerHTML = `
    <p><span>Title </span>${taskDetails.title}</p>
    <p><span>Details </span>${taskDetails.description}</p>
    <p><span>status </span>${taskDetails.status}</p>
    <p><span>priority </span>${taskDetails.priority}</p>
    <div><button onclick="taskManager.closeDailoge()">Close</button></div>
`;
  }

  closeDailoge() {
    this.dialog.close();
  }

  filterTask() {
    let filterdVal = document.getElementById("filter");

    let filetrData = this.tasks.filter((task) =>
      task.status.includes(filterdVal.value)
    );
    if (filetrData.length > 0) {
      this.displayTasks(filetrData);
    } else {
      alert(`No ${filterdVal.value} Task Found`);
      this.displayTasks(this.tasks);
    }
    filterdVal.value = "";
  }
}

const taskManager = new TaskManager();
taskManager.displayTasks(taskManager.tasks);

// Event listeners
document.getElementById("addBtn").addEventListener("click", () => {
  taskManager.addTask(event);
});

document.getElementById("close-modal-btn").addEventListener("click", () => {
  taskManager.closeModal();
});

document.getElementById("open-modal-btn").addEventListener("click", () => {
  taskManager.openModal();
  console.log("helo");
});

window.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    taskManager.searchTask();
  }
});
document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const category = e.target.id;
    taskManager.displayTasksByCategory(category);
  });
});

document.querySelectorAll(".member").forEach((member) => {
  member.addEventListener("click", (e) => {
    const name = e.target.id;
    taskManager.singleMemberTask(name);
    console.log("helo");
  });
});

document.getElementById("filter").addEventListener("change", () => {
  taskManager.filterTask();
});
window.addEventListener("scroll", () => {
  taskManager.progress();
});
