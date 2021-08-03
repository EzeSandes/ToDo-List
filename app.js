/* DEFINES */

const NAME_LOCAL_STORAGE = "toDos";

/* SELECTORS */

const todoInput = document.querySelector(".todo__input--element");
const todoButton = document.querySelector(".todo__btn");
const todoList = document.querySelector(".todo-list");
const btnClearAll = document.querySelector(".btn--clear");
const filterOption = document.getElementById("filter-todo");

/* GLOBAL VARIABLES */

let tasks = [];

/* FUNCTIONS*/

function setLocalStorage(todo) {
  localStorage.setItem(NAME_LOCAL_STORAGE, JSON.stringify(todo));
}

function getLocalStorage() {
  const data = JSON.parse(localStorage.getItem(NAME_LOCAL_STORAGE));
  if (!data) return;

  tasks = data;
  tasks.forEach((toDo) => renderToDo(toDo));
}

function renderToDo(toDo) {
  const markup = `<div class="todo__item">
  <div class="todo__item--text">
    <li class="todo-item--task">${toDo.task}</li>
    <span class="list-date">${toDo.date.month + 1}/${toDo.date.day}/${
    toDo.date.year
  } | ${toDo.date.hour}:${toDo.date.minute} ${
    toDo.date.hour > 0 && toDo.date.hour < 12 ? `AM` : `PM`
  }</span>
  </div>
  <button class="btn btn--check">
    <i class="fas fa-check fa-3x"></i>
  </button>
  <button class="btn btn--trash">
    <i class="fas fa-trash-alt fa-3x"></i>
  </button>
  </div>`;

  todoList.insertAdjacentHTML("afterbegin", markup);

  // Add event Listeners to the elements
  const btnRemoveTodo = document.querySelector(".btn--trash");
  btnRemoveTodo.addEventListener("click", removeTodo);

  const btnCompleted = document.querySelector(".btn--check");
  btnCompleted.addEventListener("click", completeTodo);

  // Add 'Completed' class to the completed todo.
  if (toDo.completed)
    document.querySelector(".todo__item").classList.add("completed");
}

function addTodo(event) {
  event.preventDefault();

  //  removes whitespace from both ends of a string
  if (!todoInput.value.trim()) return;

  const date = new Date();

  let todoTask = {
    task: todoInput.value,
    completed: false,
    date: {
      hour: date.getHours(),
      minute: date.getMinutes(),
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
    },
  };

  renderToDo(todoTask);
  tasks.push(todoTask);

  //Save to local Storage
  setLocalStorage(tasks);
  //Clear Input
  todoInput.value = "";
}

function completeTodo(event) {
  const todo = getToDo(event.target);
  completeLocalTodo(todo);

  event.target.closest(".todo__item").classList.add("completed");
}

function completeLocalTodo(toDo) {
  let todos;

  if (!localStorage.getItem(NAME_LOCAL_STORAGE)) todos = [];
  else todos = JSON.parse(localStorage.getItem(NAME_LOCAL_STORAGE));

  let index = todos.findIndex((elem) => elem.task === toDo);

  todos[index].completed = true;
  setLocalStorage(todos);
}

function removeTodo(event) {
  const todo = getToDo(event.target);

  removeLocalTodo(todo); // Removed from local Storage
  event.target.closest(".todo__item").remove(); // Removed from the document.
}

function removeLocalTodo(toDo) {
  let todos;

  if (!localStorage.getItem(NAME_LOCAL_STORAGE)) todos = [];
  else todos = JSON.parse(localStorage.getItem(NAME_LOCAL_STORAGE));

  let index = todos.findIndex((elem) => elem.task === toDo);

  todos.splice(index, 1);
  setLocalStorage(todos);
}

function getToDo(elem) {
  return elem.closest(".todo__item").querySelector(".todo-item--task")
    .textContent;
}

function clearAll() {
  if (confirm("Are you sure to remove ALL the items?")) {
    todoList.innerHTML = "";
    reset();
  }
}

function reset() {
  localStorage.removeItem(NAME_LOCAL_STORAGE);
  location.reload();
}

function filterTodo(event) {
  const todos = todoList.children;

  Array.from(todos).forEach((elem) => {
    switch (event.currentTarget.value) {
      case "all":
        elem.style.display = "flex";
        break;
      case "completed":
        if (elem.classList.contains("completed")) elem.style.display = "flex";
        else elem.style.display = "none";
        break;
      case "uncompleted":
        if (!elem.classList.contains("completed")) elem.style.display = "flex";
        else elem.style.display = "none";
        break;
    }
  });
}

/* EVENT LISTENERS */

getLocalStorage();
todoButton.addEventListener("click", addTodo);
btnClearAll.addEventListener("click", clearAll);
filterOption.addEventListener("click", filterTodo);
