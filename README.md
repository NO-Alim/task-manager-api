# Task Manager API

A simple RESTful API for managing tasks, built with Node.js, Express, and MongoDB.

## Features

- Create, Read, Update, and Delete tasks (CRUD operations).
- Filter tasks by completion status.
- Get a single task by ID.
- Handle missing routes with a 404 middleware.
- Global error handling for various error types (Mongoose validation, CastError, duplicate fields).

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose ODM)

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

3.  **Create a `.env` file in the project root and add your MongoDB connection string:**

    ```
    MONGO_URI=your_mongodb_connection_string
    PORT=3000
    NODE_ENV=development
    ```

    *Replace `your_mongodb_connection_string` with your actual MongoDB URI (e.g., from MongoDB Atlas or a local instance).* 

4.  **Run the application:**

    ```bash
    npm start
    # Or for development with nodemon:
    npm run dev
    ```

    The API will be running on `http://localhost:3000` (or your specified PORT).

## API Endpoints

Base URL: `http://localhost:3000/api/tasks`

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