import React from 'react';
// import logo from './logo.svg';
// import {Counter} from './features/counter/Counter';
// import './App.css';
import TodoList from "./features/todolist/TodoList";

function App() {
    return (
        <div className="App">
            <h1>To Do list</h1>
            <TodoList/>
        </div>
    );
}

export default App;
