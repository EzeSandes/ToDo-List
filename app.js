/* DEFINES */

const NAME_LOCAL_STORAGE = "toDos";

/* SELECTORS */

const todoInput = document.querySelector(".todo__input--element");
const todoButton = document.querySelector(".todo__btn");
const todoList = document.querySelector(".todo-list");
const btnClearAll = document.querySelector(".btn--clear");

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
}

function addTodo(event) {
  event.preventDefault();

  if (!todoInput.value) return;

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
  todoList.innerHTML = "";
  reset();
}

function reset() {
  localStorage.removeItem(NAME_LOCAL_STORAGE);
  location.reload();
}

/* Only if I need an ID*/
// function createID() {
//   return "_" + Math.random().toString(36).substr(2, 9);
// }

/* EVENT LISTENERS */

getLocalStorage();
todoButton.addEventListener("click", addTodo);
btnClearAll.addEventListener("click", clearAll);
