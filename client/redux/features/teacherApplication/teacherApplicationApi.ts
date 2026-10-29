import { apiSlice } from "../api/apiSlice";

export const teacherApplicationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Submit application (user)
        submitTeacherApplication: builder.mutation({
            query: (data) => ({
                url: "apply-teacher",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),

        // Get my application status (user)
        getMyApplicationStatus: builder.query({
            query: () => ({
                url: "my-teacher-application",
                method: "GET",
                credentials: "include" as const,
            }),
        }),

        // Get all applications (admin)
        getAllTeacherApplications: builder.query({
            query: () => ({
                url: "teacher-applications",
                method: "GET",
                credentials: "include" as const,
            }),
        }),

        // Update application status (admin)
        updateApplicationStatus: builder.mutation({
            query: ({ id, status, adminNote }) => ({
                url: `teacher-application/${id}/status`,
                method: "PUT",
                body: { status, adminNote },
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {
    useSubmitTeacherApplicationMutation,
    useGetMyApplicationStatusQuery,
    useGetAllTeacherApplicationsQuery,
    useUpdateApplicationStatusMutation,
} = teacherApplicationApi;
