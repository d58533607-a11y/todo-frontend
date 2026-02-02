const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");

let currentFilter = "all";

window.onload = () => {
    renderTasks();
};

function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") {
        alert("Escribe una tarea no has ingresado ninguna");
        return;
    }

    const now  = new Date();
    const createdAt = now.toLocaleString("es-CO");

    const tasks = getTasks();
    tasks.push({
        text,
        completed: false,
        createdAt
    });
    saveTasks(tasks);

    input.value = "";
    renderTasks();
}

function renderTasks() {
    console.log("Renderizado de tareas", getTasks());
    const tasks = getTasks();
    taskList.innerHTML = "";

    const filtered = tasks.filter(task => {
        if (currentFilter === "pending") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filtered.forEach(task => createTask(task));
    updateCounter(tasks);
}

   function createTask(task) {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = task.text;

    const small = document.createElement("small");
    small.textContent = `🕒 ${task.createdAt}`;
    small.classList.add("time");

    span.onclick = () => {
        task.completed = !task.completed;
        saveTasks(getTasks());
        renderTasks();
    };

    span.ondblclick = () => editTask(li, span, task);

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = (e) => {
        e.stopPropagation();
        deleteTask(task.text);
    };

    const content = document.createElement("div");
    content.classList.add("content");

    content.appendChild(span);
    content.appendChild(small);

    li.appendChild(content);
    li.appendChild(btn);

    taskList.appendChild(li);
}


function editTask(li, span, task) {
    const input = document.createElement("input");
    input.value = task.text;
    li.replaceChild(input, span);
    input.focus();

    input.onblur = () => saveEdit(input, task);
    input.onkeydown = e => {
        if (e.key === "Enter") saveEdit(input, task);
    };
}

function saveEdit(input, task) {
    if (input.value.trim() === "") return;
    task.text = input.value.trim();
    saveTasks(getTasks());
    renderTasks();
}

function setFilter(filter) {
    currentFilter = filter;
    renderTasks();
}


function updateCounter(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    counter.textContent =
        `Total: ${total} | Pendientes: ${pending} | Hechas : ${completed}`;
}


function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(text) {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.text !== text);
    saveTasks(tasks);
    renderTasks();
}


