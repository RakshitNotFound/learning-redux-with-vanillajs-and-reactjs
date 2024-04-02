// import { createStore } from "redux";
const element = (selector) => document.querySelector(selector); // common method to get html elements

const counterText = element("#counter");

const ACTIONS = {
  INCREMENT: "INCREMENT",
  DECREMENT: "DECREMENT",
  ADD_TODO: "ADD_TODO",
  REMOVE_TODO: "REMOVE_TODO"
};

const initialState = {
  counter: 0,
  todoList: []
};

//📌 Reducers: This method is called during store initialization and after each action is dispatched
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};

const todoReducer = (state = [], action) => {
  const { type, todo, id: todoId } = action;
  switch (type) {
    case "ADD_TODO":
      return [{ todo, id: Date.now() }, ...state];
    case "REMOVE_TODO":
      return state.filter(({ id }) => id !== todoId);
    default:
      return state;
  }
};

const combinedReducers = Redux.combineReducers({
  counter: counterReducer,
  todoList: todoReducer
});

//📌 Create Store
const store = Redux.createStore(combinedReducers);
counterText.innerText = `📌 ${store.getState()?.counter}`;

//📌 Subscribe to get all the state updates
const getStateUpdate = () => {
  const { counter, todoList } = store.getState();
  console.log("State after update:", { counter, todoList });
  counterText.innerText = `📌 ${counter}`;
  bindTodoList(todoList);
};
store.subscribe(getStateUpdate);

//📌 On Click of buttons, dispatch actions and update state
element("#inc").addEventListener("click", () =>
  store.dispatch({ type: ACTIONS.INCREMENT })
);

element("#dec").addEventListener("click", () =>
  store.dispatch({ type: ACTIONS.DECREMENT })
);

element("#todo-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const todo = element("#todo-text").value?.trim();
  e.target.reset();
  todo && store.dispatch({ type: ACTIONS.ADD_TODO, todo });
});

const removeTodo = (e) => {
  const id = parseInt(e.target.dataset.id);
  store.dispatch({ type: ACTIONS.REMOVE_TODO, id });
};

const bindTodoList = (todoList = []) => {
  const list = element("#todo-list");
  list.innerHTML = "";
  todoList.forEach(({ todo, id }) => {
    const li = document.createElement("li");
    li.textContent = todo;
    const button = document.createElement("button");
    button.dataset.id = id;
    button.addEventListener("click", removeTodo);
    button.textContent = "DEL";
    button.style.marginLeft = "10px";
    button.style.verticalAlign = "middle";
    li.appendChild(button);
    list.appendChild(li);
  });
};
