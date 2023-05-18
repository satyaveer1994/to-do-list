document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const registerUsernameInput = document.getElementById("register-username");
  const registerPasswordInput = document.getElementById("register-password");
  const registerError = document.getElementById("register-error");

  const loginForm = document.getElementById("login-form");
  const loginUsernameInput = document.getElementById("login-username");
  const loginPasswordInput = document.getElementById("login-password");
  const loginError = document.getElementById("login-error");

  const taskSection = document.getElementById("task-section");
  const createTaskForm = document.getElementById("create-task-form");
  const taskTitleInput = document.getElementById("task-title");
  const taskPriorityInput = document.getElementById("task-priority");
  const taskList = document.getElementById("task-list");
  const taskReport = document.getElementById("task-report");

  let token = "";

  // User registration
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = registerUsernameInput.value;
    const password = registerPasswordInput.value;

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        registerUsernameInput.value = "";
        registerPasswordInput.value = "";
        registerError.textContent = "";
        showLoginForm();
      } else {
        const data = await response.json();
        registerError.textContent = data.error;
      }
    } catch (error) {
      console.error("Error registering user", error);
      registerError.textContent = "Failed to register user";
    }
  });

  // User login
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = loginUsernameInput.value;
    const password = loginPasswordInput.value;

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        token = data.token;
        loginUsernameInput.value = "";
        loginPasswordInput.value = "";
        loginError.textContent = "";
        showTaskSection();
        fetchTasks();
        fetchTaskReport();
      } else {
        const data = await response.json();
        loginError.textContent = data.error;
      }
    } catch (error) {
      console.error("Error logging in", error);
      loginError.textContent = "Failed to log in";
    }
  });

  // Create a task
  createTaskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const taskTitle = taskTitleInput.value;
    const taskPriority = taskPriorityInput.value;

    try {
      const response = await fetch("/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ title: taskTitle, priority: taskPriority }),
      });

      if (response.ok) {
        taskTitleInput.value = "";
        taskPriorityInput.value = "";
        fetchTasks();
        fetchTaskReport();
      } else {
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task", error);
    }
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch("/tasks", {
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const tasks = await response.json();
        displayTasks(tasks);
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  // Display tasks
  const displayTasks = (tasks) => {
    taskList.innerHTML = "";

    tasks.forEach((task) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${task.title} (${task.priority})`;

      if (task.completed) {
        listItem.classList.add("completed");
      } else if (task.canceled) {
        listItem.classList.add("canceled");
      }

      const completeButton = document.createElement("button");
      completeButton.textContent = "Complete";
      completeButton.addEventListener("click", () =>
        markTaskAsCompleted(task._id)
      );

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.addEventListener("click", () =>
        markTaskAsCanceled(task._id)
      );

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteTask(task._id));

      listItem.appendChild(completeButton);
      listItem.appendChild(cancelButton);
      listItem.appendChild(deleteButton);

      taskList.appendChild(listItem);
    });
  };

  // Mark a task as completed
  const markTaskAsCompleted = async (taskId) => {
    try {
      const response = await fetch(`/tasks/${taskId}/complete`, {
        method: "PATCH",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        fetchTasks();
        fetchTaskReport();
      } else {
        console.error("Failed to mark task as completed");
      }
    } catch (error) {
      console.error("Error marking task as completed", error);
    }
  };

  // Mark a task as canceled
  const markTaskAsCanceled = async (taskId) => {
    try {
      const response = await fetch(`/tasks/${taskId}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        fetchTasks();
        fetchTaskReport();
      } else {
        console.error("Failed to mark task as canceled");
      }
    } catch (error) {
      console.error("Error marking task as canceled", error);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        fetchTasks();
        fetchTaskReport();
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  // Fetch task report
  const fetchTaskReport = async () => {
    try {
      const response = await fetch("/tasks/report", {
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const report = await response.json();
        displayTaskReport(report);
      } else {
        console.error("Failed to fetch task report");
      }
    } catch (error) {
      console.error("Error fetching task report", error);
    }
  };

  // Display task report
  const displayTaskReport = (report) => {
    taskReport.innerHTML = `
        <li>Pending tasks: ${report.pending}</li>
        <li>Completed tasks: ${report.completed}</li>
        <li>Canceled tasks: ${report.canceled}</li>
        <li>Deleted tasks: ${report.deleted}</li>
      `;
  };

  // Show login form and hide registration form
  const showLoginForm = () => {
    document.getElementById("registration").style.display = "none";
    document.getElementById("login").style.display = "block";
  };

  // Show task section and hide registration/login forms
  const showTaskSection = () => {
    document.getElementById("registration").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("task-section").style.display = "block";
  };

  // Check if token exists in local storage
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    token = storedToken;
    showTaskSection();
    fetchTasks();
    fetchTaskReport();
  } else {
    document.getElementById("registration").style.display = "block";
  }
});
