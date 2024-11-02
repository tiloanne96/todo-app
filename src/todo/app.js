import html from './app.html?raw';
import todoStore,{ Filters } from '../store/todo.store';
import { renderTodos, renderPending } from './use-cases';

const ElementIds = {
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    DeleteDoneTodos: '.clear-completed',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
}

export const App = (elementId) => {
    const displayTodos = () =>{
        const todos = todoStore.getTodos(todoStore.getFilter());
        renderTodos(ElementIds.TodoList, todos);
        displayPendingCount();
    }

    const displayPendingCount = () =>{
        renderPending(ElementIds.PendingCountLabel);
    }

    (() =>{
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();

    const newDescriptionInput = document.querySelector(ElementIds.NewTodoInput);
    const todoListUL = document.querySelector(ElementIds.TodoList);
    const btnDeleteDoneTodos = document.querySelector(ElementIds.DeleteDoneTodos);
    const filtersLis = document.querySelectorAll(ElementIds.TodoFilters);

    newDescriptionInput.addEventListener('keyup',(event) =>{
        if(event.keyCode !== 13) return;
        if(event.target.value.trim().length === 0) return;

        todoStore.addTodo(event.target.value);
        displayTodos();
        event.target.value = '';
    });

    todoListUL.addEventListener('click', (event) =>{
        if(event.target.className !== 'toggle') return;
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));

        displayTodos();
    });

    todoListUL.addEventListener('click', (event) =>{
        if(event.target.className !== 'destroy') return;

        const element = event.target.closest('[data-id]');
        todoStore.deleteTodo(element.getAttribute('data-id'));

        displayTodos();
    });

    btnDeleteDoneTodos.addEventListener('click', () => {
        todoStore.deleteTodo(null, true);

        displayTodos();
    });

    filtersLis.forEach(element => {
        element.addEventListener('click', (element) =>{
            filtersLis.forEach(item => item.classList.remove('selected'));
            element.target.classList.add('selected');

            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter(Filters.All);
                    break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending);
                    break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed);
                    break;
            }

            displayTodos();
        });
    });
}