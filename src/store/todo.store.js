import { Todo } from "../todo/models/todo.model";

export const Filters = {
    All: 'All',
    Completed: 'Completed',
    Pending: 'Pending'
}

const state = {
    todos: [
        new Todo('Soul stone'),
        new Todo('Infinite stone'),
        new Todo('Time stone'),
        new Todo('Power stone'),
        new Todo('Todo stone'),
    ],
    filter: Filters.All
}

const initStore = () => {
    loadStore();
}

const loadStore = () =>{
    if (!localStorage.getItem('state')) return;

    const {todos = [], filter = Filters.All} = JSON.parse(localStorage.getItem('state'));
    state.todos = todos;
    state.filter = filter;
}

const saveStateToLocalStorage = () =>{
    localStorage.setItem('state', JSON.stringify(state));
}

const addTodo = (description) =>{
    if (!description) throw new Error("Description is needed");
    
    state.todos.push(new Todo(description));

    saveStateToLocalStorage();
}

const toggleTodo = (todoId) => {
    state.todos = state.todos.map(todo => {
        if(todo.id === todoId){
            todo.done = !todo.done;
        }

        return todo;
    });

    saveStateToLocalStorage();
}

const deleteTodo = (todoId, allCompleted = false) => {
    if (allCompleted){
        state.todos = state.todos.filter(todo => todo.done === false);
        saveStateToLocalStorage();
        return true;
    }

    state.todos = state.todos.filter(todo => todo.id !== todoId);
    saveStateToLocalStorage();
}

const setFilter = (newFilter = Filters.All) =>{
    state.filter = newFilter;
}

const getFilter = () => {
    return state.filter;
}

const getTodos = (filter = Filters.All) =>{    
    switch(filter){
        case Filters.All:
            return [...state.todos];
        case Filters.Completed:
            return [...state.todos.filter( todo => todo.done === true )];
        case Filters.Pending:
            return [...state.todos.filter( todo => todo.done === false)];
        default:
            throw new Error(`Option ${filter} is not valid`);
    }
}

export default { 
    initStore,
    deleteTodo,
    getFilter,
    loadStore,
    setFilter,
    toggleTodo,
    getTodos,
    addTodo,
}