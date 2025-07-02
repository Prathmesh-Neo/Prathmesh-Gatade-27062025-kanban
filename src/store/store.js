import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./slices/taskSlice";
import { loadState, saveState } from "./taskDataToLocalstorage";
import userReducer from "./slices/userSlice";
import authReducer from './slices/authSlice'

const persistedState = loadState();

const store = configureStore({
    reducer: {
        tasks: taskReducer,
        users: userReducer,
        auth: authReducer,
    },
    preloadedState: {
        tasks: persistedState?.tasks || undefined,
    },
});


store.subscribe(() => {
    saveState({
        tasks: store.getState().tasks,
    });
});

export default store;
