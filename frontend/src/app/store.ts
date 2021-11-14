import {configureStore, ThunkAction, Action, AnyAction} from '@reduxjs/toolkit';
import todoListReducer, {TodoTask} from '../features/todolist/TodoListSlice';

export const store = configureStore({
    reducer: {
        // counter: counterReducer,
        todoList: todoListReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;


// ===

export const fetchTasksThunk = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    const response = await fetch("/tasks", {method: "GET"});
    const tasks: TodoTask[] = (await response.json()).tasks;

    dispatch({type: "todoList/updateTasks", payload: {tasks}});
}


export const updateTaskName = (taskId: string, newName: string): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    const response = await fetch("/task/update/name", {
        method: "POST",
        body: JSON.stringify({taskId, newName}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
    const data = await response.json();
    console.log(data);

    const task: TodoTask = data.task;
    dispatch({type: "todoList/updateSingleTask", payload: {task}});
};


export const updateTaskStatus = (taskId: string, isCompleted: boolean): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    const response = await fetch("/task/update/status", {
        method: "POST",
        body: JSON.stringify({taskId, isCompleted}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
    const data = await response.json();
    console.log(data);

    const task: TodoTask = data.task;
    dispatch({type: "todoList/updateSingleTask", payload: {task}});
};

export const createNewTask =
    (taskName: string, idempotencyKey: string, callback: (() => void)):
        ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
        const response = await fetch("/task", {
            method: "POST",
            body: JSON.stringify({taskName, idempotencyKey}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        console.log(data);

        const task: TodoTask = data.task;
        dispatch({type: "todoList/appendNewTask", payload: {task}});

        callback();
    };
