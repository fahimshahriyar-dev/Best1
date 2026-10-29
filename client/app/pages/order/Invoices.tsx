import React, { FC, useEffect, useState, useMemo } from "react";
import Loader from "@/app/components/Loader";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetAllEbooksQuery } from "@/redux/features/ebook/ebookApi";
import { useGetAllOrdersQuery } from "@/redux/features/orders/orderApi";
import { useGetAllUserQuery } from "@/redux/features/user/userApi";
import { IoMdMail } from "react-icons/io";
import { format } from "timeago.js";
import DataTableBox from "../../components/DataTableBox";
import toast from "react-hot-toast";
import { AiOutlineEye } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import AnimatedPopup from "../../components/AnimatedPopup";
import { HiOutlineUser, HiOutlineLocationMarker, HiOutlineAcademicCap, HiOutlineLightBulb, HiOutlinePhone } from "react-icons/hi";
import AdminPageHeader from "../../components/AdminPageHeader";
import { CgNotes } from "react-icons/cg";

type OrderWithDetails = {
    _id: string;
    userId: string;
    courseId: string;
    purchaseDate: string;
    userName?: string;
    userEmail?: string;
    type?: string;
    price?: string;
    createdAt?: string;
    enrollmentData?: any;
};

interface Column {
    key: string;
    header: string;
    render?: (item: any) => React.ReactNode;
}

type Props = {
    isDashboard?: boolean;
};

