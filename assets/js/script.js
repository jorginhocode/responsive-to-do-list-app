document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const clearAllBtn = document.getElementById('clearAllBtn');

    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });

    clearAllBtn.addEventListener('click', clearAllTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (!taskText) return;

        const taskItem = createTaskElement(taskText);
        taskList.appendChild(taskItem);
        taskInput.value = '';
        saveTasks();
    }

    function createTaskElement(taskText, isCompleted = false) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = isCompleted;
        checkbox.addEventListener('change', toggleTask);

        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.textContent = taskText;
        if (isCompleted) taskSpan.classList.add('completed');

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'task-buttons';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<i class="ri-pencil-fill"></i>';
        editBtn.addEventListener('click', () => editTask(taskSpan));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="ri-delete-bin-fill"></i>';
        deleteBtn.addEventListener('click', deleteTask);

        buttonsContainer.append(editBtn, deleteBtn);
        taskItem.append(checkbox, taskSpan, buttonsContainer);

        return taskItem;
    }

    function toggleTask(e) {
        const taskText = e.target.nextElementSibling;
        taskText.classList.toggle('completed');
        saveTasks();
    }

    function deleteTask(e) {
        e.target.closest('.task-item').remove();
        saveTasks();
    }

    function editTask(taskSpan) {
        const currentText = taskSpan.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'edit-input';
        input.style.width = `${taskSpan.offsetWidth}px`;

        taskSpan.textContent = '';
        taskSpan.appendChild(input);
        input.focus();

        const saveEdit = () => {
            const newText = input.value.trim();
            taskSpan.textContent = newText || currentText;
            saveTasks();
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => e.key === 'Enter' && saveEdit());
    }

    function clearAllTasks() {
        if (confirm('¿Estás seguro de que quieres eliminar todas las tareas?')) {
            taskList.innerHTML = '';
            saveTasks();
        }
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(item => {
            tasks.push({
                text: item.querySelector('.task-text').textContent,
                completed: item.querySelector('.task-checkbox').checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            JSON.parse(savedTasks).forEach(task => {
                taskList.appendChild(createTaskElement(task.text, task.completed));
            });
        }
    }
});