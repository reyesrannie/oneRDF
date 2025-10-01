import { configureStore } from "@reduxjs/toolkit";
import { serverAPI } from "./request/serverAPI";
import { systemAPI } from "./request/systemAPI";
import themeSlice from "./slice/themeSlice";
import authSlice from "./slice/authSlice";
import drawerSlice from "./slice/drawerSlice";
import renderSlice from "./slice/renderSlice";
import filterSlice from "./slice/filterSlice";
import modalSlice from "./slice/modalSlice";
import systemSlice from "./slice/systemSlice";
import promptSlice from "./slice/promptSlice";
import syncSlice from "./slice/syncSlice";

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
    drawer: drawerSlice,
    render: renderSlice,
    filter: filterSlice,
    modal: modalSlice,
    system: systemSlice,
    prompt: promptSlice,
    sync: syncSlice,

    [serverAPI.reducerPath]: serverAPI.reducer,
    [systemAPI.reducerPath]: systemAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([serverAPI.middleware, systemAPI.middleware]),
});