const Invoices: FC<Props> = ({ isDashboard }) => {
    const { isLoading, data: ordersData } = useGetAllOrdersQuery({});
    const { data: usersData } = useGetAllUserQuery({});
    const { data: coursesData } = useGetAllCoursesQuery({});
    const { data: ebooksData } = useGetAllEbooksQuery({});
    const [orderData, setOrderData] = useState<OrderWithDetails[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);

    useEffect(() => {
        if (ordersData?.orders && usersData?.users && (coursesData?.courses || ebooksData?.ebooks)) {
            const temp = ordersData.orders.map((item: any) => {
                const user = usersData.users.find(
                    (user: any) => user._id === item.userId
                );
                
                const course = coursesData?.courses?.find(
                    (course: any) => course._id === item.courseId
                );

                const ebook = !course ? ebooksData?.ebooks?.find(
                    (eb: any) => eb._id === item.courseId
                ) : null;

                const product = course || ebook;

                return {
                    _id: item._id,
                    userId: item.userId,
                    courseId: item.courseId,
                    purchaseDate: item.purchaseDate,
                    userName: user?.name,
                    userEmail: user?.email,
                    type: course ? "Course" : ebook ? "E-Book" : "N/A",
                    price: product ? `৳${product.price}` : "N/A",
                    createdAt: item.createdAt ? format(item.createdAt) : "N/A",
                    enrollmentData: item.enrollmentData
                };
            });
            setOrderData(temp);
        }
    }, [ordersData, usersData, coursesData, ebooksData]);

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("ID Copied!");
    };

    const columns = useMemo<Column[]>(
        () => [
            { key: "_id", header: "ID" },
            { key: "userName", header: "Name", flex: isDashboard ? 1 : 1 },
            ...(isDashboard
                ? []
                : [
                    { key: "userEmail", header: "Email", flex: 1 },
                    { 
                        key: "type", 
                        header: "Type", 
                        flex: 0.4,
                        render: (item: any) => 
                            item.type === "N/A" ? (
                                "N/A"
                            ) : (
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                                    item.type === 'Course' 
                                    ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                                    : item.type === 'Live Course'
                                    ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                                    : item.type === 'E-Book'
                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                                }`}>
                                    {item.type}
                                </span>
                            )
                    },
                ]),
            { key: "price", header: "Price", flex: 0.5 },
            ...(isDashboard
                ? []
                : [{ key: "createdAt", header: "Created At", flex: 0.5 }]),
            {
                key: "emailLink",
                header: "Email",
                render: (order: OrderWithDetails) =>
                    order.userEmail ? (
                        <div className="px-[10px]">
                            <a
                                href={`mailto:${order.userEmail}`}
                                className="text-text-basic hover:underline"
                            >
                                <IoMdMail size={20} />
                            </a>
                        </div>
                    ) : (
                        "N/A"
                    ),
                flex: 0.2,
            },
            {
                key: "view",
                header: "Details",
                render: (order: OrderWithDetails) => (
                    <div className="flex items-center justify-center">
                        <button
                            onClick={() => {
                                setSelectedOrder(order);
                                setOpen(true);
                            }}
                            className="text-hover-text-1 hover:text-blue-600 transition-colors"
                            title="View Enrollment Details"
                        >
                            <AiOutlineEye size={22} />
                        </button>
                    </div>
                ),
                flex: 0.2,
            },
        ],
        [isDashboard]
    );

    const dashboardOrders = useMemo(() => {
        return isDashboard ? orderData.slice(0, 5) : orderData;
    }, [orderData, isDashboard]);

    return (
        <div className={!isDashboard ? "bg-background-Theme pt-20 sm:pt-24 px-4 sm:px-8 pb-6" : "w-full"}>
            {!isDashboard && (
                <AdminPageHeader
                    icon={<CgNotes size={20} />}
                    title="Invoices"
                    subtitle="View and manage all purchase invoices"
                />
            )}
            {isLoading || !orderData ? (
                <Loader />
            ) : (
                <div className={`${!isDashboard ? "max-w-[1600px] mx-auto" : ""}`}>
                    {isDashboard ? (
                        <div className="flex flex-col gap-4">
                            {dashboardOrders.map((item: any, index: number) => (
                                <div 
                                    key={index} 
                                    className="p-2 rounded-xl bg-background-Card_2/10 hover:bg-background-Card_2/20 border border-[#ffffff0a] transition-all duration-300"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <h6 className="text-[18px] font-bold text-text-basic">
                                                {item.userName}
                                            </h6>
                                            <span 
                                                onClick={() => handleCopyId(item.userId)}
                                                className="text-[12px] opacity-40 cursor-pointer hover:text-blue-500 hover:opacity-100 transition-all font-mono"
                                                title="Click to copy ID"
                                            >
                                                User ID: {item.userId.substring(0, 8)}...
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[18px] font-bold text-green-500">
                                                {item.price}
                                            </span>
                                            <span className="text-[12px] opacity-40 italic whitespace-nowrap">
                                            {item.createdAt}
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Table Section for Full Page */
                        <div className="bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl overflow-hidden max-h-[calc(100vh-210px)] flex flex-col">
                                <DataTableBox
                                    data={dashboardOrders}
                                    columns={columns}
                                    filters={{
                                        createdAt: { type: 'date' },
                                    }}
                                />
                        </div>
                    )}
                </div>
            )}

            {open && selectedOrder && (
                <AnimatedPopup isOpen={open} onClose={() => setOpen(false)} zIndex={9999}>
                    <div className="bg-background-Card_1 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#ffffff1a] shadow-2xl relative z-10 custom-scrollbar">
                        {/* Header */}
                        <div className="sticky top-0 z-20 bg-background-Card_1 border-b border-[#ffffff1a] px-4 sm:px-8 py-5 flex items-center justify-between rounded-t-3xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <HiOutlineUser className="text-blue-500" size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-text-basic">Enrollment Details</h2>
                                    <p className="text-xs opacity-40">Order #{selectedOrder._id.slice(-8).toUpperCase()}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-9 h-9 rounded-xl bg-[#ffffff0a] hover:bg-[#ffffff15] flex items-center justify-center transition-all group"
                            >
                                <IoCloseOutline size={22} className="text-gray-400 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-4 sm:px-8 py-6">
                            {!selectedOrder.enrollmentData ? (
                                <div className="text-center py-16 opacity-40">
                                    <HiOutlineUser size={48} className="mx-auto mb-4 opacity-30" />
                                    <p className="text-lg font-medium">No enrollment form data</p>
                                    <p className="text-sm mt-1">This order was placed without an enrollment form.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {(() => {
                                        const d = selectedOrder.enrollmentData;
                                        const pi = d.personalInfo || {};
                                        const loc = d.location || {};
                                        const edu = d.education || {};
                                        const exp = d.experience || {};
                                        const ec = d.emergencyContact || {};
                                        return (
                                            <>
                                                <SectionCard icon={HiOutlineUser} title="Personal Information">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                        <DetailItem label="Full Name" value={pi.fullName} />
                                                        <DetailItem label="Email" value={pi.email} />
                                                        <DetailItem label="Phone" value={pi.phone} />
                                                        <DetailItem label="DOB" value={pi.dob} />
                                                        <DetailItem label="Gender" value={pi.gender} />
                                                    </div>
                                                </SectionCard>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <SectionCard icon={HiOutlineLocationMarker} title="Location">
                                                        <div className="space-y-4">
                                                            <DetailItem label="Country" value={loc.country} />
                                                            <DetailItem label="City / District" value={loc.cityDistrict} />
                                                            <DetailItem label="Postal Code" value={loc.postalCode} />
                                                        </div>
                                                    </SectionCard>
                                                    <SectionCard icon={HiOutlineAcademicCap} title="Education">
                                                        <div className="space-y-4">
                                                            <DetailItem label="Current Level" value={edu.currentLevel} />
                                                            <DetailItem label="Institution" value={edu.institutionName} />
                                                        </div>
                                                    </SectionCard>
                                                </div>

                                                <SectionCard icon={HiOutlineLightBulb} title="Experience & Expectations">
                                                    <div className="space-y-5">
                                                        <DetailItem label="Previous Online Courses" value={exp.takenOnlineCourseBefore} />
                                                        <DetailItem label="Heard About Us Via" value={exp.heardAboutClass} />
                                                        <div>
                                                            <p className="text-xs text-text-basic opacity-40 uppercase tracking-wide mb-2">Learning Goal</p>
                                                            <div className="bg-background-Theme rounded-xl border border-[#ffffff0a] p-4">
                                                                <p className="text-sm leading-relaxed">{exp.goal}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SectionCard>

                                                <SectionCard icon={HiOutlinePhone} title="Emergency Contact">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                                        <DetailItem label="Name" value={ec.name} />
                                                        <DetailItem label="Relationship" value={ec.relationship} />
                                                        <DetailItem label="Phone" value={ec.number} />
                                                    </div>
                                                </SectionCard>
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>
                </AnimatedPopup>
            )}
        </div>
    );
};

const SectionCard = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
    <div className="bg-background-Card_2/10 rounded-2xl border border-[#ffffff0a] p-5 hover:border-[#ffffff15] transition-all">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#ffffff0a]">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <Icon className="text-blue-500" size={16} />
            </div>
            <h3 className="text-base font-semibold text-text-basic">{title}</h3>
        </div>
        {children}
    </div>
);

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="group">
        <p className="text-[11px] text-text-basic opacity-40 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm font-medium text-text-basic bg-[#ffffff05] rounded-lg px-3 py-2 border border-[#ffffff08] group-hover:border-[#ffffff12] transition-all">
            {value || <span className="opacity-30 italic">N/A</span>}
        </p>
    </div>
);

export default Invoices;
