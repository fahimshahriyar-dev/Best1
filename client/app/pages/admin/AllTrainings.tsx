"use client";
import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { MdOutlineSchool } from "react-icons/md";
import toast from "react-hot-toast";
import {
    useGetAllTrainingsAdminQuery,
    useDeleteTrainingMutation,
    useUpdateTrainingStatusMutation,
} from "../../../redux/features/training/trainingApi";
import DataTableBox from "../../components/DataTableBox";
import Loader from "../../components/Loader";
import Link from "next/link";
import AnimatedPopup from "../../components/AnimatedPopup";
import AdminPageHeader from "../../components/AdminPageHeader";

const AllTrainings = () => {
    const { isLoading, data, refetch } = useGetAllTrainingsAdminQuery({}, { refetchOnMountOrArgChange: true });
    const [deleteTraining, { isSuccess: deleteSuccess, error: deleteError, isLoading: isDeleting }] = useDeleteTrainingMutation();
    const [updateTrainingStatus, { isSuccess: statusUpdateSuccess, error: statusUpdateError }] = useUpdateTrainingStatusMutation();
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState("");

    useEffect(() => {
        if (deleteSuccess) {
            toast.success("Training deleted successfully!");
            setOpenModal(false);
            refetch();
        }
        if (deleteError) {
            const errorData = deleteError as any;
            toast.error(errorData?.data?.message || "Failed to delete training.");
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
        await updateTrainingStatus({ id, status });
    };

    const handleDelete = async () => {
        if (selectedId) {
            await deleteTraining(selectedId);
        }
    };

    const columns = [
        { key: "_id", header: "ID" },
        { key: "title", header: "Title" },
        { key: "trainerName", header: "Trainer" },
        {
            key: "mode",
            header: "Mode",
            render: (item: any) => (
                <span className="text-xs font-semibold">{item.mode}</span>
            )
        },
        {
            key: "price",
            header: "Price",
            render: (item: any) => item.isFree ? (
                <span className="text-green-400 font-semibold text-xs">Free</span>
            ) : (
                `৳${item.price}`
            )
        },
        { key: "seatsTotal", header: "Seats" },
        {
            key: "status",
            header: "Status",
            render: (item: any) => (
                <select
                    value={item.status || "pending"}
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                    disabled={statusUpdatingId === item._id}
                    className={`bg-transparent border border-[#ffffff1a] rounded px-2 py-1 text-xs font-semibold outline-none ${
                        item.status === "pending" ? "text-yellow-400" :
                        item.status === "active" ? "text-green-400" :
                        "text-red-400"
                    }`}
                >
                    <option value="pending" className="text-yellow-400">Pending</option>
                    <option value="active" className="text-green-400">Active</option>
                    <option value="disabled" className="text-red-400">Disabled</option>
                </select>
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
                <Link href={`/admin/edit-training/${item._id}`}>
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
    ];

    return (
        <div className="bg-background-Theme pt-16 sm:pt-20 lg:pt-24 px-3 sm:px-6 lg:px-8 pb-3 sm:pb-5 h-screen flex flex-col overflow-hidden">
            <div className="flex-shrink-0">
                <AdminPageHeader
                    icon={<MdOutlineSchool size={20} />}
                    title="All Trainings"
                    subtitle="Manage all trainings available on the platform"
                />
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl overflow-hidden flex-1 flex flex-col min-h-0">
                            <DataTableBox
                                data={data?.trainings || []}
                                columns={columns}
                                filters={{
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
                        <h2 className="text-xl font-bold text-text-basic mb-2">Delete Training?</h2>
                        <p className="text-sm opacity-60 mb-8">
                            This action cannot be undone. Are you sure you want to permanently delete this training?
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

export default AllTrainings;
