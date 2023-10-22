const todoContainer = document.getElementById('todo-container');
const todoButton = document.getElementById('todo-button');

todoButton.addEventListener('click', () => {
    todoContainer.style.display = todoContainer.style.display === 'none' || todoContainer.style.display === '' ? 'block' : 'none';
});
function addTask() {
    const taskInput = document.getElementById('task');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <label><input type="checkbox"> ${taskText}</label>
            <button onclick="removeTask(this.parentElement)">x</button>
        `;
        taskList.appendChild(taskItem);
        taskInput.value = '';
    }
}

// JavaScript for removing tasks from the to-do list
function removeTask(taskItem) {
    taskList.removeChild(taskItem);
}


function removeTask(button) {
    const taskList = document.getElementById("task-list");
    taskList.removeChild(button.parentElement);
}
