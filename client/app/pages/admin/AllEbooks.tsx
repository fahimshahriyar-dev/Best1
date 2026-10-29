"use client";
import React, { useEffect, useMemo, useState } from "react";
import { format } from "timeago.js";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { MdLibraryBooks } from "react-icons/md";
import toast from "react-hot-toast";
import { useGetAllEbooksAdminQuery, useDeleteEbookMutation, useUpdateEbookStatusMutation } from "../../../redux/features/ebook/ebookApi";
import { useGetHeroDataQuery } from "../../../redux/features/layout/layoutApi";
import DataTableBox from "../../components/DataTableBox";
import Loader from "../../components/Loader";
import Link from "next/link";
import AnimatedPopup from "../../components/AnimatedPopup";
import AdminPageHeader from "../../components/AdminPageHeader";

const AllEbooks = () => {
    const { isLoading, data, refetch } = useGetAllEbooksAdminQuery({}, { refetchOnMountOrArgChange: true });
    const { data: layoutData } = useGetHeroDataQuery("EbookCategories", {});
    const [deleteEbook, { isSuccess: deleteSuccess, error: deleteError, isLoading: isDeleting }] = useDeleteEbookMutation();
    const [updateEbookStatus, { isSuccess: statusUpdateSuccess, error: statusUpdateError }] = useUpdateEbookStatusMutation();
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState("");
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
        if (data?.ebooks) {
            data.ebooks.forEach((item: any) => {
                const catId = item.categories?._id || item.categories;
                items.push({
                    _id: item._id,
                    name: item.name,
                    author: item.author || "N/A",
                    ebookType: item.ebookType || "N/A",
                    category: categoryMap[catId] || item.categories?.title || catId || "N/A",
                    price: item.price,
                    purchased: item.purchased || 0,
                    status: item.status || "pending",
                    createdAt: item.createdAt,
                });
            });
        }
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAllItems(items);
    }, [data, categoryMap]);

    useEffect(() => {
        if (deleteSuccess) {
            toast.success("E-Book deleted successfully!");
            setOpenModal(false);
            refetch();
        }
        if (deleteError) {
            const errorData = deleteError as any;
            toast.error(errorData?.data?.message || "Failed to delete e-book.");
        }
    }, [deleteSuccess, deleteError, refetch]);

    useEffect(() => {
        if (statusUpdateSuccess) {
            toast.success("Status updated successfully!");
            setStatusUpdatingId(null);
            refetch();
        }
        if (statusUpdateError) {
            const errorData = statusUpdateError as any;
            toast.error(errorData?.data?.message || "Status update failed.");
            setStatusUpdatingId(null);
        }
    }, [statusUpdateSuccess, statusUpdateError, refetch]);

    const handleStatusChange = async (id: string, status: string) => {
        setStatusUpdatingId(id);
        await updateEbookStatus({ id, status });
    };

    const handleDelete = async () => {
        if (selectedId) {
            await deleteEbook(selectedId);
        }
    };

    const columns = useMemo(() => [
        { key: "_id", header: "ID" },
        { key: "name", header: "Title" },
        { key: "author", header: "Author" },
        { key: "ebookType", header: "Type" },
        { key: "category", header: "Category" },
        { 
            key: "price", 
            header: "Price",
            render: (item: any) => `৳${item.price}`
        },
        { key: "purchased", header: "Purchased" },
        {
            key: "status",
            header: "Status",
            render: (item: any) => (
                item.status === "drafting" ? (
                    <span className="text-xs font-semibold text-text-basic bg-yellow-500/10 px-2 py-1 rounded">Drafting</span>
                ) : (
                    <select
                        value={item.status || "pending"}
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
        {
            key: "createdAt",
            header: "Created At",
            render: (item: any) => format(item.createdAt)
        },
        {
            key: "edit",
            header: "Edit",
            render: (item: any) => (
                <Link href={`/admin/edit-ebook/${item._id}`}>
                    <AiOutlineEdit className="text-blue-500 hover:text-blue-600 cursor-pointer" size={22} />
                </Link>
            )
        },
        {
            key: "delete",
            header: "Delete",
            render: (item: any) => (
                <button onClick={() => { setOpenModal(true); setSelectedId(item._id); }}>
                    <AiOutlineDelete className="text-red-500 hover:text-red-600 cursor-pointer" size={22} />
                </button>
            )
        }
    ], [statusUpdatingId]);

    return (
        <div className="bg-background-Theme pt-20 sm:pt-24 px-4 sm:px-8 pb-6">
            <AdminPageHeader
                icon={<MdLibraryBooks size={20} />}
                title="All E-Books"
                subtitle="Manage all e-books available on the platform"
            />

            {isLoading ? (
                <Loader />
            ) : (
                <div className="max-w-[1600px] mx-auto">
                    <div className="bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl overflow-hidden max-h-[calc(100vh-210px)] flex flex-col">
                        <DataTableBox
                            data={allItems}
                            columns={columns}
                            filters={{
                                ebookType: { type: 'text' },
                                category: { type: 'text' },
                                status: { type: 'text' },
                                createdAt: { type: 'date' }
                            }}
                        />
                    </div>
                </div>
            )}

            <AnimatedPopup isOpen={openModal} onClose={() => setOpenModal(false)} zIndex={9999}>
                    <div className="bg-background-Card_1 w-full max-w-sm p-8 rounded-3xl border border-[#ffffff1a] shadow-2xl relative z-10 text-center">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AiOutlineDelete size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-text-basic mb-2">Delete E-Book?</h2>
                        <p className="text-sm opacity-60 mb-8">
                            This action cannot be undone. Are you sure you want to permanently delete this e-book?
                        </p>
                        <div className="flex gap-4">
                            <button
                                className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-text-basic font-bold transition-all"
                                onClick={() => setOpenModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
            </AnimatedPopup>
        </div>
    );
};

export default AllEbooks;
