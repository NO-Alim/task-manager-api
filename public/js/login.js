document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('message');

    const email = emailInput ? emailInput.value : '';
    const password = passwordInput ? passwordInput.value : '';

    try {
        
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        

        if (response.ok) {
            messageDiv.style.color = 'green';
            messageDiv.textContent = data.message || 'Login successful!';
            window.location.href = '/'; // Redirect to homepage
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = data.message || 'Login failed.';
        }
    } catch (error) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'An error occurred. Please try again.';
        console.error('Login error:', error);
    }
}); 