'use client'
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";
import languageSlice from "./features/language/languageSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSlice,
        language: languageSlice
    },
    devTools:false,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});

// call the load user
const initializeApp = async () => {
    // refresh token
    await store.dispatch(apiSlice.endpoints.refreshToken.initiate({}, {forceRefetch: true}));
    // load user (after refresh)
    await store.dispatch(apiSlice.endpoints.loadUser.initiate({}, {forceRefetch: true}));
};

initializeApp();