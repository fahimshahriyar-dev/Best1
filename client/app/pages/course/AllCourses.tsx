'use client'
import React, { useEffect, useState, useMemo } from "react";
import {
    useDeleteCourseMutation,
    useGetAllCoursesQuery,
    useUpdateCourseStatusMutation,
} from "../../../redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "../../../redux/features/layout/layoutApi";
import Loader from "../../../app/components/Loader";
import { format } from "timeago.js";
import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import toast from "react-hot-toast";
import Link from "next/link";
import DataTableBox from "../../components/DataTableBox";
import AnimatedPopup from "../../components/AnimatedPopup";
import AdminPageHeader from "../../components/AdminPageHeader";
import { SiCoursera } from "react-icons/si";

interface Column {
    key: string;
    header: string;
    render?: (item: any) => React.ReactNode;
}

type Props = {};

const AllCourses: React.FC<Props> = () => {
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState("");

    const [deleteCourse, { isSuccess: courseDeleteSuccess, error: courseDeleteError }] = useDeleteCourseMutation({});
    const [updateCourseStatus, { isSuccess: statusUpdateSuccess, error: statusUpdateError }] = useUpdateCourseStatusMutation();
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

    const { isLoading: coursesLoading, data: coursesData, refetch: refetchCourses } = useGetAllCoursesQuery(
        {},
        { refetchOnMountOrArgChange: true }
    );
    const { data: layoutData } = useGetHeroDataQuery("Categories", {});

    const [allItems, setAllItems] = useState<any[]>([]);
    const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

    useEffect(() => {
        if (layoutData?.layout?.categories) {
            const map: Record<string, string> = {};
            layoutData.layout.categories.forEach((cat: any) => {
                map[cat._id] = cat.title;
            });
            setCategoryMap(map);
        }
    }, [layoutData]);

    useEffect(() => {
        const items: any[] = [];

        if (coursesData?.courses) {
            coursesData.courses.forEach((item: any) => {
                items.push({
                    _id: item._id,
                    name: item.name,
                    courseType: item.courseType || "N/A",
                    category: categoryMap[item.categories] || item.categories || "N/A",
                    subCategory: item.subCategory || "Recorded",
                    status: item.status || "pending",
                    price: item.price,
                    purchased: item.purchased || 0,
                    ratings: item.ratings || 0,
                    createdAt: item.createdAt,
                });
            });
        }

        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAllItems(items);
    }, [coursesData, categoryMap]);

    useEffect(() => {
        if (courseDeleteSuccess) {
            setOpen(false);
            refetchCourses();
            toast.success("Course deleted successfully");
        }
        if (courseDeleteError) {
            if ("data" in courseDeleteError) {
                const errorData = courseDeleteError as any;
                toast.error(errorData?.data?.message || "Delete failed");
            }
        }
    }, [courseDeleteSuccess, courseDeleteError, refetchCourses]);

    useEffect(() => {
        if (statusUpdateSuccess) {
            toast.success("Status updated successfully");
            setStatusUpdatingId(null);
            refetchCourses();
        }
        if (statusUpdateError) {
            if ("data" in statusUpdateError) {
                const errorData = statusUpdateError as any;
                toast.error(errorData?.data?.message || "Status update failed");
            }
            setStatusUpdatingId(null);
        }
    }, [statusUpdateSuccess, statusUpdateError, refetchCourses]);

    const handleStatusChange = async (id: string, status: string) => {
        setStatusUpdatingId(id);
        await updateCourseStatus({ id, status });
    };

    const handleDelete = async () => {
        await deleteCourse(deleteId);
    };

    const categoryOptions = useMemo(() => {
        const cats = new Set<string>();
        allItems.forEach((item) => {
            if (item.category && item.category !== "N/A") cats.add(item.category);
        });
        return Array.from(cats).sort();
    }, [allItems]);

    const columns = useMemo<Column[]>(
        () => [
            { key: "_id", header: "ID" },
            { key: "name", header: "Course Title" },
            { key: "courseType", header: "Course Type" },
            { key: "category", header: "Category" },
            { key: "subCategory", header: "Subcategory" },
            {
                key: "status",
                header: "Status",
                render: (item) => (
                    item.status === "drafting" ? (
                        <span className="text-xs font-semibold text-text-basic bg-yellow-500/10 px-2 py-1 rounded">Drafting</span>
                    ) : (
                        <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item._id, e.target.value)}
                            disabled={statusUpdatingId === item._id}
                            className={`bg-transparent border border-[#ffffff1a] rounded px-2 py-1 text-xs font-semibold outline-none ${
                                item.status === "active" ? "text-green-400" :
                                item.status === "disabled" ? "text-red-400" :
                                "text-yellow-400"
                            }`}
                        >
                            <option value="pending" className="text-text-basic">Pending</option>
                            <option value="active" className="text-green-400">Active</option>
                            <option value="disabled" className="text-red-400">Disabled</option>
                        </select>
                    )
                ),
            },
            { key: "price", header: "Price" },
            { key: "purchased", header: "Purchased" },
            {
                key: "createdAt",
                header: "Created At",
                render: (item) => format(item.createdAt),
            },
            {
                key: "edit",
                header: "Edit",
                render: (item) => (
                    <div className="px-[4px]">
                        <Link href={`/admin/edit-course/${item._id}`}>
                            <RiPencilFill size={20} className="text-background-Icon_1 cursor-pointer" />
                        </Link>
                    </div>
                ),
            },
            {
                key: "delete",
                header: "Delete",
                render: (item) => (
                    <button
                        onClick={() => {
                            setOpen(true);
                            setDeleteId(item._id);
                        }}
                        className="text-message-error cursor-pointer px-[14px]"
                    >
                        <MdDelete size={20} />
                    </button>
                ),
            },
        ],
        [open]
    );

    const isLoading = coursesLoading;

    return (
        <div className="pt-16 sm:pt-20 lg:pt-24 px-3 sm:px-6 lg:px-8 pb-3 sm:pb-5 bg-background-Theme h-screen flex flex-col overflow-hidden">
            <div className="flex-shrink-0">
                <AdminPageHeader
                    icon={<SiCoursera size={20} />}
                    title="All Courses"
                    subtitle="Manage all courses available on the platform"
                />
            </div>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl overflow-hidden flex-1 flex flex-col min-h-0">
                        <DataTableBox
                            data={allItems}
                            columns={columns}
                            filters={{
                                courseType: { type: "text", options: ["Certificate Course", "Academic Course", "Religious Course"] },
                                category: { type: "text", options: categoryOptions },
                                subCategory: { type: "text", options: ["Recorded", "Live"] },
                                createdAt: { type: "date" },
                            }}
                        />
                    </div>
                    <AnimatedPopup isOpen={open} onClose={() => setOpen(false)} zIndex={9999}>
                            <div className="bg-background-Card_1 w-full max-w-sm p-8 rounded-3xl border border-[#ffffff1a] shadow-2xl relative z-10 text-center">
                                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MdDelete size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-text-basic mb-2">Delete Course?</h2>
                                <p className="text-sm opacity-60 mb-8">
                                    This will permanently remove this course and all its data.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="flex-1 py-4 rounded-xl border border-text-input/20 dark:border-white/20 text-text-basic hover:bg-background-Card_2/10 transition-all text-sm font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                    </AnimatedPopup>
                </div>
            )}
        </div>
    );
};

export default AllCourses;
