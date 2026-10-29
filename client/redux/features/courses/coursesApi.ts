import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Add courses
        createCourse: builder.mutation({
            query: (data) => ({
                url: "createCourse",
                method: "POST",
                body: data,
                credentials: "include" as const
            }),
        }),

        // get all courses
        getAllCourses: builder.query({
            query: () => ({
                url: "getAllCourses-admin",
                method: "GET",
                credentials: "include" as const
            }),
        }),

        // delete course
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `deleteCourse/${id}`,
                method: "DELETE",
                credentials: "include" as const
            }),
        }),

        // edit course
        editCourse: builder.mutation({
            query: ({ id, data }) => ({
                url: `editCourse/${id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Course", id }],
        }),

        // get user all courses
        getUsersAllCourses: builder.query({
            query: () => ({
                url: 'getCourses',
                method: "GET",
                credentials: "include" as const
            }),
            providesTags: ["Courses"],
        }),

        // get course details
        getCourseDetails: builder.query({
            query: (id) => ({
                url: `getCourse/${id}`,
                method: "GET",
                credentials: "include" as const
            }),
            providesTags: (result, error, id) => [{ type: "Course", id }],
        }),

        // get course content
        getCourseContent: builder.query({
            query: (id) => ({
                url: `getCourseContent/${id}`,
                method: "GET",
                credentials: "include" as const
            }),
        }),

        // add question
        addNewQuestion: builder.mutation({
            query: ({ question, courseId, contentId }) => ({
                url: 'addQuestion',
                method: "PUT",
                body: { question, courseId, contentId },
                credentials: "include" as const
            }),
        }),

        // add answer
        addAnswer: builder.mutation({
            query: ({ answer, courseId, contentId, questionId }) => ({
                url: 'addAnswer',
                method: "PUT",
                body: { questionId, courseId, contentId, answer },
                credentials: "include" as const
            }),
        }),

        // add review
        addReview: builder.mutation({
            query: ({ review, rating, courseId }: any) => ({
                url: `addReview/${courseId}`,
                method: "PUT",
                body: { review, rating },
                credentials: "include" as const
            }),
            invalidatesTags: ["Courses"],
        }),

        // add reviewReply
        addReviewReply: builder.mutation({
            query: ({ reviewId, courseId, comment }: any) => ({
                url: 'addReviewReply',
                method: "PUT",
                body: { reviewId, courseId, comment },
                credentials: "include" as const
            }),
            invalidatesTags: ["Courses"],
        }),

        // edit question
        editQuestion: builder.mutation({
            query: ({ question, courseId, contentId, questionId }: any) => ({
                url: 'editQuestion',
                method: "PUT",
                body: { question, courseId, contentId, questionId },
                credentials: "include" as const
            }),
        }),

        // delete question
        deleteQuestion: builder.mutation({
            query: ({ courseId, contentId, questionId }: any) => ({
                url: `deleteQuestion/${courseId}/${contentId}/${questionId}`,
                method: "DELETE",
                credentials: "include" as const
            }),
        }),

        // edit answer
        editAnswer: builder.mutation({
            query: ({ answer, courseId, contentId, questionId, answerId }: any) => ({
                url: 'editAnswer',
                method: "PUT",
                body: { answer, courseId, contentId, questionId, answerId },
                credentials: "include" as const
            }),
        }),

        // delete answer
        deleteAnswer: builder.mutation({
            query: ({ courseId, contentId, questionId, answerId }: any) => ({
                url: `deleteAnswer/${courseId}/${contentId}/${questionId}/${answerId}`,
                method: "DELETE",
                credentials: "include" as const
            }),
        }),

        // update course status
        updateCourseStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `updateCourseStatus/${id}`,
                method: "PUT",
                body: { status },
                credentials: "include" as const
            }),
        }),

        // send course message
        sendCourseMessage: builder.mutation({
            query: ({ id, text, image, video, voice }) => ({
                url: `send-course-message/${id}`,
                method: "POST",
                body: { text, image, video, voice },
                credentials: "include" as const
            }),
        }),

        // delete course message
        deleteCourseMessage: builder.mutation({
            query: ({ id, messageId }) => ({
                url: `delete-course-message/${id}/${messageId}`,
                method: "DELETE",
                credentials: "include" as const
            }),
        }),

        // edit course message
        editCourseMessage: builder.mutation({
            query: ({ id, messageId, text }) => ({
                url: `edit-course-message/${id}/${messageId}`,
                method: "PUT",
                body: { text },
                credentials: "include" as const
            }),
        }),
    })
})

export const { useCreateCourseMutation, useGetAllCoursesQuery, useDeleteCourseMutation, useEditCourseMutation, useGetUsersAllCoursesQuery, useGetCourseDetailsQuery, useGetCourseContentQuery, useAddNewQuestionMutation, useAddAnswerMutation, useAddReviewMutation, useAddReviewReplyMutation, useEditQuestionMutation, useDeleteQuestionMutation, useEditAnswerMutation, useDeleteAnswerMutation, useUpdateCourseStatusMutation, useSendCourseMessageMutation, useDeleteCourseMessageMutation, useEditCourseMessageMutation } = courseApi;