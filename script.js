// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to show loading state
function setLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.textContent = 'Processing...';
    } else {
        button.disabled = false;
        button.textContent = button.getAttribute('data-original-text') || 'Submit';
    }
}

// Helper function to show error messages
function showError(message) {
    alert(message);
}

// Helper function to show success messages
function showSuccess(message) {
    alert(message);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Senior Citizen Login Form Handler
const seniorLoginForm = document.getElementById('seniorLoginForm');
if (seniorLoginForm) {
    const loginBtn = seniorLoginForm.querySelector('.login-btn');
    loginBtn.setAttribute('data-original-text', 'Login');
    
    seniorLoginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('seniorUsername').value;
        const password = document.getElementById('seniorPassword').value;
        
        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }

        setLoading(loginBtn, true);

        try {
            const response = await fetch(`${API_BASE_URL}/senior/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                showSuccess('Login successful! Redirecting to Senior Citizen Dashboard...');
                // Redirect to dashboard (create this page later)
                // window.location.href = 'dashboard-senior.html';
            } else {
                showError(data.error || 'Login failed');
            }
        } catch (error) {
            showError('Network error. Please make sure the server is running.');
            console.error('Login error:', error);
        } finally {
            setLoading(loginBtn, false);
        }
    });
}

// Normal User Login Form Handler
const userLoginForm = document.getElementById('userLoginForm');
if (userLoginForm) {
    const loginBtn = userLoginForm.querySelector('.login-btn');
    loginBtn.setAttribute('data-original-text', 'Login');
    
    userLoginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('userUsername').value;
        const password = document.getElementById('userPassword').value;
        
        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }

        setLoading(loginBtn, true);

        try {
            const response = await fetch(`${API_BASE_URL}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                showSuccess('Login successful! Redirecting to Normal User Dashboard...');
                // window.location.href = 'dashboard-user.html';
            } else {
                showError(data.error || 'Login failed');
            }
        } catch (error) {
            showError('Network error. Please make sure the server is running.');
            console.error('Login error:', error);
        } finally {
            setLoading(loginBtn, false);
        }
    });
}

// Government Official Login Form Handler
const officialLoginForm = document.getElementById('officialLoginForm');
if (officialLoginForm) {
    const loginBtn = officialLoginForm.querySelector('.login-btn');
    loginBtn.setAttribute('data-original-text', 'Login');
    
    officialLoginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('officialUsername').value;
        const password = document.getElementById('officialPassword').value;
        
        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }

        setLoading(loginBtn, true);

        try {
            const response = await fetch(`${API_BASE_URL}/official/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                showSuccess('Login successful! Redirecting to Government Official Dashboard...');
                // window.location.href = 'dashboard-official.html';
            } else {
                showError(data.error || 'Login failed');
            }
        } catch (error) {
            showError('Network error. Please make sure the server is running.');
            console.error('Login error:', error);
        } finally {
            setLoading(loginBtn, false);
        }
    });
}

// Senior Citizen Registration Form Handler
const seniorRegisterForm = document.getElementById('seniorRegisterForm');
if (seniorRegisterForm) {
    const registerBtn = seniorRegisterForm.querySelector('.register-btn');
    registerBtn.setAttribute('data-original-text', 'Register');
    
    seniorRegisterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const password = document.getElementById('seniorRegPassword').value;
        const confirmPassword = document.getElementById('seniorConfirmPassword').value;
        
        if (password !== confirmPassword) {
            showError('Passwords do not match!');
            return;
        }

        const formData = {
            fullName: document.getElementById('seniorFullName').value,
            aadhaar: document.getElementById('seniorAadhaar').value,
            dateOfBirth: document.getElementById('seniorDateOfBirth').value,
            phone: document.getElementById('seniorPhone').value,
            email: document.getElementById('seniorEmail').value,
            username: document.getElementById('seniorRegUsername').value,
            password: password
        };

        setLoading(registerBtn, true);

        try {
            const response = await fetch(`${API_BASE_URL}/senior/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess('Registration successful! Redirecting to login page...');
                setTimeout(() => {
                    window.location.href = 'login-senior.html';
                }, 1000);
            } else {
                showError(data.error || 'Registration failed');
            }
        } catch (error) {
            showError('Network error. Please make sure the server is running.');
            console.error('Registration error:', error);
        } finally {
            setLoading(registerBtn, false);
        }
    });
}

// Normal User Registration Form Handler
const userRegisterForm = document.getElementById('userRegisterForm');
if (userRegisterForm) {
    const registerBtn = userRegisterForm.querySelector('.register-btn');
    registerBtn.setAttribute('data-original-text', 'Register');
    
    userRegisterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const password = document.getElementById('userRegPassword').value;
        const confirmPassword = document.getElementById('userConfirmPassword').value;
        
        if (password !== confirmPassword) {
            showError('Passwords do not match!');
            return;
        }

        const formData = {
            fullName: document.getElementById('userFullName').value,
            aadhaar: document.getElementById('userAadhaar').value,
            dateOfBirth: document.getElementById('userDateOfBirth').value,
            phone: document.getElementById('userPhone').value,
            email: document.getElementById('userEmail').value,
            username: document.getElementById('userRegUsername').value,
            password: password
        };

        setLoading(registerBtn, true);

        try {
            const response = await fetch(`${API_BASE_URL}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess('Registration successful! Redirecting to login page...');
                setTimeout(() => {
                    window.location.href = 'login-user.html';
                }, 1000);
            } else {
                showError(data.error || 'Registration failed');
            }
        } catch (error) {
            showError('Network error. Please make sure the server is running.');
            console.error('Registration error:', error);
        } finally {
            setLoading(registerBtn, false);
        }
    });
}

// Government Official Registration Form Handler
const officialRegisterForm = document.getElementById('officialRegisterForm');
if (officialRegisterForm) {
    const registerBtn = officialRegisterForm.querySelector('.register-btn');
    registerBtn.setAttribute('data-original-text', 'Register');
    
    officialRegisterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const password = document.getElementById('officialRegPassword').value;
        const confirmPassword = document.getElementById('officialConfirmPassword').value;
        
        if (password !== confirmPassword) {
            showError('Passwords do not match!');
            return;
        }

        const formData = {
            fullName: document.getElementById('officialFullName').value,
            employeeId: document.getElementById('officialEmployeeId').value,
            department: document.getElementById('officialDepartment').value,
            designation: document.getElementById('officialDesignation').value,
            phone: document.getElementById('officialPhone').value,
            email: document.getElementById('officialEmail').value,
            username: document.getElementById('officialRegUsername').value,
            password: password
        };

        setLoading(registerBtn, true);

        try {
            const response = await fetch(`${API_BASE_URL}/official/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess('Registration successful! Redirecting to login page...');
                setTimeout(() => {
                    window.location.href = 'login-official.html';
                }, 1000);
            } else {
                showError(data.error || 'Registration failed');
            }
        } catch (error) {
            showError('Network error. Please make sure the server is running.');
            console.error('Registration error:', error);
        } finally {
            setLoading(registerBtn, false);
        }
    });
}

// Highlight active navigation links
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage || 
        (currentPage === 'index.html' && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
    }
});

