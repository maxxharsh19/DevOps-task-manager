const API_URL = "/api/tasks";

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const inProgressTasks = document.getElementById("inProgressTasks");
const completedTasks = document.getElementById("completedTasks");
const highPriorityTasks = document.getElementById("highPriorityTasks");

const searchTask = document.getElementById("searchTask");
const statusFilter = document.getElementById("statusFilter");

/* Create Task Modal */
const taskModal = document.getElementById("taskModal");
const openTaskModal = document.getElementById("openTaskModal");
const emptyStateButton = document.getElementById("emptyStateButton");
const closeTaskModal = document.getElementById("closeTaskModal");
const cancelTask = document.getElementById("cancelTask");

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");

/* Edit Task Modal */
const editTaskModal = document.getElementById("editTaskModal");
const closeEditTaskModal = document.getElementById("closeEditTaskModal");
const cancelEditTask = document.getElementById("cancelEditTask");

const editTaskForm = document.getElementById("editTaskForm");
const editTaskTitle = document.getElementById("editTaskTitle");
const editTaskDescription = document.getElementById("editTaskDescription");
const editTaskPriority = document.getElementById("editTaskPriority");
const editTaskStatus = document.getElementById("editTaskStatus");

let allTasks = [];


/* =========================================
   LOAD TASKS
========================================= */

async function loadTasks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load tasks");
        }

        const data = await response.json();

        allTasks = data.tasks || [];

        updateStatistics();
        renderTasks();

    } catch (error) {

        console.error("Error loading tasks:", error);

        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">!</div>
                <h4>Unable to load tasks</h4>
                <p>
                    Make sure the Flask backend is running on port 5000.
                </p>
            </div>
        `;
    }
}


/* =========================================
   STATISTICS
========================================= */

function updateStatistics() {

    const total = allTasks.length;

    const inProgress = allTasks.filter(
        task => task.status === "in_progress"
    ).length;

    const completed = allTasks.filter(
        task => task.status === "completed"
    ).length;

    const highPriority = allTasks.filter(
        task => task.priority === "high"
    ).length;

    totalTasks.textContent = total;
    inProgressTasks.textContent = inProgress;
    completedTasks.textContent = completed;
    highPriorityTasks.textContent = highPriority;
}


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    const searchValue = searchTask.value
        .toLowerCase()
        .trim();

    const selectedStatus = statusFilter.value;

    const filteredTasks = allTasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(searchValue) ||
            (task.description || "")
                .toLowerCase()
                .includes(searchValue);

        const matchesStatus =
            selectedStatus === "all" ||
            task.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });


    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">✓</div>

                <h4>No matching tasks</h4>

                <p>
                    Create a new task or change your search/filter.
                </p>

                <button
                    class="secondary-button"
                    id="dynamicCreateTask"
                >
                    Create Task
                </button>

            </div>
        `;

        document
            .getElementById("dynamicCreateTask")
            .addEventListener("click", showCreateModal);

        return;
    }


    taskList.innerHTML = filteredTasks.map(task => {

        return `
            <div class="task-item">

                <div class="task-content">

                    <h4>${escapeHTML(task.title)}</h4>

                    <p>
                        ${escapeHTML(
                            task.description || "No description provided."
                        )}
                    </p>

                </div>

                <div class="task-meta">

                    <span class="badge ${task.priority}">
                        ${formatPriority(task.priority)}
                    </span>

                    <span class="badge ${task.status}">
                        ${formatStatus(task.status)}
                    </span>

                    <button
                        class="task-action edit-task"
                        data-id="${task.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="task-action delete-task"
                        data-id="${task.id}"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;

    }).join("");
}


/* =========================================
   CREATE TASK
========================================= */

async function createTask(event) {

    event.preventDefault();

    const payload = {
        title: taskTitle.value.trim(),
        description: taskDescription.value.trim(),
        priority: taskPriority.value
    };


    if (!payload.title) {
        alert("Please enter a task title.");
        return;
    }


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)

        });


        const data = await response.json();


        if (!response.ok) {
            throw new Error(
                data.message || "Unable to create task"
            );
        }


        closeCreateModal();

        await loadTasks();

    } catch (error) {

        console.error("Error creating task:", error);

        alert(error.message);
    }
}


/* =========================================
   DELETE TASK
========================================= */

async function deleteTask(taskId) {

    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${taskId}`,
            {
                method: "DELETE"
            }
        );


        const data = await response.json();


        if (!response.ok) {
            throw new Error(
                data.message || "Unable to delete task"
            );
        }


        await loadTasks();

    } catch (error) {

        console.error("Error deleting task:", error);

        alert(error.message);
    }
}


