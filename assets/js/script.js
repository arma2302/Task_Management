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

  // Add or edit task
  addTask() {
    this.closeModal();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("desc").value.trim();
    const date = document.getElementById("date").value;
    const priority = document.getElementById("priority").value;
    const member = document.getElementById("member").value.trim();

    if (!title || !description || !date || !priority || !member) {
      alert("All fields are required");
      return;
    }

    const task = {
      id: this.currentEditId !== null ? this.currentEditId : Date.now(),
      title,
      description,
      date,
      priority,
      member,
      status: "Pending",
    };

    if (this.currentEditId !== null) {
      const index = this.tasks.findIndex(
        (task) => task.id === this.currentEditId
      );
      this.tasks[index] = task;
    } else {
      this.tasks.push(task);
    }

    localStorage.setItem("task", JSON.stringify(this.tasks));
    document.querySelector("form").reset();
    this.displayTasks(this.tasks);
    this.currentEditId = null; // Reset after saving
  }

  // Display tasks
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
              <a
                href="#"
                id="status-btn"
                onclick="taskManager.statusCheck(${task.id})"
                >change status</a
              >
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
    localStorage.setItem("task", JSON.stringify(this.tasks));
    this.displayTasks(this.tasks);
  }

  // Edit task
  editTask(id) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      document.getElementById("title").value = task.title;
      document.getElementById("desc").value = task.description;
      document.getElementById("date").value = task.date;
      document.getElementById("priority").value = task.priority;
      document.getElementById("member").value = task.member;

      this.currentEditId = id;
      this.openModal();
    }
  }

  // Search task
  searchTask() {
    const search = document.getElementById("search");

    let searchValue = search.value.trim().toLowerCase();
    console.log(searchValue);

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

  // Status modal
  openStatusModal() {
    document.querySelector(".status-modal").style.display = "block";
  }

  closeStatusModal(id) {
    const allOptions = document.getElementById("status");
    const task = this.tasks.find((task) => task.id === id);

    if (task) {
      task.status = allOptions.value || task.status; // Update status or keep current
      localStorage.setItem("task", JSON.stringify(this.tasks));
      this.displayTasks(this.tasks);
    }

    allOptions.value = ""; // Clear selection
    document.querySelector(".status-modal").style.display = "none";
  }

  // Status check
  statusCheck(id) {
    this.openStatusModal();
    this.currentEditId = id;
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
    taskManager.searchTask();
  }
});

document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const category = e.target.id;
    taskManager.displayTasksByCategory(category);
  });
});

window.addEventListener("scroll", () => {
  taskManager.progress();
});
