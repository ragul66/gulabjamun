// JavaScript to handle modal functionality
const modal = document.getElementById('todoModal');
const todoToggleBtn = document.getElementById('todoToggleBtn');
const closeBtn = document.querySelector('#todoModal .close');
const taskList = document.getElementById('task-list');

todoToggleBtn.addEventListener('click', function() {
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
});

closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// JavaScript for adding tasks to the to-do list
function addTask() {
    const taskInput = document.getElementById('task');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <label><input type="checkbox"> ${taskText}</label>
            <button onclick="removeTask(this)">x</button>
        `;
        taskList.appendChild(taskItem);
        taskInput.value = '';
    }
}

// JavaScript for removing tasks from the to-do list
function removeTask(button) {
    const taskItem = button.parentElement;
    taskList.removeChild(taskItem);
}
