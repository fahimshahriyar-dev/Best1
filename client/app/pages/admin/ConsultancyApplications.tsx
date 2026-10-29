"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
    useGetAllConsultanciesQuery,
    useToggleConsultancyReviewMutation,
} from "../../../redux/features/consultancy/consultancyApi";
import { format } from "timeago.js";
import { MdCheckCircle, MdOutlineRateReview, MdExpandMore, MdExpandLess } from "react-icons/md";
import Loader from "../../components/Loader";
import AdminPageHeader from "../../components/AdminPageHeader";

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const cfg: Record<string, string> = {
        unreviewed: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/40 dark:border-blue-500/30",
        reviewed: "bg-green-600/20 text-[#0D8043] dark:text-green-400 border-green-600/40 dark:border-green-500/30",
    };
    const icons: Record<string, React.ReactNode> = {
        unreviewed: <MdOutlineRateReview size={14} />,
        reviewed: <MdCheckCircle size={14} />,
    };
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${cfg[status] || cfg.unreviewed}`}>
            {icons[status]}
            {status === "reviewed" ? "Reviewed" : "Unreviewed"}
        </span>
    );
};

const DetailRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-text-basic opacity-40 font-medium uppercase tracking-wide">{label}</span>
            <span className="text-sm text-text-basic">{value}</span>
        </div>
    );
};

const ConsultancyApplications: React.FC = () => {
    const { data, isLoading, refetch } = useGetAllConsultanciesQuery(
        {},
        { refetchOnMountOrArgChange: true }
    );
    const [toggleReview, { isLoading: isToggling }] = useToggleConsultancyReviewMutation();

    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState("all");

    const consultancies = data?.consultancies || [];

    const filtered = filterStatus === "all"
        ? consultancies
        : consultancies.filter((a: any) => a.status === filterStatus);

    const handleToggleReview = async (id: string) => {
        try {
            await toggleReview(id).unwrap();
            toast.success("Review status updated!");
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update review status.");
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <AdminPageHeader
                    icon={<MdOutlineRateReview size={20} />}
                    title="Consultancy Requests"
                    subtitle={`${consultancies.length} total request${consultancies.length !== 1 ? "s" : ""}`}
                />

                <div className="flex gap-2 flex-wrap">
                    {["all", "unreviewed", "reviewed"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                                filterStatus === s
                                    ? "bg-hover-text-1 text-white dark:text-black border-hover-text-1"
                                    : "text-text-basic border-text-input/20 dark:border-white/20 hover:border-hover-text-1"
                            }`}
                        >
                            {s === "all" ? "All" : s === "reviewed" ? "Reviewed" : "Unreviewed"}
                            <span className="ml-1.5 opacity-60">
                                ({s === "all" ? consultancies.length : consultancies.filter((a: any) => a.status === s).length})
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-20 text-text-basic opacity-40">
                    <p className="text-lg">No consultancy requests found.</p>
                </div>
            ) : (
                <div className="bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl overflow-hidden">
                    <div className="p-2">
                        <div className="space-y-0.5">
                    {filtered.map((app: any) => {
                        const isExpanded = expandedId === app._id;
                        return (
                                <div
                                    key={app._id}
                                    className={`transition-all duration-200 ${isExpanded ? "bg-black/5 dark:bg-white/5 rounded-2xl" : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"}`}
                                >
                                <div
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer gap-3"
                                    onClick={() => setExpandedId(isExpanded ? null : app._id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-hover-text-1/20 flex items-center justify-center text-hover-text-1 font-bold text-sm flex-shrink-0">
                                            {app.fullName?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text-basic">{app.fullName || app.contactPerson}</p>
                                            <p className="text-xs text-text-basic opacity-50">{app.email || app.businessEmail}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 flex-wrap ml-12 sm:ml-0">
                                        {app.companyName && (
                                            <span className="text-xs text-text-basic opacity-60 hidden sm:block font-medium">
                                                {app.companyName}
                                            </span>
                                        )}
                                        <span className="text-xs text-text-basic opacity-40 hidden sm:block">
                                            {app.subject}
                                        </span>
                                        <StatusBadge status={app.status} />
                                        <span className="text-xs text-text-basic opacity-40">
                                            {format(app.createdAt)}
                                        </span>
                                        {isExpanded ? (
                                            <MdExpandLess size={20} className="text-text-basic opacity-50" />
                                        ) : (
                                            <MdExpandMore size={20} className="text-text-basic opacity-50" />
                                        )}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-gray-100 dark:border-white/5 px-4 pb-5 pt-4">
                                        <p className="text-xs text-text-basic opacity-40 uppercase tracking-wide mb-3 font-medium">Contact Information</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                            <DetailRow label="Full Name" value={app.fullName} />
                                            <DetailRow label="Contact Person" value={app.contactPerson} />
                                            <DetailRow label="Email" value={app.email} />
                                            <DetailRow label="Business Email" value={app.businessEmail} />
                                            <DetailRow label="Phone" value={app.phoneNumber} />
                                        </div>

                                        {(app.companyName || app.companyWebsite || app.industry) && (
                                            <>
                                                <p className="text-xs text-text-basic opacity-40 uppercase tracking-wide mb-3 mt-6 font-medium">Company Details</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                                    <DetailRow label="Company Name" value={app.companyName} />
                                                    <DetailRow label="Website" value={app.companyWebsite} />
                                                    <DetailRow label="Industry" value={app.industry} />
                                                </div>
                                            </>
                                        )}

                                        <p className="text-xs text-text-basic opacity-40 uppercase tracking-wide mb-3 mt-6 font-medium">Inquiry Details</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                            <DetailRow label="Subject" value={app.subject} />
                                            <DetailRow label="Consultancy Type" value={app.consultancyType} />
                                            <DetailRow label="Budget Range" value={app.budgetRange} />
                                            <DetailRow label="Preferred Timeline" value={app.preferredTimeline} />
                                        </div>

                                        {app.message && (
                                            <div className="mb-6">
                                                <p className="text-xs text-text-basic opacity-40 uppercase tracking-wide mb-1">Message</p>
                                                <p className="text-sm text-text-basic bg-background-Card_2/10 dark:bg-white/5 rounded-xl p-3 border border-text-input/10 dark:border-white/5 whitespace-pre-wrap">{app.message}</p>
                                            </div>
                                        )}

                                        {app.attachment && (
                                            <div className="mb-6">
                                                <p className="text-xs text-text-basic opacity-40 uppercase tracking-wide mb-1">Attachment</p>
                                                <p className="text-sm text-text-basic bg-background-Card_2/10 dark:bg-white/5 rounded-xl p-3 border border-text-input/10 dark:border-white/5">{app.attachment}</p>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 pt-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleToggleReview(app._id); }}
                                                disabled={isToggling}
                                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                                                    app.status === "reviewed"
                                                        ? "bg-blue-600/20 text-blue-600 dark:text-blue-400 border-blue-500/40 hover:bg-blue-600 hover:text-white"
                                                        : "bg-green-600/20 text-[#0D8043] dark:text-green-400 border-green-600/40 hover:bg-green-600 hover:text-white"
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {app.status === "reviewed" ? <MdOutlineRateReview size={16} /> : <MdCheckCircle size={16} />}
                                                {app.status === "reviewed" ? "Mark Unreviewed" : "Mark Reviewed"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )}
        </div>
    );
};

export default ConsultancyApplications;
