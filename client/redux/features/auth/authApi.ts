import { apiSlice } from "../api/apiSlice";
import { userRegistration, userSignIn, userSignOut } from "./authSlice";

type registrationResponse = {
    message: string;
    activationToken: string;
};

type registrationData = {};

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // endPoints
        register: builder.mutation<registrationResponse, registrationData>({
            query: (data) => ({
                url: "registration",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userRegistration({ token: result.data.activationToken }));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        // activation
        activation: builder.mutation({
            query: ({ activation_token, activation_code}) => ({
                url: "activationMail",
                method: "POST",
                body: {
                    activation_token,
                    activation_code
                }
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userSignIn({ accessToken: result.data.accessToken, user: result.data.user }));
                } catch (error) {
                    console.log(error);
                }
            }
        }),

        // logIn
        logIn: builder.mutation({
            query: ({ email, password }) => ({
                url: "login",
                method: "POST",
                body: {
                    email,
                    password
                },
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userSignIn({ accessToken: result.data.accessToken, user: result.data.user }));
                } catch (error) {
                    console.log(error);
                }
            }
        }),

        // socialAuth
        socialAuth: builder.mutation({
            query: ({ email, name, avatar }) => ({
                url: "socialAuth",
                method: "POST",
                body: {
                    email,
                    name,
                    avatar
                },
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userSignIn({ accessToken: result.data.accessToken, user: result.data.user }));
                } catch (error) {
                    console.log(error);
                }
            }
        }),

        // signOut
        signOut: builder.query({
            query: () => ({
                url: "logout",
                method: "GET",
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}) {
                try {
                    await queryFulfilled;
                    dispatch(userSignOut());
                } catch (error) {
                    console.log(error);
                }
            }
        }),
    })
});

export const { useRegisterMutation, useActivationMutation, useLogInMutation, useSocialAuthMutation, useSignOutQuery } = authApi;