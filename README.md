# Bloglist API

A RESTful API for managing blogs and users, built with Node.js, Express, and MongoDB. This project was built as part of the Full Stack Open course (Part 4).

## Features

- User registration and authentication (JWT)
- CRUD operations for blogs
- Blog ownership and authorization
- Password hashing with bcrypt
- MongoDB data modeling with Mongoose
- Comprehensive integration and unit tests
- Logging and error handling

## Endpoints

### Authentication

- `POST /api/login`  
  Authenticate a user and receive a JWT token.

### Users

- `GET /api/users`  
  List all users with their blogs.
- `POST /api/users`  
  Register a new user.
  - Requires a unique username (min 3 chars) and password (min 3 chars).

### Blogs

- `GET /api/blogs`  
  List all blogs.
- `POST /api/blogs`  
  Create a new blog.
  - Requires authentication (JWT).
  - Fields: `title`, `author`, `url`, `likes` (default 0).
- `PUT /api/blogs/:id`  
  Update a blog.
- `DELETE /api/blogs/:id`  
  Delete a blog.
  - Only the creator can delete.

### Testing (only in test mode)

- `POST /api/testing/reset`  
  Reset the database (for automated tests).

## Getting Started

### Prerequisites

- Node.js (v22+ recommended)
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/jakariyaa/fullstackopen-bloglist
   cd fullstackopen-bloglist
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the project root:
   ```
   MONGODB_URI=your_mongodb_uri
   TEST_MONGODB_URI=your_test_mongodb_uri
   SECRET=your_jwt_secret
   PORT=3001
   ```

### Running the Application

- Start the server:
  ```sh
  npm run dev
  ```
  The server will run on the port specified in `.env` (default: 3001).

### Running Tests

- Run all tests:
  ```sh
  npm test
  ```

## Project Structure

- `app.js` – Express app setup and middleware
- `index.js` – Entry point
- `controllers/` – Route handlers for blogs, users, login, and testing
- `models/` – Mongoose schemas for Blog and User
- `utils/` – Middleware, logger, config, and helper functions
- `tests/` – Integration and unit tests

## License

MIT License © 2025 Jakariya Abbas
