import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // get course analytics
        getCourseAnalytics: builder.query({
            query: () => ({
                url: "getCourseAnalytics",
                method: "GET",
                credentials: 'include' as const
            })
        }),

        // get order analytics
        getUserAnalytics: builder.query({
            query: () => ({
                url: "getUserAnalytics",
                method: "GET",
                credentials: 'include' as const
            })
        }),

        // get order analytics
        getOrderAnalytics: builder.query({
            query: () => ({
                url: "getOrderAnalytics",
                method: "GET",
                credentials: 'include' as const
            })
        }),
    })
})

export const { useGetCourseAnalyticsQuery, useGetUserAnalyticsQuery, useGetOrderAnalyticsQuery } = analyticsApi;