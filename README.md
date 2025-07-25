# Task Manager API

A simple RESTful API for managing tasks, built with Node.js, Express, and MongoDB.

## Features

-   **User Authentication & Authorization**: Secure user registration, login, and role-based access control (admin/user).
-   Create, Read, Update, and Delete tasks (CRUD operations).
-   **Task Ownership**: Users can only manage their own tasks.
-   Filter tasks by completion status.
-   Get a single task by ID.
-   Handle missing routes with a 404 middleware.
-   Global error handling for various error types (Mongoose validation, CastError, duplicate fields).
-   **Rate Limiting**: Protect API routes from excessive requests.
-   **Security Headers**: Enhanced security with Helmet to set various HTTP headers.
-   **Request Sanitization**: Protect against NoSQL injection and other malicious inputs.

## Technologies Used

-   Node.js
-   Express.js
-   MongoDB (with Mongoose ODM)
-   JWT (JSON Web Tokens) for authentication
-   Bcrypt (for password hashing - *assumed based on `user.model.js` and `auth.controller.js`*)
-   Helmet
-   CORS
-   Express Rate Limit
-   Cookie Parser

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd task-manager-api
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file in the project root and add your MongoDB connection string and JWT secret:**

    ```
    MONGO_URI=your_mongodb_connection_string
    PORT=3000
    NODE_ENV=development
    JWT_SECRET=your_jwt_secret_key
    JWT_COOKIE_EXPIRES_IN=90d
    ```

    *Replace `your_mongodb_connection_string` with your actual MongoDB URI (e.g., from MongoDB Atlas or a local instance).*
    *Replace `your_jwt_secret_key` with a strong, random string for JWT signing.*

4.  **Run the application:**

    ```bash
    npm start
    # Or for development with nodemon:
    npm run dev
    ```

    The API will be running on `http://localhost:3000` (or your specified PORT).

## Authentication and Authorization

This API implements JWT-based authentication to secure endpoints.

-   **Registration**: New users can sign up with a unique username and password.
-   **Login**: Registered users can log in to obtain a JWT token, which is stored in an HTTP-only cookie.
-   **Protected Routes**: Endpoints requiring authentication (e.g., task management) are protected by the `protectRoute` middleware, which verifies the JWT.
-   **Role-Based Access Control**: Some routes (e.g., user management) are further protected by the `authorizeRole` middleware, ensuring only users with specific roles (e.g., 'admin') can access them.

## API Endpoints

### Authentication Endpoints

Base URL: `http://localhost:3000/api/auth`

#### Register User

-   **URL:** `/api/auth/register`
-   **Method:** `POST`
-   **Request Body (JSON):**
    ```json
    {
        "userName": "testuser",
        "email": "test@example.com",
        "password": "strongpassword123"
    }
    ```
-   **Success Response:** `201 Created` with user data and JWT token.

#### Login User

-   **URL:** `/api/auth/login`
-   **Method:** `POST`
-   **Request Body (JSON):**
    ```json
    {
        "email": "test@example.com",
        "password": "strongpassword123"
    }
    ```
-   **Success Response:** `200 OK` with user data and JWT token.

#### Logout User

-   **URL:** `/api/auth/logout`
-   **Method:** `GET`
-   **Success Response:** `200 OK` with a message indicating successful logout.

### User Management Endpoints (Admin Only)

Base URL: `http://localhost:3000/api/user`

#### Get All Users

-   **URL:** `/api/user`
-   **Method:** `GET`
-   **Authorization:** Requires 'admin' role.
-   **Success Response:** `200 OK` with a list of all users.

#### Get User by ID

-   **URL:** `/api/user/:id`
-   **Method:** `GET`
-   **Authorization:** Requires 'admin' role.
-   **Success Response:** `200 OK` with the requested user's data.

#### Update User

-   **URL:** `/api/user/:id`
-   **Method:** `PUT`
-   **Authorization:** Requires 'admin' role.
-   **Request Body (JSON):**
    ```json
    {
        "userName": "updatedName",
        "email": "updated@example.com",
        "role": "user"
    }
    ```
-   **Success Response:** `200 OK` with the updated user data.

#### Delete User

-   **URL:** `/api/user/:id`
-   **Method:** `DELETE`
-   **Authorization:** Requires 'admin' role.
-   **Success Response:** `204 No Content`.

### Task Management Endpoints

Base URL: `http://localhost:3000/api/tasks`
**Authorization:** All task endpoints require a logged-in user (`protectRoute` middleware). Users can only interact with tasks they own.

### Get All Tasks

-   **URL:** `/api/tasks`
-   **Method:** `GET`
-   **Query Parameters:**
    -   `completed`: (Optional) `true` or `false` to filter tasks by completion status.
    -   `keyword`: (Optional) A string to search for within task fields.
    -   `searchBy`: (Optional) Comma-separated list of fields to search (e.g., `title,description`). Defaults to `title` if omitted.
    -   `sort`: (Optional) Field(s) to sort by. Prepend `-` for descending order (e.g., `title,-createdAt`). Defaults to `-createdAt`.
    -   `page`: (Optional) Page number for pagination. Defaults to `1`.
    -   `limit`: (Optional) Number of results per page. Defaults to `10`.
-   **Search:**
    Allows keyword-based fuzzy search on one or more specified text fields.
    Uses case-insensitive partial matching (`$regex`).
    Controlled by these query parameters:
    -   `keyword` — the search string.
    -   `searchBy` — comma-separated list of fields to search (optional).
        Defaults to searching only the `title` field if `searchBy` is omitted.
    
    **Example URLs:**
    -   `/api/tasks?keyword=hello`
        Searches for "hello" in the `title` field.
    -   `/api/tasks?keyword=hello&searchBy=title,description`
        Searches for "hello" in both `title` and `description` fields.

-   **Success Response:** `200 OK`

    ```json
    {
        "success": true,
        "data": {
            "tasks": [
                { "_id": "task_id_1", "title": "Task 1", "completed": false },
                { "_id": "task_id_2", "title": "Task 2", "completed": true }
            ]
        }
    }
    ```

### Get Task by ID

-   **URL:** `/api/tasks/:id`
-   **Method:** `GET`
-   **Success Response:** `200 OK`

    ```json
    {
        "success": true,
        "data": {
            "task": { "_id": "task_id", "title": "Task Title", "completed": false }
        }
    }
    ```

### Add New Task

-   **URL:** `/api/tasks`
-   **Method:** `POST`
-   **Request Body (JSON):**

    ```json
    {
        "title": "New Task Title",
        "completed": false
    }
    ```

-   **Success Response:** `201 Created`

    ```json
    {
        "success": true,
        "data": {
            "task": { "_id": "new_task_id", "title": "New Task Title", "completed": false }
        }
    }
    ```

### Update Task

-   **URL:** `/api/tasks/:id`
-   **Method:** `PUT`
-   **Request Body (JSON):**

    ```json
    {
        "title": "Updated Task Title",
        "completed": true
    }
    ```

-   **Success Response:** `200 OK`

    ```json
    {
        "success": true,
        "data": {
            "updatedTask": { "_id": "task_id", "title": "Updated Task Title", "completed": true }
        }
    }
    ```

### Delete Task

-   **URL:** `/api/tasks/:id`
-   **Method:** `DELETE`
-   **Success Response:** `204 No Content`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 