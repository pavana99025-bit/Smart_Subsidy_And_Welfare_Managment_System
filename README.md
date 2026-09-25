# SevaSindu Portal - Backend Setup

This is a complete backend solution for the SevaSindu Portal with authentication and database support.

## Features

- ✅ User Registration (Senior Citizen, Normal User, Government Official)
- ✅ User Login with JWT Authentication
- ✅ Password Hashing with bcrypt
- ✅ SQLite Database
- ✅ Protected Routes
- ✅ CORS Enabled for Frontend

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - The `.env` file is already created with default values
   - For production, change the `JWT_SECRET` to a strong random string

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Senior Citizen

- **POST** `/api/senior/register` - Register a senior citizen
- **POST** `/api/senior/login` - Login as senior citizen

### Normal User

- **POST** `/api/user/register` - Register a normal user
- **POST** `/api/user/login` - Login as normal user

### Government Official

- **POST** `/api/official/register` - Register a government official
- **POST** `/api/official/login` - Login as government official

### Protected Routes

- **GET** `/api/profile` - Get user profile (requires authentication token)

### Health Check

- **GET** `/api/health` - Check if server is running

## API Request Examples

### Registration (Senior Citizen)
```json
POST /api/senior/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "aadhaar": "123456789012",
  "dateOfBirth": "1950-01-01",
  "phone": "9876543210",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

### Login
```json
POST /api/senior/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

### Response (Login)
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "userType": "senior"
  }
}
```

## Authentication

After successful login, include the token in subsequent requests:

```
Authorization: Bearer <your-token-here>
```

## Database

The application uses SQLite database (`sevasindu.db`). The database file will be created automatically when you first run the server.

### Database Tables

- `senior_citizens` - Stores senior citizen user data
- `normal_users` - Stores normal user data
- `government_officials` - Stores government official data

## Frontend Integration

The frontend is already configured to connect to the backend API. Make sure:

1. The backend server is running on `http://localhost:3000`
2. The frontend files are served (you can use the Express static file serving or a separate web server)

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, change it in the `.env` file:
```
PORT=3001
```

### Database Errors
- Make sure you have write permissions in the project directory
- Delete `sevasindu.db` if you want to reset the database

### CORS Issues
- CORS is enabled for all origins. For production, restrict it to your frontend domain.

## Security Notes

- Change the `JWT_SECRET` in production
- Use HTTPS in production
- Implement rate limiting for production
- Add input validation and sanitization
- Consider using environment variables for sensitive data

## Next Steps

- Create dashboard pages for each user type
- Add more API endpoints for services
- Implement password reset functionality
- Add email verification
- Add logging and error tracking


