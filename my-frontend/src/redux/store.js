import { configureStore } from "@reduxjs/toolkit";
import authReduce from "./authSlice";

export default configureStore({
    reducer: {
        auth: authReduce

    },
});