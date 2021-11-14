import React, {Component} from "react";
import {connect, ConnectedProps} from "react-redux";

import TodoListTask from "./TodoListTask";
import {store, fetchTasksThunk} from "../../app/store";
import {TodoTask} from "./TodoListSlice";
import TodoListInput from "./TodoListInput";


const mapStateToProps = (state: any) => ({
    tasks: state.todoList.tasks,
});
const connector = connect(mapStateToProps);


class TodoList extends Component<ConnectedProps<typeof connector>, never> {
    componentDidMount() {
        store.dispatch(fetchTasksThunk());
    }

    render() {
        const {tasks} = this.props;

        if (!tasks) {
            return <></>;
        }

        return <div>
            <TodoListInput/>
            <div>
                {tasks.flatMap(((value: TodoTask) => <TodoListTask key={value.id} task={value}/>))}
            </div>
        </div>;
    }
}


export default connector(TodoList);
