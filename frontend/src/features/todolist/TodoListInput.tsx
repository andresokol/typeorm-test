import React, {Component} from "react";
import {v4 as uuidv4} from "uuid";

import {createNewTask, store} from "../../app/store";

import styles from "./TodoList.module.css";

interface TodoListInputState {
    newName: string,
    idempotencyKey: string,
}

class TodoListInput extends Component<{}, TodoListInputState> {
    state: TodoListInputState = {
        newName: "",
        idempotencyKey: uuidv4(),
    }

    handleChange(event: React.ChangeEvent) {
        // @ts-ignore
        this.setState({newName: event.target.value})
    }

    handleInputKeyPress(event: React.KeyboardEvent) {
        if (event.key !== "Enter") {
            return;
        }

        const {newName, idempotencyKey} = this.state;
        if (!newName) {
            return;
        }

        store.dispatch(createNewTask(newName, idempotencyKey, () => this.setState({
            newName: "",
            idempotencyKey: uuidv4(),
        })));
    }

    render() {
        const {newName} = this.state;

        return <div className={styles.row_container}>
            <div className={styles.new_task_checkbox_offset} />
            <input
                onChange={(e) => this.handleChange(e)}
                onKeyPress={(e) => this.handleInputKeyPress(e)}
                className={styles.text_input + ' ' + styles.text_input__new_task}
                value={newName}
                placeholder={"New task..."}
            />
        </div>;
    }
}

export default TodoListInput;