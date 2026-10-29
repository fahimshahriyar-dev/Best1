import { apiSlice } from "../api/apiSlice";

export const trainingApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createTraining: builder.mutation({
            query: (data) => ({
                url: "create-training",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),

        editTraining: builder.mutation({
            query: ({ id, data }) => ({
                url: `edit-training/${id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const,
            }),
        }),

        getAllTrainingsAdmin: builder.query({
            query: () => ({
                url: "getAllTrainings-admin",
                method: "GET",
                credentials: "include" as const,
            }),
        }),

        deleteTraining: builder.mutation({
            query: (id) => ({
                url: `delete-training/${id}`,
                method: "DELETE",
                credentials: "include" as const,
            }),
        }),

        updateTrainingStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `update-training-status/${id}`,
                method: "PUT",
                body: { status },
                credentials: "include" as const,
            }),
        }),

        getAllTrainings: builder.query({
            query: () => ({
                url: "getTrainings",
                method: "GET",
                credentials: "include" as const,
            }),
        }),

        getSingleTraining: builder.query({
            query: (id) => ({
                url: `getTraining/${id}`,
                method: "GET",
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {
    useCreateTrainingMutation,
    useEditTrainingMutation,
    useGetAllTrainingsAdminQuery,
    useDeleteTrainingMutation,
    useUpdateTrainingStatusMutation,
    useGetAllTrainingsQuery,
    useGetSingleTrainingQuery,
} = trainingApi;
