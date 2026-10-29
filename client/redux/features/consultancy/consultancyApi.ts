import { apiSlice } from "../api/apiSlice";

export const consultancyApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        submitConsultancy: builder.mutation({
            query: (data) => ({
                url: "apply-consultancy",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),

        getMyConsultancyStatus: builder.query({
            query: () => ({
                url: "my-consultancy",
                method: "GET",
                credentials: "include" as const,
            }),
        }),

        getAllConsultancies: builder.query({
            query: () => ({
                url: "consultancies",
                method: "GET",
                credentials: "include" as const,
            }),
        }),

        toggleConsultancyReview: builder.mutation({
            query: (id) => ({
                url: `consultancy/${id}/toggle-review`,
                method: "PUT",
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {
    useSubmitConsultancyMutation,
    useGetMyConsultancyStatusQuery,
    useGetAllConsultanciesQuery,
    useToggleConsultancyReviewMutation,
} = consultancyApi;
