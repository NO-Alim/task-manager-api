document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token'); // We still check this, but for cookies, it's the backend
    const statusMessage = document.getElementById('statusMessage');
    const taskList = document.getElementById('taskList');
    const logoutButton = document.getElementById('logoutButton');

    // For cookie-based auth, initially, we just try to fetch tasks.
    // If it fails with 401/403, then we redirect to login.
    // No direct token check here because it's in the cookie.

    logoutButton.addEventListener('click', async function() {
        try {
            const response = await fetch('/api/auth/logout', { method: 'GET' });
            if (response.ok) {
                // Cookie is cleared by backend, just redirect
                window.location.href = '/login';
            } else {
                // Handle potential logout errors
                console.error('Logout failed', await response.json());
                statusMessage.style.color = 'red';
                statusMessage.textContent = 'Logout failed. Please try again.';
            }
        } catch (error) {
            console.error('Logout fetch error:', error);
            statusMessage.style.color = 'red';
            statusMessage.textContent = 'An error occurred during logout.';
        }
    });

    try {
        const response = await fetch('/api/tasks', {
            method: 'GET',
            // No manual Authorization header needed if using HTTP-only cookies
            // The browser sends the cookie automatically.
        });

        if (response.ok) {
            const data = await response.json();
            statusMessage.textContent = `Welcome! You have ${data.data ? data.data.length : 0} tasks.`;
            taskList.innerHTML = ''; // Clear existing content
            if (data.data && data.data.length > 0) {
                data.data.forEach(task => {
                    const li = document.createElement('li');
                    li.className = `task-item ${task.completed ? 'completed' : ''}`;
                    li.textContent = task.title;
                    taskList.appendChild(li);
                });
            } else {
                statusMessage.textContent = 'No tasks found. Add some using the API!';
            }
        } else if (response.status === 401 || response.status === 403) {
            statusMessage.style.color = 'red';
            statusMessage.textContent = 'Authentication failed. Please log in again.';
            // No localStorage.removeItem('token') needed now
            setTimeout(() => { window.location.href = '/login'; }, 1500);
        } else {
            const errorData = await response.json();
            statusMessage.style.color = 'red';
            statusMessage.textContent = errorData.message || 'Failed to fetch tasks.';
        }
    } catch (error) {
        statusMessage.style.color = 'red';
        statusMessage.textContent = 'An error occurred while fetching tasks.';
        console.error('Fetch tasks error:', error);
    }
}); 