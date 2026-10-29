import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // endPoints
        // update avatar
        updateAvatar: builder.mutation({
            query: (formData) => ({
                url: "updateProfilePic",
                method: "PUT",
                body: formData,
                credentials: "include" as const,
            }),
        }),

        // update user profile
        updateUserInfo: builder.mutation({
            query: (data) => ({
                url: "updateUserInfo",
                method: "PUT",
                body: data,
                credentials: "include" as const,
            }),
        }),

        // update password
        updatePassword: builder.mutation({
            query: ({ oldPassword, newPassword }) => ({
                url: "updatePassword",
                method: "PUT",
                body: { oldPassword, newPassword },
                credentials: "include" as const,
            }),
        }),

        // get all user
        getAllUser: builder.query({
            query: () => ({
                url: "getUsers",
                method: "GET",
                credentials: "include" as const,
            }),
        }),

        // update user role
        updateUserRole: builder.mutation({
            query: ({ email, role }) => ({
                url: `updateUserRole`,
                method: "PUT",
                credentials: "include",
                body: { email, role },
            }),
        }),

        // delete user
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `deleteUser/${id}`,
                method: "DELETE",
                credentials: "include" as const,
            }),
        }),
        getTeachers: builder.query({
            query: () => ({
                url: "getTeachers",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        submitSurvey: builder.mutation({
            query: (data) => ({
                url: "submit-survey",
                method: "PUT",
                body: data,
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {
    useUpdateAvatarMutation,
    useUpdateUserInfoMutation,
    useUpdatePasswordMutation,
    useGetAllUserQuery,
    useDeleteUserMutation,
    useUpdateUserRoleMutation,
    useSubmitSurveyMutation,
    useGetTeachersQuery,
} = userApi;
