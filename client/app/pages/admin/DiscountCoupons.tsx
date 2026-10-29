"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { MdDelete, MdEdit } from "react-icons/md";
import Loader from "@/app/components/Loader";
import {
    useGetAllDiscountCouponsQuery,
    useCreateDiscountCouponMutation,
    useUpdateDiscountCouponMutation,
    useDeleteDiscountCouponMutation,
} from "@/redux/features/discountCoupon/discountCouponApi";

type Props = {};

const DiscountCoupons = (props: Props) => {
    const { data, isLoading, refetch } = useGetAllDiscountCouponsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [createCoupon, { isSuccess: createSuccess, error: createError }] = useCreateDiscountCouponMutation();
    const [updateCoupon, { isSuccess: updateSuccess, error: updateError }] = useUpdateDiscountCouponMutation();
    const [deleteCoupon, { isSuccess: deleteSuccess, error: deleteError }] = useDeleteDiscountCouponMutation();

    const [coupons, setCoupons] = useState<any[]>([]);
    const [filter, setFilter] = useState<"all" | "active" | "expired">("all");
    const [newCode, setNewCode] = useState("");
    const [newPercent, setNewPercent] = useState("");
    const [newExpiryDays, setNewExpiryDays] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editCode, setEditCode] = useState("");
    const [editPercent, setEditPercent] = useState("");
    const [editExpiryDays, setEditExpiryDays] = useState("");

    useEffect(() => {
        if (data?.coupons) {
            setCoupons(data.coupons);
        }
    }, [data]);

    useEffect(() => {
        if (createSuccess) {
            toast.success("Coupon created successfully!");
            setNewCode("");
            setNewPercent("");
            setNewExpiryDays("");
            refetch();
        }
        if (updateSuccess) {
            toast.success("Coupon updated successfully!");
            setEditingId(null);
            refetch();
        }
        if (deleteSuccess) {
            toast.success("Coupon deleted successfully!");
            refetch();
        }
    }, [createSuccess, updateSuccess, deleteSuccess]);

    useEffect(() => {
        const err = createError || updateError || deleteError;
        if (err) {
            if ("data" in err) {
                const errorData = err as any;
                toast.error(errorData?.data?.message || "Something went wrong");
            }
        }
    }, [createError, updateError, deleteError]);

    const handleCreate = async () => {
        if (!newCode.trim() || !newPercent) {
            toast.error("All fields are required.");
            return;
        }
        await createCoupon({ code: newCode.trim(), discountPercent: Number(newPercent), expiryDays: newExpiryDays ? Number(newExpiryDays) : undefined });
    };

    const handleUpdate = async (id: string) => {
        if (!editCode.trim() || !editPercent) {
            toast.error("All fields are required.");
            return;
        }
        await updateCoupon({ id, code: editCode.trim(), discountPercent: Number(editPercent), expiryDays: editExpiryDays ? Number(editExpiryDays) : undefined });
    };

    const handleDelete = async (id: string) => {
        await deleteCoupon(id);
    };

    const isExpired = (coupon: any) => {
        if (!coupon.expiryDate) return false;
        return new Date(coupon.expiryDate) < new Date();
    };

    const filteredCoupons = coupons.filter((c: any) => {
        if (filter === "active") return !isExpired(c) && c.isActive;
        if (filter === "expired") return isExpired(c) || !c.isActive;
        return true;
    });

    const startEditing = (coupon: any) => {
        setEditingId(coupon._id);
        setEditCode(coupon.code);
        setEditPercent(coupon.discountPercent);
        setEditExpiryDays("");
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditCode("");
        setEditPercent("");
        setEditExpiryDays("");
    };

    return (
        <div className="w-full">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-background-Card_1 p-5 rounded-xl border border-text-basic/10 shadow-sm">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-text-basic tracking-tight">
                                Discount Coupons
                            </h1>
                            <p className="text-xs sm:text-sm opacity-60 mt-0.5">
                                Create and manage discount coupons for courses
                            </p>
                        </div>
                    </div>

                    {/* Add Coupon Form */}
                    <div className="bg-background-Card_1 p-5 rounded-xl border border-text-basic/10 shadow-sm mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <input
                                placeholder="Coupon code (e.g. SAVE20)"
                                value={newCode}
                                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                                className="bg-background-bar_2/40 dark:bg-white/5 border border-text-basic/10 rounded-lg px-3.5 py-2.5 text-sm text-text-basic outline-none focus:border-blue-500 placeholder:opacity-40"
                            />
                            <input
                                type="number"
                                placeholder="Discount %"
                                value={newPercent}
                                onChange={(e) => setNewPercent(e.target.value)}
                                className="bg-background-bar_2/40 dark:bg-white/5 border border-text-basic/10 rounded-lg px-3.5 py-2.5 text-sm text-text-basic outline-none focus:border-blue-500 placeholder:opacity-40"
                            />
                            <input
                                type="number"
                                placeholder="Expires in (days)"
                                value={newExpiryDays}
                                onChange={(e) => setNewExpiryDays(e.target.value)}
                                className="bg-background-bar_2/40 dark:bg-white/5 border border-text-basic/10 rounded-lg px-3.5 py-2.5 text-sm text-text-basic outline-none focus:border-blue-500 placeholder:opacity-40"
                            />
                            <button
                                onClick={handleCreate}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm flex items-center gap-2 active:scale-95 justify-center"
                            >
                                <HiMiniPlusCircle size={18} />
                                Add Coupon
                            </button>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2 mb-4">
                        {(["all", "active", "expired"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                    filter === f
                                        ? "bg-hover-text-1 text-white dark:text-black border-hover-text-1"
                                        : "text-text-basic border-text-basic/10 hover:border-text-basic/30 bg-background-Card_1"
                                }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                <span className="ml-1 opacity-60">
                                    ({f === "all" ? coupons.length : f === "active" ? coupons.filter((c: any) => !isExpired(c) && c.isActive).length : coupons.filter((c: any) => isExpired(c) || !c.isActive).length})
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Coupons List */}
                    <div className="space-y-3">
                        {filteredCoupons.map((coupon: any) => {
                            const expired = isExpired(coupon);
                            return (
                            <div
                                key={coupon._id}
                                className={`bg-background-Card_1 p-4 sm:p-5 rounded-xl border shadow-sm transition-all duration-200 group ${expired ? "border-red-500/20 opacity-70" : "border-text-basic/10 hover:border-text-basic/25"}`}
                            >
                                {editingId === coupon._id ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                                        <input
                                            value={editCode}
                                            onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                                            className="bg-background-bar_2/40 dark:bg-white/5 border border-text-basic/10 rounded-lg px-3 py-2 text-sm text-text-basic outline-none focus:border-blue-500"
                                            autoFocus
                                        />
                                        <input
                                            type="number"
                                            value={editPercent}
                                            onChange={(e) => setEditPercent(e.target.value)}
                                            className="bg-background-bar_2/40 dark:bg-white/5 border border-text-basic/10 rounded-lg px-3 py-2 text-sm text-text-basic outline-none focus:border-blue-500"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Reset expiry (days)"
                                            value={editExpiryDays}
                                            onChange={(e) => setEditExpiryDays(e.target.value)}
                                            className="bg-background-bar_2/40 dark:bg-white/5 border border-text-basic/10 rounded-lg px-3 py-2 text-sm text-text-basic outline-none focus:border-blue-500 placeholder:opacity-40"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdate(coupon._id)}
                                                className="flex-1 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all text-xs font-semibold"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="flex-1 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 text-text-basic hover:bg-black/10 dark:hover:bg-white/10 transition-all text-xs font-medium"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                                            <div>
                                                <p className="text-[11px] opacity-40 uppercase tracking-wider mb-0.5">Code</p>
                                                <p className="text-base font-bold text-text-basic font-mono">{coupon.code}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] opacity-40 uppercase tracking-wider mb-0.5">Discount</p>
                                                <p className="text-base font-bold text-green-500">{coupon.discountPercent}%</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] opacity-40 uppercase tracking-wider mb-0.5">Expiry Date</p>
                                                <p className={`text-xs sm:text-sm font-medium ${expired ? "text-red-400" : "text-text-basic"}`}>
                                                    {coupon.expiryDate
                                                        ? new Date(coupon.expiryDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                                                        : "No expiry"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            {expired && (
                                                <span className="px-2 py-0.5 text-[11px] rounded bg-red-500/10 text-red-500 font-semibold">
                                                    Expired
                                                </span>
                                            )}
                                            {!coupon.isActive && !expired && (
                                                <span className="px-2 py-0.5 text-[11px] rounded bg-yellow-500/10 text-yellow-500 font-semibold">
                                                    Inactive
                                                </span>
                                            )}
                                            <button
                                                onClick={() => startEditing(coupon)}
                                                className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                                                title="Edit"
                                            >
                                                <MdEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(coupon._id)}
                                                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                title="Delete"
                                            >
                                                <MdDelete size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            );
                        })}
                    </div>

                    {coupons.length === 0 && (
                        <div className="text-center py-16 bg-background-Card_1 rounded-xl border border-dashed border-text-basic/20">
                            <p className="text-sm opacity-50 italic">No coupons yet. Add your first coupon above.</p>
                        </div>
                    )}
                    {coupons.length > 0 && filteredCoupons.length === 0 && (
                        <div className="text-center py-16 bg-background-Card_1 rounded-xl border border-dashed border-text-basic/20">
                            <p className="text-sm opacity-50 italic">No {filter} coupons found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DiscountCoupons;
