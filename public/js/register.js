document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName: username ? username.value : '', email: email ? email.value : '', password: password ? password.value : '' })
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.style.color = 'green';
            messageDiv.textContent = data.message || 'Registration successful! Please login.';
            // Optionally, you can store the token here if the API sends it directly
            // localStorage.setItem('token', data.token);\
            window.location.href = '/login'; // Redirect to login page after successful registration
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = data.message || 'Registration failed.';
        }
    } catch (error) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'An error occurred. Please try again.';
        console.error('Registration error:', error);
    }
}); 