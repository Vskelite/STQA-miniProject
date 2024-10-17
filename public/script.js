document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("task-list");
    const newTaskInput = document.getElementById("new-task");
    const addTaskButton = document.getElementById("add-task");

    // Fetch all tasks on page load
    fetchTasks();

    // Add new task
    addTaskButton.addEventListener("click", () => {
        const task = newTaskInput.value.trim();
        if (task) {
            fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task })
            })
            .then(response => response.json())
            .then(data => {
                appendTask(data);
                newTaskInput.value = "";
            });
        }
    });

    // Fetch and display tasks
    function fetchTasks() {
        fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(tasks => {
            taskList.innerHTML = '';
            tasks.forEach(task => appendTask(task));
        });
    }

    // Append task to the list
    function appendTask(task) {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <span class="${task.done ? 'done' : ''}" data-id="${task.id}">${task.task}</span>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;
        taskList.appendChild(taskItem);

        // Mark task as done/undone
        taskItem.querySelector('span').addEventListener('click', () => {
            const done = !taskItem.querySelector('span').classList.contains('done');
            fetch(`http://localhost:3000/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ done })
            })
            .then(response => response.json())
            .then(() => {
                taskItem.querySelector('span').classList.toggle('done');
            });
        });

        // Delete task
        taskItem.querySelector('.delete-btn').addEventListener('click', () => {
            fetch(`http://localhost:3000/tasks/${task.id}`, {
                method: 'DELETE'
            })
            .then(() => {
                taskItem.remove();
            });
        });
    }
});
