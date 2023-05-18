# To-Do List API

This is a To-Do List API built with Express.js and MongoDB. It allows users to create tasks with priorities, mark tasks as completed or canceled, delete tasks, and view task reports.

## Features

- Create a task with priority (1 - 9)
- List tasks with their priorities and status
- Mark tasks as completed
- Mark tasks as canceled
- Delete tasks
- Task report with counts of pending, canceled, completed, and deleted tasks
- User registration and login


## Installation

1. Clone the repository:

        git clone https://github.com/satyaveer1994/to-do-list.git




2. Install the dependencies:

         cd todo-list-api
         npm install



 
3. Set up the environment variables:

Create a `.env` file in the root directory and specify the following variables:

     PORT=3000
     MONGODB_URI=<your-mongodb-uri>        




4. Start the server:

        nodemon src/index.js


 
5. The API will be accessible at `http://localhost:3000`.

## API Documentation

### Task Endpoints

- `POST /tasks`: Create a new task. Requires authentication.

- `GET /tasks`: Get a list of all tasks. Requires authentication.

- `PATCH /tasks/:id/complete`: Mark a task as completed. Requires authentication.

- `PATCH /tasks/:id/cancel`: Mark a task as canceled. Requires authentication.

- `DELETE /tasks/:id`: Delete a task. Requires authentication.

- `GET /tasks/report`: Get the task report. Requires authentication.

### Authentication Endpoints

- `POST /auth/register`: Register a new user.

- `POST /auth/login`: Log in an existing user.

## Technologies Used

- Express.js: Fast and minimalist web framework for Node.js.
- MongoDB: NoSQL database for storing task data.
- JWT (JSON Web Tokens): Authentication mechanism for protecting routes.
- Axios: Promise-based HTTP client for making requests from the frontend.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
       

