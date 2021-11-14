import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface TodoTask {
    id: string,
    name: string,
    isCompleted: boolean,
    createdAt: string,
    modifiedAt: string,
}

export interface TodoListState {
    tasks: TodoTask[],
}

const initialState: TodoListState = {
    tasks: [],
};


export const todoListSlice = createSlice({
    name: 'todoList',
    initialState,
    reducers: {
        updateTasks: (state, action: PayloadAction<any>) => {
            state.tasks = action.payload.tasks;
        },
        updateSingleTask: (state, action: PayloadAction<any>) => {
            const newTask: TodoTask = action.payload.task;
            state.tasks = state.tasks.flatMap(task => task.id === newTask.id ? newTask : task);
        },
        appendNewTask: (state, action) => {
            const newTask: TodoTask = action.payload.task;

            state.tasks = [
                newTask,
                ...state.tasks,
            ];
        }
    },
});

export default todoListSlice.reducer;
