import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
    tasks: {
        backlog: [],
        todo: [],
        inProgress: [],
        done: [],
    },
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: {
            reducer: (state, action) => {
                state.tasks.backlog.push(action.payload);
            },
            prepare: (title, description, priority, deadline) => ({
                payload: {
                    id: nanoid(),
                    title,
                    description,
                    priority,
                    deadline,
                },
            }),
        },
        moveTask: (state, action) => {
            const { sourceStage, destStage, sourceIndex, destIndex } = action.payload;
            const [movedTask] = state.tasks[sourceStage].splice(sourceIndex, 1);
            state.tasks[destStage].splice(destIndex, 0, movedTask);
        },
        deleteTask: (state, action) => {
            const { stage, index } = action.payload;
            state.tasks[stage].splice(index, 1);
        },
        editTask: (state, action) => {
            const { stage, index, updatedTask } = action.payload;
            const existingTask = state.tasks[stage][index];
            state.tasks[stage][index] = {
                ...existingTask,
                ...updatedTask,
                id: existingTask.id,
            };
        },
        moveTaskByArrow: (state, action) => {
            const { stage, index, direction } = action.payload;
            const stages = ["backlog", "todo", "inProgress", "done"];
            const currentStageIndex = stages.indexOf(stage);
            const newStageIndex = direction === "forward" ? currentStageIndex + 1 : currentStageIndex - 1;

            if (newStageIndex < 0 || newStageIndex >= stages.length) return;

            const task = state.tasks[stage][index];
            state.tasks[stage].splice(index, 1);
            state.tasks[stages[newStageIndex]].splice(0, 0, task);
        }


    },
});

export const { addTask, moveTask, deleteTask, editTask, moveTaskByArrow } = taskSlice.actions;
export default taskSlice.reducer;
