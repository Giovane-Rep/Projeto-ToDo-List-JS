// Seleção de Elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

// Variáveis globais
let oldInputValue;

// Funções
const saveTodo = (text, done = 0, save = 1) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn);

    // Utilizando dados da local storage
    if (done) {
        todo.classList.add("done");
    }

    if (save) {
        saveToDoLocalStorage({ text, done});
    }

    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();
};

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;

            updateToDoLocalStorage(oldInputValue, text);
        }
    });
};

const getSearchedTodos = (search) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        todo.style.display = "flex";

        if (!todoTitle.includes(search)) {
            todo.style.display = "none";
        }
    });
};

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    switch (filterValue) {
        case "all":
            todos.forEach((todo) => (todo.style.display = "flex"));

            break;

        case "done":
            todos.forEach((todo) =>
                todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none")
            );
            break;

        case "todo":
            todos.forEach((todo) =>
                !todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none")
            );
            break;

        default:
            break;
    }
};

//Eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo(inputValue);
    }
});

document.addEventListener("click", (e) => {
    const targetElement = e.target;
    const parentElement = targetElement.closest("div");
    let todoTitle; //Como não há um ID para o item a edição será baseada no Titulo do item

    if (parentElement && parentElement.querySelector("h3")) {
        todoTitle = parentElement.querySelector("h3").innerText;
    }

    if (targetElement.classList.contains("finish-todo")) {
        parentElement.classList.toggle("done");

        updateToDoStatusLocalStorage(todoTitle);
    }

    if (targetElement.classList.contains("edit-todo")) {
        toggleForms();
        editInput.value = todoTitle; //Se houvesse uma consulta no banco de dados poderia ser utilizada aqui 
        oldInputValue = todoTitle;
    }

    if (targetElement.classList.contains("remove-todo")) {
        parentElement.remove();

        removeTodosLocalStorage(todoTitle);
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForms();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if (editInputValue) {
        updateTodo(editInputValue);
    }

    toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;

    getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterTodos(filterValue);
});

// Local Storage
const getToDosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
};

const saveLocalStorage = (item) => {
    localStorage.setItem("todos", JSON.stringify(item)); 
};

const loadToDos = () => {
    const todos = getToDosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
    });
};

const saveToDoLocalStorage = (todo) => {
    // Pegar todos os ToDos da Local Storage
    const todos = getToDosLocalStorage();

    // Add o novo ToDo no array
    todos.push(todo);

    // Salvar tudo na Local Storage
    saveLocalStorage(todos);
};

const removeTodosLocalStorage = (todoText) => { // Se o objeto tiver um ID poderia ser usado como parâmetro
    const todos = getToDosLocalStorage();

    const filteredToDos = todos.filter((todo) => todo.text !== todoText);

    saveLocalStorage(filteredToDos);
};

const updateToDoStatusLocalStorage = (todoText) => {
    const todos = getToDosLocalStorage();

    todos.map((todo) => todo.text === todoText ? (todo.done = !todo.done) : null);

    saveLocalStorage(todos);
};

const updateToDoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getToDosLocalStorage();

    todos.map((todo) => todo.text === todoOldText ? (todo.text = todoNewText) : null);

    saveLocalStorage(todos);
};

loadToDos();