"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
    useGetAllTeacherApplicationsQuery,
    useUpdateApplicationStatusMutation,
} from "../../../redux/features/teacherApplication/teacherApplicationApi";
import { format } from "timeago.js";
import { MdCheckCircle, MdCancel, MdPending, MdExpandMore, MdExpandLess } from "react-icons/md";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import Loader from "../../components/Loader";
import AnimatedPopup from "../../components/AnimatedPopup";
import AdminPageHeader from "../../components/AdminPageHeader";

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const cfg: Record<string, string> = {
        pending: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/40 dark:border-blue-500/30",
        approved: "bg-green-600/20 text-[#0D8043] dark:text-green-400 border-green-600/40 dark:border-green-500/30",
        rejected: "bg-red-400/15 text-red-500 dark:text-red-400 border-red-400/30 dark:border-red-400/30",
    };
    const icons: Record<string, React.ReactNode> = {
        pending: <MdPending size={14} />,
        approved: <MdCheckCircle size={14} />,
        rejected: <MdCancel size={14} />,
    };
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${cfg[status] || cfg.pending}`}>
            {icons[status]}
            {status.charAt(0).toUpperCase() + status.slice(1)}
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

const TeacherApplications: React.FC = () => {
    const { data, isLoading, refetch } = useGetAllTeacherApplicationsQuery(
        {},
        { refetchOnMountOrArgChange: true }
    );
    const [updateStatus] = useUpdateApplicationStatusMutation();

    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [actionModal, setActionModal] = useState<{
        id: string;
        action: "approved" | "rejected";
        name: string;
    } | null>(null);
    const [adminNote, setAdminNote] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");

    const applications = data?.applications || [];

    const filtered = filterStatus === "all"
        ? applications
        : applications.filter((a: any) => a.status === filterStatus);

    const handleStatusUpdate = async () => {
        if (!actionModal) return;
        setIsUpdating(true);
        try {
            await updateStatus({
                id: actionModal.id,
                status: actionModal.action,
                adminNote,
            }).unwrap();
            toast.success(`Application ${actionModal.action} successfully!`);
            setActionModal(null);
            setAdminNote("");
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update status.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <AdminPageHeader
                    icon={<PiChalkboardTeacherFill size={20} />}
                    title="Teacher Applications"
                    subtitle={`${applications.length} total application${applications.length !== 1 ? "s" : ""}`}
                />

                {/* Status Filter */}
                <div className="flex gap-2 flex-wrap">
                    {["all", "pending", "approved", "rejected"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                                filterStatus === s
                                    ? "bg-hover-text-1 text-white dark:text-black border-hover-text-1"
                                    : "text-text-basic border-text-input/20 dark:border-white/20 hover:border-hover-text-1"
                            }`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                            <span className="ml-1.5 opacity-60">
                                ({s === "all" ? applications.length : applications.filter((a: any) => a.status === s).length})
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-20 text-text-basic opacity-40">
                    <PiChalkboardTeacherFill size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-lg">No applications found.</p>
                </div>
            ) : (
                <div className="bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl overflow-hidden max-h-[calc(100vh-210px)] flex flex-col">
                    <div className="p-2 overflow-y-auto custom-scrollbar flex-1">
                        <div className="space-y-0.5">
                    {filtered.map((app: any) => {
                        const isExpanded = expandedId === app._id;
                        return (
                                <div
                                    key={app._id}
                                    className={`transition-all duration-200 ${isExpanded ? "bg-black/5 dark:bg-white/5 rounded-2xl" : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"}`}
                                >
                                {/* Row header */}
                                <div
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer gap-3"
                                    onClick={() => setExpandedId(isExpanded ? null : app._id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-hover-text-1/20 flex items-center justify-center text-hover-text-1 font-bold text-sm flex-shrink-0">
                                            {app.fullName?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text-basic">{app.fullName}</p>
                                            <p className="text-xs text-text-basic opacity-50">{app.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 flex-wrap ml-12 sm:ml-0">
                                        <span className="text-xs text-text-basic opacity-40 hidden sm:block">
                                            {app.subjectsToTeach}
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

                                {/* Expanded details */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 dark:border-white/5 px-4 pb-5 pt-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                            <DetailRow label="Phone" value={app.phoneNumber} />
                                            <DetailRow label="Date of Birth" value={app.dateOfBirth} />
                                            <DetailRow label="Gender" value={app.gender} />
                                            <DetailRow label="Country" value={app.country} />
                                            <DetailRow label="City / District" value={app.city} />
                                            <DetailRow label="Postal Code" value={app.postalCode} />
                                            <DetailRow label="Address" value={app.address} />
                                            <DetailRow label="Subjects to Teach" value={app.subjectsToTeach} />
                                            <DetailRow label="Teaching Experience" value={app.teachingExperience} />
                                            <DetailRow label="Class Format" value={app.preferredClassFormat} />
                                            <DetailRow label="Language" value={app.preferredLanguage} />
                                            <DetailRow label="LinkedIn" value={app.linkedinUrl} />
                                            <DetailRow label="Facebook" value={app.facebookUrl} />
                                            <DetailRow label="YouTube" value={app.youtubeUrl} />
                                            <DetailRow label="Portfolio" value={app.portfolioUrl} />
                                        </div>

                                        {app.education && app.education.length > 0 && (
                                            <div className="mb-6">
                                                <p className="text-xs text-text-basic opacity-40 uppercase tracking-wide mb-3 font-medium">Education</p>
                                                <div className="space-y-3">
                                                    {app.education.map((edu: any, i: number) => (
                                                        <div key={i} className="bg-background-Card_2/10 dark:bg-white/5 rounded-xl p-3 border border-text-input/10 dark:border-white/5">
                                                            <p className="text-sm font-semibold text-text-basic">{edu.institutionName}</p>
                                                            <p className="text-xs text-text-basic opacity-70">{edu.degree} in {edu.fieldOfStudy}</p>
                                                            <p className="text-xs text-text-basic opacity-50">{edu.startMonth} {edu.startYear} – {edu.endMonth} {edu.endYear}{edu.grade ? ` | Grade: ${edu.grade}` : ""}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-3 mb-6">
                                            {app.whyJoin && (
                                                <div>
                                                    <p className="text-xs text-text-basic opacity-40 uppercase tracking-wide mb-1">Why they want to become a mentor</p>
                                                    <p className="text-sm text-text-basic bg-background-Card_2/10 dark:bg-white/5 rounded-xl p-3 border border-text-input/10 dark:border-white/5">{app.whyJoin}</p>
                                                </div>
                                            )}
                                            {app.adminNote && (
                                                <div>
                                                    <p className="text-xs text-text-basic opacity-40 uppercase tracking-wide mb-1">Admin note</p>
                                                    <p className="text-sm text-text-basic bg-background-Card_2/10 dark:bg-white/5 rounded-xl p-3 border border-text-input/10 dark:border-white/5">{app.adminNote}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        {app.status === "pending" && (
                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    onClick={() => setActionModal({ id: app._id, action: "approved", name: app.fullName })}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600/20 dark:bg-green-500/15 hover:bg-green-600 dark:hover:bg-green-500 text-[#0D8043] dark:text-green-400 hover:text-white border border-green-600/40 dark:border-green-500/30 rounded-xl text-sm font-semibold transition-all"
                                                >
                                                    <MdCheckCircle size={16} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => setActionModal({ id: app._id, action: "rejected", name: app.fullName })}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 rounded-xl text-sm font-semibold transition-all"
                                                >
                                                    <MdCancel size={16} /> Reject
                                                </button>
                                            </div>
                                        )}
                                        {app.status !== "pending" && (
                                            <div className="flex flex-wrap gap-3">
                                                {app.status === "approved" && (
                                                    <button
                                                        onClick={() => setActionModal({ id: app._id, action: "rejected", name: app.fullName })}
                                                        className="flex items-center gap-2 px-5 py-2.5 bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 rounded-xl text-sm font-semibold transition-all"
                                                    >
                                                        <MdCancel size={16} /> Revoke Approval
                                                    </button>
                                                )}
                                                {app.status === "rejected" && (
                                                    <button
                                                        onClick={() => setActionModal({ id: app._id, action: "approved", name: app.fullName })}
                                                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600/20 dark:bg-green-500/15 hover:bg-green-600 dark:hover:bg-green-500 text-[#0D8043] dark:text-green-400 hover:text-white border border-green-600/40 dark:border-green-500/30 rounded-xl text-sm font-semibold transition-all"
                                                    >
                                                        <MdCheckCircle size={16} /> Approve Instead
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )}

            {/* Confirmation Modal */}
            {actionModal && (
                <AnimatedPopup isOpen={true} onClose={() => { setActionModal(null); setAdminNote(""); }} zIndex={9999}>
                    <div className="bg-white dark:bg-background-Card_1 w-full max-w-md p-7 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl relative z-10">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${actionModal.action === "approved" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                            {actionModal.action === "approved" ? <MdCheckCircle size={30} /> : <MdCancel size={30} />}
                        </div>
                        <h3 className="text-xl font-bold text-text-basic text-center mb-1">
                            {actionModal.action === "approved" ? "Approve" : "Reject"} Application?
                        </h3>
                        <p className="text-sm text-text-basic opacity-60 text-center mb-5">
                            {actionModal.name}'s teacher application
                        </p>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-text-basic mb-1.5">
                                Admin Note <span className="opacity-40">(optional)</span>
                            </label>
                            <textarea
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                rows={3}
                                placeholder="Add a note visible to the applicant..."
                                className="w-full bg-gray-100 dark:bg-white/5 border border-text-input/20 dark:border-white/10 rounded-xl px-4 py-3 text-text-basic placeholder-text-input outline-none focus:border-hover-text-1 transition-all text-sm resize-none"
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => { setActionModal(null); setAdminNote(""); }}
                                className="flex-1 py-3 rounded-xl border border-text-input/20 dark:border-white/20 text-text-basic hover:bg-background-Card_2/10 dark:hover:bg-white/10 transition-all text-sm font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={isUpdating}
                                className={`flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-50 ${actionModal.action === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"}`}
                            >
                                {isUpdating ? "Saving..." : `Confirm ${actionModal.action === "approved" ? "Approval" : "Rejection"}`}
                            </button>
                        </div>
                    </div>
                </AnimatedPopup>
            )}
        </div>
    );
};

export default TeacherApplications;
