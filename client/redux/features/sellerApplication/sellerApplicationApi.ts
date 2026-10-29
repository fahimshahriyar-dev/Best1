import { apiSlice } from "../api/apiSlice";

export const sellerApplicationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Submit application (user)
        submitSellerApplication: builder.mutation({
            query: (data) => ({
                url: "apply-seller",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),

        // Get my application status (user)
        getMySellerApplicationStatus: builder.query({
            query: () => ({
                url: "my-seller-application",
                method: "GET",
                credentials: "include" as const,
            }),
        }),

        // Get all applications (admin)
        getAllSellerApplications: builder.query({
            query: () => ({
                url: "seller-applications",
                method: "GET",
                credentials: "include" as const,
            }),
        }),

        // Update application status (admin)
        updateSellerApplicationStatus: builder.mutation({
            query: ({ id, status, adminNote }) => ({
                url: `seller-application/${id}/status`,
                method: "PUT",
                body: { status, adminNote },
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {
    useSubmitSellerApplicationMutation,
    useGetMySellerApplicationStatusQuery,
    useGetAllSellerApplicationsQuery,
    useUpdateSellerApplicationStatusMutation,
} = sellerApplicationApi;
