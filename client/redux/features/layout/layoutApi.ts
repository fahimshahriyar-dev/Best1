import { apiSlice } from "../api/apiSlice";

export const layoutApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Add courses
        getHeroData: builder.query({
            query: (type) => ({
                url: `getLayout/${type}`,
                method: "GET",
                credentials: "include" as const
            })
        }),

        // edit layout
        editLayout: builder.mutation({
            query: ({ type, image, title, subTitle, faq, categories }) => ({
                url: "editLayout",
                method: "PUT",
                body: { type, image, title, subTitle, faq, categories },
                credentials: "include" as const
            })
        }),
    })
})

export const { useGetHeroDataQuery, useEditLayoutMutation } = layoutApi;