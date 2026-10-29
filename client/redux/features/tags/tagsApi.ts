import { apiSlice } from "../api/apiSlice";

export const tagsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllLearningGoalTags: builder.query({
            query: () => ({
                url: "get-learning-goal-tags",
                method: "GET",
                credentials: "include" as const
            })
        }),

        createLearningGoalTag: builder.mutation({
            query: ({ title }) => ({
                url: "create-learning-goal-tag",
                method: "POST",
                body: { title },
                credentials: "include" as const
            })
        }),

        updateLearningGoalTag: builder.mutation({
            query: ({ id, title }) => ({
                url: `update-learning-goal-tag/${id}`,
                method: "PUT",
                body: { title },
                credentials: "include" as const
            })
        }),

        deleteLearningGoalTag: builder.mutation({
            query: (id) => ({
                url: `delete-learning-goal-tag/${id}`,
                method: "DELETE",
                credentials: "include" as const
            })
        }),

        getAllCourseTags: builder.query({
            query: () => ({
                url: "get-course-tags",
                method: "GET",
                credentials: "include" as const
            })
        }),

        createCourseTag: builder.mutation({
            query: ({ title }) => ({
                url: "create-course-tag",
                method: "POST",
                body: { title },
                credentials: "include" as const
            })
        }),

        updateCourseTag: builder.mutation({
            query: ({ id, title }) => ({
                url: `update-course-tag/${id}`,
                method: "PUT",
                body: { title },
                credentials: "include" as const
            })
        }),

        deleteCourseTag: builder.mutation({
            query: (id) => ({
                url: `delete-course-tag/${id}`,
                method: "DELETE",
                credentials: "include" as const
            })
        }),

        getAllEbookTags: builder.query({
            query: () => ({
                url: "get-ebook-tags",
                method: "GET",
                credentials: "include" as const
            })
        }),

        createEbookTag: builder.mutation({
            query: ({ title }) => ({
                url: "create-ebook-tag",
                method: "POST",
                body: { title },
                credentials: "include" as const
            })
        }),

        updateEbookTag: builder.mutation({
            query: ({ id, title }) => ({
                url: `update-ebook-tag/${id}`,
                method: "PUT",
                body: { title },
                credentials: "include" as const
            })
        }),

        deleteEbookTag: builder.mutation({
            query: (id) => ({
                url: `delete-ebook-tag/${id}`,
                method: "DELETE",
                credentials: "include" as const
            })
        }),
    })
})

export const {
    useGetAllLearningGoalTagsQuery,
    useCreateLearningGoalTagMutation,
    useUpdateLearningGoalTagMutation,
    useDeleteLearningGoalTagMutation,
    useGetAllCourseTagsQuery,
    useCreateCourseTagMutation,
    useUpdateCourseTagMutation,
    useDeleteCourseTagMutation,
    useGetAllEbookTagsQuery,
    useCreateEbookTagMutation,
    useUpdateEbookTagMutation,
    useDeleteEbookTagMutation,
} = tagsApi;
