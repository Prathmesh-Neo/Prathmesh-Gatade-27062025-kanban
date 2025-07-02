import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    registeredUsers: JSON.parse(localStorage.getItem('registeredUsers')) || [],
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        registerUser: (state, action) => {
            state.registeredUsers.push(action.payload);
            localStorage.setItem('registeredUsers', JSON.stringify(state.registeredUsers));
        },
    },
});

export const { registerUser } = userSlice.actions;
export default userSlice.reducer;
