function updateDateTime() {
    const now = new Date();
    const hours = now.getHours();

    let greeting = "";
    if (hours < 12) {
        greeting = "Good morning";
    } else if (hours < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    const savedName = localStorage.getItem("userName");
    const greetingEl = document.getElementById("greeting");
    greetingEl.textContent = savedName
        ? `${greeting}, ${savedName}!`
        : `${greeting}!`;

    document.getElementById("current-time").textContent =
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    document.getElementById("current-date").textContent =
        now.toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
}

updateDateTime();
setInterval(updateDateTime, 1000);


const userNameEl     = document.getElementById("user-name");
const nameDisplay    = document.getElementById("name-display");
const changeNameBtn  = document.getElementById("change-name-btn");
const nameForm       = document.getElementById("name-form");
const nameInput      = document.getElementById("name-input");
const cancelNameBtn  = document.getElementById("cancel-name-btn");

function applyName(name) {
    if (name) {
        userNameEl.textContent = `Welcome back, ${name}!`;
    } else {
        userNameEl.textContent = "Welcome to your dashboard";
    }
    updateDateTime();
}

applyName(localStorage.getItem("userName"));

changeNameBtn.addEventListener("click", function () {
    nameDisplay.hidden = true;
    nameForm.hidden = false;
    nameInput.value = localStorage.getItem("userName") || "";
    nameInput.focus();
});

cancelNameBtn.addEventListener("click", function () {
    nameForm.hidden = true;
    nameDisplay.hidden = false;
});

nameForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = nameInput.value.trim();
    if (name !== "") {
        localStorage.setItem("userName", name);
        applyName(name);
    }
    nameForm.hidden = true;
    nameDisplay.hidden = false;
});


const DEFAULT_MINUTES = 25;
let pomodoroMinutes = parseInt(localStorage.getItem("pomodoroMinutes")) || DEFAULT_MINUTES;
let timeLeft = pomodoroMinutes * 60;
let timerInterval = null;

const timerDisplay  = document.getElementById("timer");
const pomodoroInput = document.getElementById("pomodoro-input");

pomodoroInput.value = pomodoroMinutes;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

updateTimerDisplay();

pomodoroInput.addEventListener("change", function () {
    if (timerInterval) return;
    const val = parseInt(pomodoroInput.value);
    if (isNaN(val) || val < 1 || val > 99) {
        pomodoroInput.value = pomodoroMinutes;
        return;
    }
    pomodoroMinutes = val;
    localStorage.setItem("pomodoroMinutes", pomodoroMinutes);
    timeLeft = pomodoroMinutes * 60;
    updateTimerDisplay();
});

document.getElementById("start-btn").addEventListener("click", function () {
    if (!timerInterval) {
        pomodoroInput.disabled = true;
        timerInterval = setInterval(function () {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                pomodoroInput.disabled = false;
                alert("Focus session complete!");
            }
        }, 1000);
    }
});

document.getElementById("stop-btn").addEventListener("click", function () {
    clearInterval(timerInterval);
    timerInterval = null;
    pomodoroInput.disabled = false;
});

document.getElementById("reset-btn").addEventListener("click", function () {
    clearInterval(timerInterval);
    timerInterval = null;
    pomodoroInput.disabled = false;
    timeLeft = pomodoroMinutes * 60;
    updateTimerDisplay();
});


const taskForm   = document.getElementById("task-form");
const taskInput  = document.getElementById("task-input");
const taskNotes  = document.getElementById("task-notes");
const taskList   = document.getElementById("task-list");
const sortSelect = document.getElementById("sort-select");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getSortedTasks() {
    const order = sortSelect.value;
    const copy = tasks.slice();
    if (order === "az") {
        copy.sort(function (a, b) { return a.text.localeCompare(b.text); });
    } else if (order === "za") {
        copy.sort(function (a, b) { return b.text.localeCompare(a.text); });
    } else if (order === "pending") {
        copy.sort(function (a, b) { return Number(a.done) - Number(b.done); });
    }
    return copy;
}

