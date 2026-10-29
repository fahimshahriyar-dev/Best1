import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
    token: "",
    user: ""
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userRegistration: (state, action: PayloadAction<{token: string}>) => {
            state.token = action.payload.token;
        },
        userSignIn: (state, action: PayloadAction<{accessToken: string, user: string}>) => {
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
        },
        userSignOut: (state) => {
            state.token = "";
            state.user = "";
        },
    }
})

export const  { userRegistration, userSignIn, userSignOut } = authSlice.actions;

export default authSlice.reducer;