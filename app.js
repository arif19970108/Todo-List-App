document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
    updateGreeting();
    updateProgress();
});

document.getElementById("toggleTheme").addEventListener("click", toggleTheme);
document.getElementById("sortTasks").addEventListener("change", sortTasks);
document.getElementById("filterTasks").addEventListener("change", filterTasks);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const taskCategory = document.getElementById('taskCategory').value;
    const taskList = document.getElementById('taskList');

    if (taskInput.value.trim() === "" || taskDate.value === "") {
        alert("Please enter a task and select a date!");
        return;
    }

    const li = document.createElement('li');
    li.innerHTML = `<span contenteditable="true">${taskInput.value} (Due: ${taskDate.value}) [${taskCategory}]</span>`;

    li.onclick = function () {
        li.classList.toggle('done');
        saveTasks();
        updateProgress();
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function () {
        taskList.removeChild(li);
        saveTasks();
        updateProgress();
    }

    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    saveTasks();
    updateProgress();

    taskInput.value = "";
    taskDate.value = "";
}

function saveTasks() {
    const taskList = document.getElementById('taskList');
    localStorage.setItem("tasks", taskList.innerHTML);
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = localStorage.getItem("tasks") || "";
    const listItems = taskList.getElementsByTagName("li");

    for (let li of listItems) {
        li.onclick = function () {
            li.classList.toggle('done');
            saveTasks();
            updateProgress();
        }
        li.querySelector("button").onclick = function () {
            taskList.removeChild(li);
            saveTasks();
            updateProgress();
        }
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

function updateGreeting() {
    const greetingElement = document.getElementById("greeting");
    const hour = new Date().getHours();
    
    if (hour < 12) {
        greetingElement.textContent = "Good Morning! Welcome to My TO-DO List!";
    } else if (hour < 18) {
        greetingElement.textContent = "Good Afternoon! Welcome to My TO-DO List!";
    } else {
        greetingElement.textContent = "Good Evening! Welcome to My TO-DO List!";
    }
}

// Task Sorting by Date
function sortTasks() {
    const taskList = document.getElementById("taskList");
    let tasks = Array.from(taskList.children);

    tasks.sort((a, b) => {
        let dateA = new Date(a.innerText.match(/\d{4}-\d{2}-\d{2}/)[0]);
        let dateB = new Date(b.innerText.match(/\d{4}-\d{2}-\d{2}/)[0]);

        return document.getElementById("sortTasks").value === "newest" ? dateB - dateA : dateA - dateB;
    });

    taskList.innerHTML = "";
    tasks.forEach(task => taskList.appendChild(task));
}

// Filter Tasks by Status
function filterTasks() {
    const filterValue = document.getElementById("filterTasks").value;
    const tasks = document.getElementById("taskList").children;

    for (let task of tasks) {
        if (filterValue === "all") {
            task.style.display = "flex";
        } else if (filterValue === "completed" && task.classList.contains("done")) {
            task.style.display = "flex";
        } else if (filterValue === "pending" && !task.classList.contains("done")) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    }
}

// Update Progress Bar
function updateProgress() {
    const tasks = document.getElementById("taskList").children;
    const completedTasks = document.querySelectorAll("#taskList li.done").length;
    const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    document.getElementById("taskProgress").value = progress;
    document.getElementById("progressText").textContent = `Task Completion: ${Math.round(progress)}%`;
}
