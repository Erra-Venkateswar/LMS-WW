import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {isLoggedIn : false, userId : '', userName : '', role : '', email : '', userPhone : ''};

const loginSlice = createSlice({
    name : 'login',
    initialState : initialState,
    reducers : {
        setIsLogin : (state) => {
            state.isLoggedIn = !state.isLoggedIn;
        },
        setUserId : (state, action) => {
            state.userId =action.payload;
        },
        setProfileName : (state, action) => {
            state.userName = action.payload;
        },
        setRole : (state, action) => {
            state.role = action.payload;
        },
        setEmail : (state, action) => {
            state.email = action.payload;
        },
        setUserPhone : (state, action) => {
            state.userPhone = action.payload;
        }
    },
});

const store = configureStore({
    reducer : loginSlice.reducer
});

export const loginActions = loginSlice.actions;

export default store;