/* =========================================
   OPEN EDIT MODAL
========================================= */

function openEditModal(taskId) {

    const task = allTasks.find(
        item => item.id === Number(taskId)
    );


    if (!task) {
        return;
    }


    editTaskForm.dataset.taskId = task.id;

    editTaskTitle.value = task.title;
    editTaskDescription.value = task.description || "";
    editTaskPriority.value = task.priority;
    editTaskStatus.value = task.status;

    editTaskModal.classList.add("show");

    setTimeout(() => {
        editTaskTitle.focus();
    }, 100);
}


/* =========================================
   SAVE EDITED TASK
========================================= */

async function saveEditedTask(event) {

    event.preventDefault();

    const taskId = editTaskForm.dataset.taskId;


    if (!taskId) {
        alert("Task ID is missing.");
        return;
    }


    const payload = {
        title: editTaskTitle.value.trim(),
        description: editTaskDescription.value.trim(),
        priority: editTaskPriority.value,
        status: editTaskStatus.value
    };


    if (!payload.title) {
        alert("Task title cannot be empty.");
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${taskId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)
            }
        );


        const data = await response.json();


        if (!response.ok) {
            throw new Error(
                data.message || "Unable to update task"
            );
        }


        closeEditModal();

        await loadTasks();

    } catch (error) {

        console.error("Error updating task:", error);

        alert(error.message);
    }
}


/* =========================================
   MODAL FUNCTIONS
========================================= */

function showCreateModal() {

    taskModal.classList.add("show");

    setTimeout(() => {
        taskTitle.focus();
    }, 100);
}


function closeCreateModal() {

    taskModal.classList.remove("show");

    taskForm.reset();
}


function closeEditModal() {

    editTaskModal.classList.remove("show");

    editTaskForm.reset();

    delete editTaskForm.dataset.taskId;
}


/* =========================================
   TASK BUTTON EVENTS
========================================= */

taskList.addEventListener("click", async event => {

    const editButton =
        event.target.closest(".edit-task");

    const deleteButton =
        event.target.closest(".delete-task");


    if (editButton) {

        const taskId = editButton.dataset.id;

        openEditModal(taskId);

        return;
    }


    if (deleteButton) {

        const taskId = deleteButton.dataset.id;

        await deleteTask(taskId);

        return;
    }

});


/* =========================================
   SEARCH + FILTER
========================================= */

searchTask.addEventListener(
    "input",
    renderTasks
);


statusFilter.addEventListener(
    "change",
    renderTasks
);


/* =========================================
   CREATE MODAL EVENTS
========================================= */

openTaskModal.addEventListener(
    "click",
    showCreateModal
);

emptyStateButton.addEventListener(
    "click",
    showCreateModal
);

closeTaskModal.addEventListener(
    "click",
    closeCreateModal
);

cancelTask.addEventListener(
    "click",
    closeCreateModal
);

taskForm.addEventListener(
    "submit",
    createTask
);


/* Close create modal outside */
taskModal.addEventListener("click", event => {

    if (event.target === taskModal) {
        closeCreateModal();
    }

});


/* =========================================
   EDIT MODAL EVENTS
========================================= */

closeEditTaskModal.addEventListener(
    "click",
    closeEditModal
);

cancelEditTask.addEventListener(
    "click",
    closeEditModal
);

editTaskForm.addEventListener(
    "submit",
    saveEditedTask
);


/* Close edit modal outside */
editTaskModal.addEventListener("click", event => {

    if (event.target === editTaskModal) {
        closeEditModal();
    }

});


/* =========================================
   KEYBOARD SUPPORT
========================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        if (taskModal.classList.contains("show")) {
            closeCreateModal();
        }

        if (editTaskModal.classList.contains("show")) {
            closeEditModal();
        }
    }

});


/* =========================================
   SECURITY HELPER
========================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================
   FORMAT HELPERS
========================================= */

function formatStatus(status) {

    if (status === "in_progress") {
        return "In Progress";
    }

    if (status === "completed") {
        return "Completed";
    }

    return "To Do";
}


function formatPriority(priority) {

    return (
        priority.charAt(0).toUpperCase() +
        priority.slice(1)
    );
}


/* =========================================
   INITIAL LOAD
========================================= */

loadTasks();
