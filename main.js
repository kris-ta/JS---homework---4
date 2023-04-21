"use strict";

// Variables
const STORAGE_KEY = "tasks";

// DOM variables
const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const filterInput = document.querySelector(".filter-input");
const taskList = document.querySelector(".collection");
const clearButton = document.querySelector(".clear-tasks");

// "storage" functions
const getTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return tasks;
};

const storeTaskInLocalStorage = (task) => {
  const tasks = getTasksFromLocalStorage();
  tasks.push(task);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const updateTasksInLocalStorage = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const storeEditedTaskInLocalStorage = (editedTask, index) => {
  const tasks = getTasksFromLocalStorage();
  tasks[index] = editedTask;
  updateTasksInLocalStorage(tasks);
};

const removeTaskFromLocalStorage = (deletedTaskIndex) => {
  const tasks = getTasksFromLocalStorage();

  // other variant .filter
  tasks.splice(deletedTaskIndex, 1);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const clearTasksFromLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// "tasks" functions
const getTasks = () => {
  const tasks = getTasksFromLocalStorage();

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "collection-item";
    // li.textContent = task;
    li.dataset.index = index;

    const textSpan = document.createElement("span");
    textSpan.textContent = task;
    li.append(textSpan);

    const deleteButton = document.createElement("span");
    deleteButton.className = "delete-item";
    deleteButton.innerHTML = '<i class="fa fa-remove"></i>';
    li.append(deleteButton);

    const editButton = document.createElement("span");
    editButton.className = "edit-item";
    editButton.innerHTML = `<i class="fa fa-edit"></i>`;
    li.append(editButton);

    // Append li to ul
    taskList.append(li);
  });
};

const addTask = (event) => {
  event.preventDefault();

  // Пусте значення або пробіли
  if (taskInput.value.trim() === "") {
    return;
  }

  // Create and add LI element
  const li = document.createElement("li");
  li.className = "collection-item";
  // li.textContent = taskInput.value; // значення яке ввів користувач
  const textSpan = document.createElement("span");
  textSpan.textContent = taskInput.value;
  li.append(textSpan);

  const deleteButton = document.createElement("span");
  deleteButton.className = "delete-item";
  deleteButton.innerHTML = '<i class="fa fa-remove"></i>';
  li.append(deleteButton);

  const editButton = document.createElement("span");
  editButton.className = "edit-item";
  editButton.innerHTML = `<i class="fa fa-edit"></i>`;
  li.append(editButton);

  taskList.append(li);

  // Save to storage
  storeTaskInLocalStorage(taskInput.value);

  // Clear input value
  taskInput.value = "";
};

const removeTask = (event) => {
  const isDeleteIcon = event.target.classList.contains("fa-remove");

  if (isDeleteIcon) {
    const isApproved = confirm("Ви впевнені що хочете видалити це завдання?");

    if (isApproved) {
      // remove from DOM
      // console.log(event.target.parentElement.parentElement);
      const deletedLi = event.target.closest("li");
      deletedLi.remove();

      removeTaskFromLocalStorage(deletedLi.dataset.index);
    }
  }
};

const editTask = (event) => {
  const isEditIcon = event.target.classList.contains("fa-edit");
  if (isEditIcon) {
    const editedLi = event.target.closest("li");

    const textSpan = editedLi.querySelector("span");
    const defaultValue = textSpan.textContent;

    const editedText = prompt("Введіть нову назву.", defaultValue);
    console.log(editedText, typeof editedText);

    if (editedText) {
      textSpan.textContent = editedText;
    }
    // зберегти відредагований таск

    const index = editedLi.dataset.index;
    storeEditedTaskInLocalStorage(editedText, index);
  }
};

const clearTasks = () => {
  taskList.innerHTML = "";
  clearTasksFromLocalStorage();
};

const filterTasks = (event) => {
  const text = event.target.value.toLowerCase();
  const list = document.querySelectorAll(".collection-item");

  list.forEach((task) => {
    const item = task.firstChild.textContent.toLowerCase();

    if (item.includes(text)) {
      // task.style.display = "block"; // task.hidden = true
      task.style.display = "list-item";
    } else {
      task.style.display = "none";
    }
  });
};

// init
getTasks();

// Event listeners

// document.addEventListener("DOMContentLoaded", () => {
//   getTasks();
// });

form.addEventListener("submit", addTask);

taskList.addEventListener("click", removeTask);

taskList.addEventListener("click", editTask);

clearButton.addEventListener("click", clearTasks);

filterInput.addEventListener("input", filterTasks);
