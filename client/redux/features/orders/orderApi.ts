import { apiSlice } from "../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // get all orders
        getAllOrders: builder.query({
            query: (type) => ({
                url: "getOrders",
                method: "GET",
                credentials: "include" as const
            })
        }),

        // get stripe publishable key
        getStripePublishableKey: builder.query({
            query: () => ({
                url: "payment/stripe-publishablekey",
                method: "GET",
                credentials: "include" as const
            })
        }),

        // ccreate payment intent
        createPaymentIntent: builder.mutation({
            query: (amount) => ({
                url: "payment",
                method: "POST",
                body: { amount },
                credentials: "include" as const
            })
        }),

        // create order
        createOrder: builder.mutation({
            query: ({ courseId, ebookId, payment_info, enrollmentData }) => ({
                url: "createOrder",
                method: "POST",
                body: { courseId, ebookId, payment_info, enrollmentData },
                credentials: "include" as const
            })
        }),

    })
})

export const { useGetAllOrdersQuery, useGetStripePublishableKeyQuery, useCreatePaymentIntentMutation, useCreateOrderMutation } = orderApi;