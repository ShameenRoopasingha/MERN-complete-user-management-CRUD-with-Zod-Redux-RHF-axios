import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../features/users/userApiSlice";
import { useReducer } from "react";
// import { userReducer } from "../features/users/userApiSlice";

//configure redux store
export const userStore = configureStore({
  reducer: {
    // connect RTKQ API in userApiSlice.ts to Redux Store
    [userApi.reducerPath]: userApi.reducer,

    // Add Local state to redux toolkit if it available
    // user: userReducer,
  },

  //Add RTKQ middleware to redux middleware
  //
  middleware: (getDefaultMiddelware) =>
    getDefaultMiddelware().concat(userApi.middleware),
});

//Export types of redux store
export type RootState = ReturnType<typeof userStore.getState>;
export type AppDispatch = typeof userStore.dispatch;
