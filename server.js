const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files

// Initialize Database
const db = new sqlite3.Database('./sevasindu.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize Database Tables
function initializeDatabase() {
    // Senior Citizens Table
    db.run(`CREATE TABLE IF NOT EXISTS senior_citizens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        aadhaar TEXT UNIQUE NOT NULL,
        date_of_birth TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Normal Users Table
    db.run(`CREATE TABLE IF NOT EXISTS normal_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        aadhaar TEXT UNIQUE NOT NULL,
        date_of_birth TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Government Officials Table
    db.run(`CREATE TABLE IF NOT EXISTS government_officials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        employee_id TEXT UNIQUE NOT NULL,
        department TEXT NOT NULL,
        designation TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('Database tables initialized');
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Helper function to generate JWT token
function generateToken(user, userType) {
    return jwt.sign(
        { 
            id: user.id, 
            username: user.username, 
            userType: userType 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// ==================== SENIOR CITIZEN ROUTES ====================

// Register Senior Citizen
app.post('/api/senior/register', async (req, res) => {
    try {
        const { fullName, aadhaar, dateOfBirth, phone, email, username, password } = req.body;

        // Validation
        if (!fullName || !aadhaar || !dateOfBirth || !phone || !email || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (aadhaar.length !== 12) {
            return res.status(400).json({ error: 'Aadhaar number must be 12 digits' });
        }

        if (phone.length !== 10) {
            return res.status(400).json({ error: 'Phone number must be 10 digits' });
        }

        // Check if username or email already exists
        db.get('SELECT * FROM senior_citizens WHERE username = ? OR email = ? OR aadhaar = ?',
            [username, email, aadhaar], async (err, row) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                if (row) {
                    return res.status(400).json({ error: 'Username, email, or Aadhaar already exists' });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert user
                db.run('INSERT INTO senior_citizens (full_name, aadhaar, date_of_birth, phone, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [fullName, aadhaar, dateOfBirth, phone, email, username, hashedPassword],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Error creating account' });
                        }
                        res.status(201).json({ 
                            message: 'Registration successful',
                            userId: this.lastID 
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login Senior Citizen
app.post('/api/senior/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get('SELECT * FROM senior_citizens WHERE username = ? OR email = ?',
        [username, username], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = generateToken(user, 'senior');
            res.json({
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    fullName: user.full_name,
                    email: user.email,
                    userType: 'senior'
                }
            });
        }
    );
});

// ==================== NORMAL USER ROUTES ====================

// Register Normal User
app.post('/api/user/register', async (req, res) => {
    try {
        const { fullName, aadhaar, dateOfBirth, phone, email, username, password } = req.body;

        // Validation
        if (!fullName || !aadhaar || !dateOfBirth || !phone || !email || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (aadhaar.length !== 12) {
            return res.status(400).json({ error: 'Aadhaar number must be 12 digits' });
        }

        if (phone.length !== 10) {
            return res.status(400).json({ error: 'Phone number must be 10 digits' });
        }

        // Check if username or email already exists
        db.get('SELECT * FROM normal_users WHERE username = ? OR email = ? OR aadhaar = ?',
            [username, email, aadhaar], async (err, row) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                if (row) {
                    return res.status(400).json({ error: 'Username, email, or Aadhaar already exists' });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert user
                db.run('INSERT INTO normal_users (full_name, aadhaar, date_of_birth, phone, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [fullName, aadhaar, dateOfBirth, phone, email, username, hashedPassword],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Error creating account' });
                        }
                        res.status(201).json({ 
                            message: 'Registration successful',
                            userId: this.lastID 
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login Normal User
app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get('SELECT * FROM normal_users WHERE username = ? OR email = ?',
        [username, username], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = generateToken(user, 'user');
            res.json({
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    fullName: user.full_name,
                    email: user.email,
                    userType: 'user'
                }
            });
        }
    );
});

// ==================== GOVERNMENT OFFICIAL ROUTES ====================

// Register Government Official
app.post('/api/official/register', async (req, res) => {
    try {
        const { fullName, employeeId, department, designation, phone, email, username, password } = req.body;

        // Validation
        if (!fullName || !employeeId || !department || !designation || !phone || !email || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (phone.length !== 10) {
            return res.status(400).json({ error: 'Phone number must be 10 digits' });
        }

        // Check if username, email, or employee ID already exists
        db.get('SELECT * FROM government_officials WHERE username = ? OR email = ? OR employee_id = ?',
            [username, email, employeeId], async (err, row) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                if (row) {
                    return res.status(400).json({ error: 'Username, email, or Employee ID already exists' });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert official
                db.run('INSERT INTO government_officials (full_name, employee_id, department, designation, phone, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [fullName, employeeId, department, designation, phone, email, username, hashedPassword],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Error creating account' });
                        }
                        res.status(201).json({ 
                            message: 'Registration successful',
                            userId: this.lastID 
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login Government Official
app.post('/api/official/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get('SELECT * FROM government_officials WHERE username = ? OR email = ?',
        [username, username], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = generateToken(user, 'official');
            res.json({
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    fullName: user.full_name,
                    email: user.email,
                    employeeId: user.employee_id,
                    department: user.department,
                    designation: user.designation,
                    userType: 'official'
                }
            });
        }
    );
});

// ==================== PROTECTED ROUTES ====================

// Get user profile (protected)
app.get('/api/profile', authenticateToken, (req, res) => {
    const { userType, id } = req.user;
    let tableName;

    switch (userType) {
        case 'senior':
            tableName = 'senior_citizens';
            break;
        case 'user':
            tableName = 'normal_users';
            break;
        case 'official':
            tableName = 'government_officials';
            break;
        default:
            return res.status(400).json({ error: 'Invalid user type' });
    }

    db.get(`SELECT * FROM ${tableName} WHERE id = ?`, [id], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove password from response
        delete user.password;
        res.json({ user });
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed');
        process.exit(0);
    });
});


