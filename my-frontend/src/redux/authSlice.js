import { createSlice } from "@reduxjs/toolkit";

const authSilce = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false
        }
    },
    reducers: {

        loginStart: (state) => {
            state.login.isFetching = true
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFail: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        }
    }
});
export const {
    loginStart,
    loginFail,
    loginSuccess
} = authSilce.actions;
export default authSilce.reducer;
