import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    language: typeof window !== "undefined" && localStorage.getItem("language") ? localStorage.getItem("language") : "english",
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload;
            if (typeof window !== "undefined") {
                localStorage.setItem("language", action.payload);
            }
        },
    },
});

export const { setLanguage } = languageSlice.actions;

export default languageSlice.reducer;
