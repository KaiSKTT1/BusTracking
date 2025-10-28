import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
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
        },
        logout: (state) => {
            state.login.currentUser = null;
            state.login.isFetching = false;
            state.login.error = false;
            localStorage.removeItem("accessToken"); // Xoá token nếu bạn có lưu
        }
    }
});
// export const {
//     loginStart,
//     loginFail,
//     loginSuccess
// } = authSilce.actions;
// export default authSilce.reducer;
export const { loginStart, loginFail, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;