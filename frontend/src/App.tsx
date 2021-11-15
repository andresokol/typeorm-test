import React from 'react';

import './App.css';

import TodoList from "./features/todolist/TodoList";

function App() {
    return (
        <div>
            <h1 style={{textAlign: "center", fontSize: "3em", marginTop: "1em"}}>To Do list</h1>
            <TodoList/>
        </div>
    );
}

export default App;
