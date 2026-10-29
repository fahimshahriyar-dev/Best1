import { apiSlice } from "../api/apiSlice";

export const ebookApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // upload ebook
        createEbook: builder.mutation({
            query: (data) => ({
                url: "create-ebook",
                method: "POST",
                body: data,
                credentials: "include" as const
            }),
            invalidatesTags: ["Ebook"]
        }),

        // edit ebook
        editEbook: builder.mutation({
            query: ({ id, data }) => ({
                url: `edit-ebook/${id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const
            }),
            invalidatesTags: ["Ebook"]
        }),

        // get all ebooks admin
        getAllEbooksAdmin: builder.query({
            query: () => ({
                url: "get-admin-ebooks",
                method: "GET",
                credentials: "include" as const
            }),
            providesTags: ["Ebook"]
        }),

        // update ebook status
        updateEbookStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `update-ebook-status/${id}`,
                method: "PUT",
                body: { status },
                credentials: "include" as const
            }),
            invalidatesTags: ["Ebook"]
        }),

        // delete ebook
        deleteEbook: builder.mutation({
            query: (id) => ({
                url: `delete-ebook/${id}`,
                method: "DELETE",
                credentials: "include" as const
            }),
            invalidatesTags: ["Ebook"]
        }),

        // get all ebooks public
        getAllEbooks: builder.query({
            query: () => ({
                url: "get-ebooks",
                method: "GET",
                credentials: "include" as const
            }),
            providesTags: ["Ebook"]
        }),

        // get single ebook details public
        getEbookDetails: builder.query({
            query: (id) => ({
                url: `get-ebook/${id}`,
                method: "GET",
                credentials: "include" as const
            }),
            providesTags: ["Ebook"]
        }),

        // get purchased ebook content
        getEbookContent: builder.query({
            query: (id) => ({
                url: `get-ebook-content/${id}`,
                method: "GET",
                credentials: "include" as const
            }),
            providesTags: ["Ebook"]
        }),

        // add review
        addEbookReview: builder.mutation({
            query: ({ review, rating, ebookId }) => ({
                url: `add-ebook-review/${ebookId}`,
                method: "PUT",
                body: { review, rating },
                credentials: "include" as const
            }),
            invalidatesTags: ["Ebook"]
        }),

        // add review reply (admin)
        addEbookReviewReply: builder.mutation({
            query: ({ reviewId, ebookId, comment }) => ({
                url: "add-ebook-reply",
                method: "PUT",
                body: { reviewId, ebookId, comment },
                credentials: "include" as const
            }),
            invalidatesTags: ["Ebook"]
        }),
    })
});

export const {
    useCreateEbookMutation,
    useEditEbookMutation,
    useGetAllEbooksAdminQuery,
    useUpdateEbookStatusMutation,
    useDeleteEbookMutation,
    useGetAllEbooksQuery,
    useGetEbookDetailsQuery,
    useGetEbookContentQuery,
    useAddEbookReviewMutation,
    useAddEbookReviewReplyMutation
} = ebookApi;
