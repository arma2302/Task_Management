// / Task Manager
class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("task")) || [];
    this.currentEditId = null;
    this.isOpen = false;
  }

  // Open modal
  openModal() {
    this.isOpen = true;
    document.querySelector(".modal-wrapper").style.display = "block";
  }

  // Close modal
  closeModal() {
    this.isOpen = false;
    document.querySelector(".modal-wrapper").style.display = "none";
  }

  // Add task
  addTask() {
    this.closeModal();
    const title = document.getElementById("title").value;
    const description = document.getElementById("desc").value;
    const date = document.getElementById("date").value;
    const priority = document.getElementById("priority").value;
    const member = document.getElementById("member").value;
    const task = {
      id: this.tasks.length + 1,
      title,
      description,
      date,
      priority,
      member,
      status: "Pending",
    };

    if (
      title.length != 0 ||
      description.length != 0 ||
      date.length != 0 ||
      priority.length != 0 ||
      member.length != 0
    ) {
      if (this.currentEditId !== null) {
        const index = this.tasks.findIndex(
          (task) => task.id === this.currentEditId
        );
        this.tasks[index] = task;
        localStorage.setItem("task", JSON.stringify(this.tasks));
      } else {
        this.tasks.push(task);
        localStorage.setItem("task", JSON.stringify(this.tasks));
      }

      document.querySelector("form").reset();
      this.displayTasks(this.tasks);
    } else {
      alert("All the fields are required");
    }
  }

  // Display tasks
  displayTasks(tasks) {
    const taskContainer = document.querySelector(".task-listing");
    taskContainer.innerHTML = "";

    tasks.forEach((task, index) => {
      const taskElement = document.createElement("li");
      taskElement.innerHTML = `
      <li class="task-item">
      <div class="task-details">
      <h3>${task.title}</h3>          
                <div class="assignee">
                  <p>${task.member}</p>
                  <span>assegnee</span>
                </div>
                <div class="status">
                  <p>${task.status}</p>
                  <span>status</span>
                </div>
                <div class="date">
                  <p>${task.date}</p>
                  <span>Date</span>
                </div>
              </div>
              <div class="action-btns">
              <button onclick="taskManager.deleteTask(${task.id})">Delete</button>
              <button onclick="taskManager.editTask(${task.id})">Edit</button>
                <button id="status-btn" onclick="taskManager.statusCheck(${task.id})">status</button>
              </div>
            </li>
      `;
      taskContainer.appendChild(taskElement);
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
    localStorage.setItem("task", JSON.stringify(this.tasks));
    this.displayTasks(this.tasks);
  }

  // Edit task
  editTask(id) {
    const task = this.tasks.find((task) => task.id === id);
    const title = document.getElementById("title");
    const description = document.getElementById("desc");
    const date = document.getElementById("date");
    const priority = document.getElementById("priority");
    const member = document.getElementById("member");

    title.value = task.title;
    description.value = task.description;
    date.value = task.date;
    priority.value = task.priority;
    member.value = task.member;

    this.currentEditId = id;
    this.openModal();
  }

  // search Task

  serchTask() {
    let searchValue = document.getElementById("serach");
    let data = this.tasks;
    let searchedData = data.filter(
      (task) =>
        task.title.includes(searchValue.value) ||
        task.member.includes(searchValue.value)
    );
    if (searchedData.length === 0) {
      alert("No Data found");
    } else {
      this.displayTasks(searchedData);
    }

    searchValue.value = "";
    console.log(searchedData);
  }

  //status modal
  openStatusModal() {
    let statusModal = document.querySelector(".status-modal");
    statusModal.style.display = "block";
  }
  closeStatusModal(id) {
    let alloptions = document.getElementById("status");
    console.log(alloptions.value);
    const task = this.tasks.find((task) => task.id === id);
    task.status = alloptions.value;
    console.log(task);
    localStorage.setItem("task", JSON.stringify(this.tasks));
    this.displayTasks(this.tasks);

    let statusModal = document.querySelector(".status-modal");
    statusModal.style.display = "none";
  }
  //statusCheck\
  statusCheck(id) {
    this.openStatusModal();
    this.currentEditId = id;
  }
}

const taskManager = new TaskManager();
taskManager.displayTasks(taskManager.tasks);

// Event listeners
document.getElementById("addBtn").addEventListener("click", () => {
  taskManager.addTask();
});

document.getElementById("close-modal-btn").addEventListener("click", () => {
  taskManager.closeModal();
});

document.getElementById("open-modal-btn").addEventListener("click", () => {
  taskManager.openModal();
});

document.getElementById("save-btn").addEventListener("click", () => {
  taskManager.closeStatusModal(taskManager.currentEditId);
});
window.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    taskManager.serchTask();
  }
});
document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const category = e.target.id;
    console.log(category);

    taskManager.displayTasksByCategory(category);
  });
});
