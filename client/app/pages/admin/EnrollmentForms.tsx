"use client";
import React, { FC, useEffect, useState } from "react";
import Loader from "@/app/components/Loader";
import { useGetAllOrdersQuery } from "@/redux/features/orders/orderApi";
import { useGetAllUserQuery } from "@/redux/features/user/userApi";
import { format } from "timeago.js";
import { MdAssignment, MdExpandMore, MdExpandLess } from "react-icons/md";
import AdminPageHeader from "@/app/components/AdminPageHeader";

type OrderWithDetails = {
    _id: string;
    userId: string;
    courseId: string;
    purchaseDate: string;
    userName?: string;
    userEmail?: string;
    type?: string;
    createdAt?: string;
    enrollmentData?: any;
};

const DetailRow: FC<{ label: string; value?: string }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-text-basic opacity-40 font-medium uppercase tracking-wide">{label}</span>
            <span className="text-sm text-text-basic">{value}</span>
        </div>
    );
};

const EnrollmentForms: FC = () => {
    const { isLoading, data: ordersData } = useGetAllOrdersQuery({}, { refetchOnMountOrArgChange: true });
    const { data: usersData } = useGetAllUserQuery({});
    const [orderData, setOrderData] = useState<OrderWithDetails[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        if (ordersData?.orders) {
            const filteredOrders = ordersData.orders.filter((item: any) => item.enrollmentData);
            const temp = filteredOrders.map((item: any) => {
                const user = usersData?.users?.find((u: any) => u._id === item.userId);
                return {
                    _id: item._id,
                    userId: item.userId,
                    courseId: item.courseId,
                    purchaseDate: item.purchaseDate,
                    userName: item.enrollmentData?.personalInfo?.fullName || user?.name || "Unknown",
                    userEmail: item.enrollmentData?.personalInfo?.email || user?.email || "N/A",
                    type: "Course",
                    createdAt: item.createdAt,
                    enrollmentData: item.enrollmentData
                };
            });
            // Sort by latest
            temp.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrderData(temp);
        }
    }, [ordersData, usersData]);

    if (isLoading) return <Loader />;

    return (
        <div className="w-full">
            <AdminPageHeader
                icon={<MdAssignment size={20} />}
                title="Enrollment Forms"
                subtitle={`${orderData.length} enrollment form${orderData.length !== 1 ? "s" : ""}`}
            />

            {orderData.length === 0 ? (
                <div className="text-center py-24 bg-background-Card_1 rounded-3xl border border-white/5">
                    <MdAssignment size={48} className="mx-auto mb-4 opacity-20 text-text-basic" />
                    <p className="text-lg text-text-basic opacity-40">No enrollment forms found.</p>
                </div>
            ) : (
                <div className="bg-background-Card_1 rounded-3xl border border-[#ffffff1a] shadow-xl overflow-hidden">
                    <div className="p-2 space-y-1">
                        {orderData.map((order) => {
                            const isExpanded = expandedId === order._id;
                            const data = order.enrollmentData;
                            return (
                                <div
                                    key={order._id}
                                    className={`transition-all duration-300 ${isExpanded ? "bg-white/5 rounded-2xl" : "hover:bg-white/[0.02]"}`}
                                >
                                    {/* Row Header */}
                                    <div
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 cursor-pointer gap-4"
                                        onClick={() => setExpandedId(isExpanded ? null : order._id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-hover-text-1/20 flex items-center justify-center text-hover-text-1 font-black text-lg">
                                                {order.userName?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-basic text-lg">{order.userName}</p>
                                                <p className="text-xs text-text-basic opacity-40">{order.userEmail}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 flex-wrap ml-16 sm:ml-0">
                                            <span className="text-xs text-text-basic opacity-40 font-medium">
                                                {format(order.createdAt!)}
                                            </span>
                                            <div className={`p-2 rounded-full transition-colors ${isExpanded ? "bg-hover-text-1 text-white dark:text-black shadow-lg shadow-hover-text-1/20" : "bg-black/5 dark:bg-white/15 text-gray-500 dark:text-white/60 hover:bg-hover-text-1/10 hover:text-hover-text-1"}`}>
                                                {isExpanded ? (
                                                    <MdExpandLess size={20} />
                                                ) : (
                                                    <MdExpandMore size={20} />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="border-t border-white/5 p-4 sm:p-8 space-y-6 sm:space-y-10 animate-fadeIn">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                                <DetailRow label="Phone" value={data.personalInfo.phone} />
                                                <DetailRow label="DOB" value={data.personalInfo.dob} />
                                                <DetailRow label="Gender" value={data.personalInfo.gender} />
                                                <DetailRow label="Country" value={data.location.country} />
                                                <DetailRow label="City / District" value={data.location.cityDistrict} />
                                                <DetailRow label="Postal Code" value={data.location.postalCode} />
                                                <DetailRow label="Education Level" value={data.education.currentLevel} />
                                                <DetailRow label="Institution" value={data.education.institutionName} />
                                                <DetailRow label="Taken Online Before" value={data.experience.takenOnlineCourseBefore} />
                                                <DetailRow label="Heard Via" value={data.experience.heardAboutClass} />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="bg-black/5 dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/5">
                                                    <p className="text-xs text-text-basic opacity-50 uppercase tracking-widest font-black mb-3">Learning Goal Statement</p>
                                                    <p className="text-sm leading-relaxed text-text-basic italic">"{data.experience.goal}"</p>
                                                </div>
                                                <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
                                                    <p className="text-xs text-red-500/60 uppercase tracking-widest font-black mb-3">Emergency Contact</p>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="opacity-40 block text-[10px]">Name</span>
                                                            <span className="font-bold">{data.emergencyContact.name || "N/A"}</span>
                                                        </div>
                                                        <div>
                                                            <span className="opacity-40 block text-[10px]">Relationship</span>
                                                            <span className="font-bold">{data.emergencyContact.relationship || "N/A"}</span>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className="opacity-40 block text-[10px]">Phone Number</span>
                                                            <span className="font-bold">{data.emergencyContact.number || "N/A"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnrollmentForms;
