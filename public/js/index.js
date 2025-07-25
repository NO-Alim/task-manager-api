document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    const statusMessage = document.getElementById('statusMessage');
    const taskList = document.getElementById('taskList');
    const logoutButton = document.getElementById('logoutButton');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const addTaskForm = document.getElementById('addTaskForm');
    const taskTitleInput = document.getElementById('taskTitle');
    const addTaskMessage = document.getElementById('addTaskMessage');
    
    // Removed localStorage.getItem('username');
    // Removed if (usernameDisplay && username) { ... }

    // Removed if (!token) { ... }

    logoutButton.addEventListener('click', async function() {
        // Perform logout API call to clear HttpOnly cookie on backend
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            if (response.ok) {
                localStorage.removeItem('token'); // Remove this line eventually if not used
                localStorage.removeItem('username'); // Remove this line eventually if not used
                window.location.href = '/login';
            } else {
                console.error('Logout failed:', await response.json());
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('An error occurred during logout.');
        }
    });

    // Function to fetch and display tasks
    async function fetchTasks() {
        try {
            const response = await fetch('/api/tasks', {
                method: 'GET',
                // No need for Authorization header if HttpOnly cookie is used
            });

            if (response.ok) {
                const data = await response.json();
                statusMessage.textContent = `Welcome! You have ${data.count} tasks.`;

                // Display username from API response
                if (usernameDisplay && data.userName) {
                    usernameDisplay.textContent = `Hello, ${data.userName}!`;
                }

                taskList.innerHTML = ''; // Clear existing content
                if (data.data && data.data.length > 0) {
                    data.data.forEach(task => {
                        const li = document.createElement('li');
                        li.className = `task-item ${task.completed ? 'completed' : ''}`;
                        li.dataset.id = task._id; // Store task ID

                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.checked = task.completed;
                        checkbox.addEventListener('change', () => toggleTaskCompletion(task._id, checkbox.checked));
                        li.appendChild(checkbox);

                        const titleSpan = document.createElement('span');
                        titleSpan.className = 'title';
                        titleSpan.textContent = task.title;
                        li.appendChild(titleSpan);

                        const actionsDiv = document.createElement('div');
                        actionsDiv.className = 'actions';

                        const editButton = document.createElement('button');
                        editButton.className = 'edit-button';
                        editButton.textContent = 'Edit';
                        editButton.addEventListener('click', () => editTask(task._id, titleSpan));
                        actionsDiv.appendChild(editButton);

                        const deleteButton = document.createElement('button');
                        deleteButton.className = 'delete-button';
                        deleteButton.textContent = 'Delete';
                        deleteButton.addEventListener('click', () => deleteTask(task._id));
                        actionsDiv.appendChild(deleteButton);

                        li.appendChild(actionsDiv);
                        taskList.appendChild(li);
                    });
                } else {
                    statusMessage.textContent = 'No tasks found. Add some using the API!';
                }
            } else if (response.status === 401 || response.status === 403) {
                // Handle redirection to login if not authenticated
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                statusMessage.style.color = 'red';
                statusMessage.textContent = errorData.message || 'Failed to fetch tasks.';
            }
        } catch (error) {
            statusMessage.style.color = 'red';
            statusMessage.textContent = 'An error occurred while fetching tasks.';
            console.error('Fetch tasks error:', error);
            // If network error, might still need to redirect if user is truly unauthenticated
            if (error.message.includes('Failed to fetch')) { // Generic network error
                setTimeout(() => { window.location.href = '/login'; }, 1500); // Redirect after a delay
            }
        }
    }

    // Function to toggle task completion
    async function toggleTaskCompletion(id, completed) {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Removed 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completed })
            });

            if (response.ok) {
                const taskItem = document.querySelector(`li[data-id="${id}"]`);
                if (taskItem) {
                    if (completed) {
                        taskItem.classList.add('completed');
                    } else {
                        taskItem.classList.remove('completed');
                    }
                    statusMessage.style.color = 'green';
                    statusMessage.textContent = 'Task updated successfully!';
                    setTimeout(() => { statusMessage.textContent = ''; }, 1000);
                }
            } else if (response.status === 401 || response.status === 403) {
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                statusMessage.style.color = 'red';
                statusMessage.textContent = errorData.message || 'Failed to update task status.';
            }
        } catch (error) {
            statusMessage.style.color = 'red';
            statusMessage.textContent = 'An error occurred while updating task status.';
            console.error('Update task status error:', error);
        }
    }

    // Function to edit a task
    async function editTask(id, titleSpan) {
        const newTitle = prompt('Edit task title:', titleSpan.textContent);
        if (newTitle === null || newTitle.trim() === '') {
            return; // User cancelled or entered empty title
        }

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Removed 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: newTitle.trim() })
            });

            if (response.ok) {
                titleSpan.textContent = newTitle.trim();
                statusMessage.style.color = 'green';
                statusMessage.textContent = 'Task updated successfully!';
                setTimeout(() => { statusMessage.textContent = ''; }, 1000);
            } else if (response.status === 401 || response.status === 403) {
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                statusMessage.style.color = 'red';
                statusMessage.textContent = errorData.message || 'Failed to update task.';
            }
        } catch (error) {
            statusMessage.style.color = 'red';
            statusMessage.textContent = 'An error occurred while updating the task.';
            console.error('Edit task error:', error);
        }
    }

    // Function to delete a task
    async function deleteTask(id) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    // Removed 'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 204) {
                statusMessage.style.color = 'green';
                statusMessage.textContent = 'Task deleted successfully!';
                setTimeout(() => { statusMessage.textContent = ''; }, 1000);
                fetchTasks(); // Refresh the task list
            } else if (response.status === 401 || response.status === 403) {
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                statusMessage.style.color = 'red';
                statusMessage.textContent = errorData.message || 'Failed to delete task.';
            }
        } catch (error) {
            statusMessage.style.color = 'red';
            statusMessage.textContent = 'An error occurred while deleting the task.';
            console.error('Delete task error:', error);
        }
    }

    // Initial fetch of tasks
    fetchTasks();

    // Add Task Form Submission
    addTaskForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const title = taskTitleInput && taskTitleInput.value ? taskTitleInput.value.trim() : '';

        if (!title) {
            addTaskMessage.style.color = 'red';
            addTaskMessage.textContent = 'Task title cannot be empty.';
            return;
        }

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Removed 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title })
            });

            const data = await response.json();

            if (response.ok) {
                addTaskMessage.style.color = 'green';
                addTaskMessage.textContent = data.message || 'Task added successfully!';
                taskTitleInput.value = ''; // Clear input
                fetchTasks(); // Refresh the task list
                setTimeout(() => {
                    addTaskMessage.textContent = '';
                }, 1000);
            } else if (response.status === 401 || response.status === 403) {
                window.location.href = '/login';
            } else {
                addTaskMessage.style.color = 'red';
                addTaskMessage.textContent = data.message || 'Failed to add task.';
            }
        } catch (error) {
            addTaskMessage.style.color = 'red';
            addTaskMessage.textContent = 'An error occurred while adding the task.';
            console.error('Add task error:', error);
        }
    });
}); 