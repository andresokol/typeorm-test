import React, {Component} from "react";
import {v4 as uuidv4} from "uuid";
import {createNewTask, store} from "../../app/store";

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
        store.dispatch(createNewTask(newName, idempotencyKey, () => this.setState({
            newName: "",
            idempotencyKey: uuidv4(),
        })));
    }

    render() {
        const {newName} = this.state;

        return <div>
            <input
                onChange={(e) => this.handleChange(e)}
                onKeyPress={(e) => this.handleInputKeyPress(e)}
                value={newName}
            />
        </div>;
    }
}

export default TodoListInput;