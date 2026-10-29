"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
    useSubmitConsultancyMutation,
    useGetMyConsultancyStatusQuery,
} from "../../../redux/features/consultancy/consultancyApi";
import { MdCheckCircle, MdOutlineRateReview, MdOutlineVisibilityOff } from "react-icons/md";

type Props = {
    user: any;
};

const inputClass =
    "w-full bg-[#E6E6E6] dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-text-basic placeholder-gray-500 dark:placeholder-text-input outline-none focus:border-hover-text-1 transition-all text-sm";
const labelClass = "block text-sm font-medium text-text-basic mb-1.5";
const textareaClass =
    "w-full bg-[#E6E6E6] dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-text-basic placeholder-gray-500 dark:placeholder-text-input outline-none focus:border-hover-text-1 transition-all text-sm resize-none";

const ApplyConsultancy: React.FC<Props> = ({ user }) => {
    const { data: statusData, refetch } = useGetMyConsultancyStatusQuery(
        undefined,
        { refetchOnMountOrArgChange: true }
    );
    const [submitConsultancy, { isLoading }] =
        useSubmitConsultancyMutation();

    const existingConsultancy = statusData?.consultancy;

    const [form, setForm] = useState({
        fullName: user?.name || "",
        email: user?.email || "",
        phoneNumber: "",
        subject: "",
        message: "",
        confirmAccuracy: false,
        agreeTerms: false,
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const target = e.target as HTMLInputElement;
        const value =
            target.type === "checkbox" ? target.checked : target.value;
        setForm((prev) => ({ ...prev, [target.name]: value }));
    };

    const validate = () => {
        const required = ["fullName", "email", "phoneNumber", "subject", "message"];
        for (const field of required) {
            if (!form[field as keyof typeof form]) {
                toast.error(`Please fill in all required fields.`);
                return false;
            }
        }
        if (!form.confirmAccuracy) {
            toast.error("Please confirm that all information is accurate.");
            return false;
        }
        if (!form.agreeTerms) {
            toast.error("Please agree to the Terms & Conditions and Privacy Policy.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const { confirmAccuracy, agreeTerms, ...payload } = form;
            await submitConsultancy(payload).unwrap();
            toast.success("Consultancy request submitted successfully!");
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to submit consultancy request.");
        }
    };

    if (existingConsultancy) {
        const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string; desc: string }> = {
            unreviewed: {
                icon: <MdOutlineVisibilityOff size={40} className="text-blue-600" />,
                color: "text-blue-700",
                bg: "bg-blue-100 border-blue-300 dark:bg-blue-500/10 dark:border-blue-500/30",
                label: "Not Yet Reviewed",
                desc: "Your consultancy request has been submitted and is awaiting review.",
            },
            reviewed: {
                icon: <MdCheckCircle size={40} className="text-[#0D8043] dark:text-green-400" />,
                color: "text-[#0D8043] dark:text-green-400",
                bg: "bg-green-100 border-green-400 dark:bg-green-600/20 dark:border-green-500/40",
                label: "Reviewed",
                desc: "Your consultancy request has been reviewed by our team.",
            },
        };
        const cfg = statusConfig[existingConsultancy.status as keyof typeof statusConfig];
        return (
            <div className="w-full max-w-2xl mx-auto px-6 py-10">
                <div className={`rounded-2xl border p-8 text-center ${cfg.bg}`}>
                    <div className="flex justify-center mb-4">{cfg.icon}</div>
                    <h2 className={`text-2xl font-bold mb-2 ${cfg.color}`}>
                        Request {cfg.label}
                    </h2>
                    <p className="text-text-basic opacity-70 mb-4">{cfg.desc}</p>
                    {existingConsultancy.adminNote && (
                        <div className="mt-4 p-4 bg-background-Card_2/10 dark:bg-white/5 rounded-xl text-sm text-text-basic text-left">
                            <span className="font-semibold">Admin note: </span>
                            {existingConsultancy.adminNote}
                        </div>
                    )}
                    <p className="text-xs text-text-basic opacity-40 mt-4">
                        Submitted on {new Date(existingConsultancy.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="bg-background-Card_1 rounded-3xl border border-[#ffffff1a] shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-text-basic">Consultancy Request</h2>
                </div>
                <p className="text-sm text-text-basic opacity-50 mb-8">
                    Fill out the form below to submit a consultancy request. Fields marked with <span className="text-red-400">*</span> are required.
                </p>

                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Full Name <span className="text-red-400">*</span></label>
                            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your full name" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Email Address <span className="text-red-400">*</span></label>
                            <input name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Phone Number <span className="text-red-400">*</span></label>
                            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="+880 1XXXXXXXXX" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Subject <span className="text-red-400">*</span></label>
                            <input name="subject" value={form.subject} onChange={handleChange} placeholder="e.g. Career Guidance" className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Message <span className="text-red-400">*</span></label>
                        <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Describe your consultancy needs in detail..." className={textareaClass} />
                    </div>

                    <div className="space-y-4 mb-6 mt-6">
                        {[
                            { name: "confirmAccuracy", label: "I confirm that all the information I have provided is accurate and truthful." },
                            { name: "agreeTerms", label: "I agree to the Terms & Conditions and Privacy Policy." },
                        ].map((checkbox) => (
                            <label key={checkbox.name} className="flex items-start gap-3 cursor-pointer">
                                <div className="relative mt-0.5 flex-shrink-0">
                                    <input type="checkbox" name={checkbox.name} checked={form[checkbox.name as keyof typeof form] as boolean} onChange={handleChange} className="sr-only" />
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form[checkbox.name as keyof typeof form] ? "bg-hover-text-1 border-hover-text-1" : "border-gray-400 dark:border-white/20"}`}>
                                        {form[checkbox.name as keyof typeof form] && (
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="text-sm text-text-basic opacity-80">{checkbox.label} <span className="text-red-400">*</span></span>
                            </label>
                        ))}
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-hover-text-1 hover:opacity-90 text-white dark:text-black font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base">
                        {isLoading ? "Submitting..." : "Submit Consultancy Request"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplyConsultancy;
