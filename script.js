// ===== Select Elements =====
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");

// ===== Load Tasks =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== Render Tasks =====
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "all") return true;
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const span = document.createElement("span");
    span.textContent = task.text;

    // Complete Button
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✓";
    completeBtn.className = "task-btn complete-btn";
    completeBtn.addEventListener("click", () => toggleComplete(task.id));

    // Edit Button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "task-btn edit-btn";
    editBtn.addEventListener("click", () => editTask(task.id));

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "task-btn delete-btn";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

// ===== Add Task =====
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(task);
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

// ===== Delete Task =====
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// ===== Edit Task =====
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt("Edit task:", task.text);
  if (newText !== null && newText.trim() !== "") {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// ===== Toggle Complete =====
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

// ===== Filter Tasks =====
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ===== Event Listeners =====
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// ===== Initial Render =====
renderTasks();