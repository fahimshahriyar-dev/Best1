import { apiSlice } from "../api/apiSlice";

export const companyApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Add company (admin only)
        addCompany: builder.mutation({
            query: ({ name, logo, website }) => ({
                url: "add-company",
                method: "POST",
                body: { name, logo, website },
                credentials: "include" as const,
            }),
            invalidatesTags: ["Company"],
        }),

        // Get all companies (public)
        getAllCompanies: builder.query({
            query: () => ({
                url: "get-companies",
                method: "GET",
            }),
            providesTags: ["Company"],
        }),

        // Delete company (admin only)
        deleteCompany: builder.mutation({
            query: (id: string) => ({
                url: `delete-company/${id}`,
                method: "DELETE",
                credentials: "include" as const,
            }),
            invalidatesTags: ["Company"],
        }),
    }),
});

export const {
    useAddCompanyMutation,
    useGetAllCompaniesQuery,
    useDeleteCompanyMutation,
} = companyApi;
