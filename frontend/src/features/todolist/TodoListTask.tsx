import React, {Component} from "react";

import {store, updateTaskName, updateTaskStatus} from "../../app/store";
import {TodoTask} from "./TodoListSlice";

export interface TodoListTaskProps {
    task: TodoTask
}

export interface TodoListTaskState {
    name?: string,
}

class TodoListTask extends Component<TodoListTaskProps, TodoListTaskState> {
    constructor(props: TodoListTaskProps) {
        super(props);

        const {name} = this.props.task;

        this.state = {
            name,
        };
    }

    handleCheckBox() {
        const {task: {id, isCompleted}} = this.props;
        store.dispatch(updateTaskStatus(id, !isCompleted));
    }

    handleInputChange(event: React.ChangeEvent) {
        event.preventDefault();

        // @ts-ignore
        console.log(event, event.target, event.target.value);
        // @ts-ignore
        this.setState({name: event.target.value});
    }

    saveNewName() {
        const {name: newName} = this.state;
        const {task: {id: taskId}} = this.props;

        store.dispatch(updateTaskName(taskId, newName || ""));
    }

    handleInputKeyPress(event: React.KeyboardEvent) {
        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();
        this.saveNewName();
        // @ts-ignore
        event.target.blur();
    }

    render() {
        const {name} = this.state;
        const {task: {isCompleted}} = this.props;

        return <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // border: "1px solid black",
        }}>

            <input type="checkbox" checked={isCompleted} readOnly onChange={() => this.handleCheckBox()}/>

            <input
                type="text"
                value={name}
                onKeyPress={(e) => this.handleInputKeyPress(e)}
                onChange={(e) => this.handleInputChange(e)}
                onBlur={() => this.saveNewName()}
                style={{
                    border: "none",
                    borderBottom: "1px solid black",
                    padding: "1em",
                }}
            />
        </div>
    }
}

export default TodoListTask;