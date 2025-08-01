import { configureStore } from "@reduxjs/toolkit";
import { AppDispatch } from "./userStore";

export const itemStore = configureStore({
  reducer: {
    [itemApi.reducerPath]: isTemplateTail.reducer,
  },
  middleware: (getItemMiddleware) =>
    getItemMiddleware().concat(itemApi.middleware),
});

export type ItemState = ReturnType<typeof itemStore.getState>;
export type ItemDispatch = typeof itemStore.dispatch;
