import React, {Component} from "react";

import styles from './TodoList.module.css';

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

        let textInputClassName = styles.text_input;
        if (isCompleted) {
            textInputClassName += " " + styles.text_input__completed;
        }

        return <div className={styles.row_container}>
            <div className={styles.checkbox_wrapper}>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isCompleted}
                    readOnly
                    onChange={() => this.handleCheckBox()}
                />
            </div>

            <input
                type="text"
                className={textInputClassName}
                value={name}
                onKeyPress={(e) => this.handleInputKeyPress(e)}
                onChange={(e) => this.handleInputChange(e)}
                onBlur={() => this.saveNewName()}
            />
        </div>
    }
}

export default TodoListTask;