function displayTasks() {
    taskList.innerHTML = "";

    getSortedTasks().forEach(function (task) {
        const trueIndex = tasks.findIndex(function (t) { return t === task; });

        const taskItem = document.createElement("li");

        const taskBody = document.createElement("div");
        taskBody.classList.add("task-body");

        const taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.text;
        if (task.done) {
            taskText.style.textDecoration = "line-through";
            taskText.style.opacity = "0.5";
        }

        taskText.addEventListener("click", function () {
            tasks[trueIndex].done = !tasks[trueIndex].done;
            saveTasks();
            displayTasks();
        });

        taskBody.appendChild(taskText);

        if (task.notes) {
            const taskNoteEl = document.createElement("p");
            taskNoteEl.classList.add("task-note");
            taskNoteEl.textContent = task.notes;
            taskBody.appendChild(taskNoteEl);
        }

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function () {
            taskBody.hidden = true;
            taskActions.hidden = true;

            const editForm = document.createElement("form");
            editForm.classList.add("task-edit-form");

            const editTextInput = document.createElement("input");
            editTextInput.type = "text";
            editTextInput.value = tasks[trueIndex].text;
            editTextInput.maxLength = 200;
            editTextInput.setAttribute("aria-label", "Edit task");

            const editNoteInput = document.createElement("textarea");
            editNoteInput.value = tasks[trueIndex].notes || "";
            editNoteInput.rows = 2;
            editNoteInput.maxLength = 200;
            editNoteInput.placeholder = "Edit note (optional)";
            editNoteInput.setAttribute("aria-label", "Edit note");

            const editFormActions = document.createElement("div");
            editFormActions.classList.add("task-edit-actions");

            const saveButton = document.createElement("button");
            saveButton.type = "submit";
            saveButton.textContent = "Save";

            const cancelButton = document.createElement("button");
            cancelButton.type = "button";
            cancelButton.textContent = "Cancel";

            cancelButton.addEventListener("click", function () {
                taskBody.hidden = false;
                taskActions.hidden = false;
                editForm.remove();
            });

            editFormActions.appendChild(saveButton);
            editFormActions.appendChild(cancelButton);
            editForm.appendChild(editTextInput);
            editForm.appendChild(editNoteInput);
            editForm.appendChild(editFormActions);
            taskItem.appendChild(editForm);
            editTextInput.focus();

            editForm.addEventListener("submit", function (event) {
                event.preventDefault();
                const newText = editTextInput.value.trim();
                if (newText === "") return;

                const isDuplicate = tasks.some(function (t, i) {
                    return i !== trueIndex && t.text.toLowerCase() === newText.toLowerCase();
                });
                if (isDuplicate) {
                    alert(`"${newText}" already exists in your list.`);
                    editTextInput.focus();
                    return;
                }

                tasks[trueIndex].text = newText;
                tasks[trueIndex].notes = editNoteInput.value.trim();
                saveTasks();
                displayTasks();
            });
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            tasks.splice(trueIndex, 1);
            saveTasks();
            displayTasks();
        });

        const taskActions = document.createElement("div");
        taskActions.classList.add("task-actions");
        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);

        taskItem.appendChild(taskBody);
        taskItem.appendChild(taskActions);
        taskList.appendChild(taskItem);
    });
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const text = taskInput.value.trim();
    if (text === "") return;

    const isDuplicate = tasks.some(function (t) {
        return t.text.toLowerCase() === text.toLowerCase();
    });
    if (isDuplicate) {
        alert(`"${text}" is already in your list.`);
        taskInput.focus();
        return;
    }

    tasks.push({ text: text, notes: taskNotes.value.trim(), done: false });
    saveTasks();
    taskInput.value = "";
    taskNotes.value = "";
    displayTasks();
});

sortSelect.addEventListener("change", displayTasks);

displayTasks();


const linkForm      = document.getElementById("link-form");
const linkNameInput = document.getElementById("link-name");
const linkUrlInput  = document.getElementById("link-url");
const quickLinks    = document.getElementById("quick-links");

let links = JSON.parse(localStorage.getItem("quickLinks")) || [];

function saveLinks() {
    localStorage.setItem("quickLinks", JSON.stringify(links));
}

function displayLinks() {
    quickLinks.innerHTML = "";

    links.forEach(function (link, index) {
        const linkItem = document.createElement("a");
        linkItem.href = link.url;
        linkItem.target = "_blank";
        linkItem.rel = "noopener noreferrer";
        linkItem.textContent = link.name;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "×";
        deleteButton.setAttribute("aria-label", `Remove ${link.name}`);
        deleteButton.addEventListener("click", function () {
            links.splice(index, 1);
            saveLinks();
            displayLinks();
        });

        const linkContainer = document.createElement("span");
        linkContainer.appendChild(linkItem);
        linkContainer.appendChild(deleteButton);
        quickLinks.appendChild(linkContainer);
    });
}

linkForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = linkNameInput.value.trim();
    const url  = linkUrlInput.value.trim();
    if (name === "" || url === "") return;

    links.push({ name: name, url: url });
    saveLinks();
    linkNameInput.value = "";
    linkUrlInput.value  = "";
    displayLinks();
});

displayLinks();


const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
    if (theme === "light") {
        document.body.classList.add("light");
        themeToggle.textContent = "🌙 Dark";
        themeToggle.setAttribute("aria-label", "Switch to dark mode");
    } else {
        document.body.classList.remove("light");
        themeToggle.textContent = "☀️ Light";
        themeToggle.setAttribute("aria-label", "Switch to light mode");
    }
}

applyTheme(localStorage.getItem("theme") || "dark");

themeToggle.addEventListener("click", function () {
    const newTheme = document.body.classList.contains("light") ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
});
