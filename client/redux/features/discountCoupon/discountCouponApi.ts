import { apiSlice } from "../api/apiSlice";

export const discountCouponApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllDiscountCoupons: builder.query({
            query: () => ({
                url: "get-discount-coupons",
                method: "GET",
                credentials: "include" as const
            })
        }),

        createDiscountCoupon: builder.mutation({
            query: ({ code, discountPercent, expiryDate }) => ({
                url: "create-discount-coupon",
                method: "POST",
                body: { code, discountPercent, expiryDate },
                credentials: "include" as const
            })
        }),

        updateDiscountCoupon: builder.mutation({
            query: ({ id, code, discountPercent, expiryDate, isActive }) => ({
                url: `update-discount-coupon/${id}`,
                method: "PUT",
                body: { code, discountPercent, expiryDate, isActive },
                credentials: "include" as const
            })
        }),

        deleteDiscountCoupon: builder.mutation({
            query: (id) => ({
                url: `delete-discount-coupon/${id}`,
                method: "DELETE",
                credentials: "include" as const
            })
        }),
    })
})

export const {
    useGetAllDiscountCouponsQuery,
    useCreateDiscountCouponMutation,
    useUpdateDiscountCouponMutation,
    useDeleteDiscountCouponMutation,
} = discountCouponApi;
