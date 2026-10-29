"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
    useSubmitTeacherApplicationMutation,
    useGetMyApplicationStatusQuery,
} from "../../../redux/features/teacherApplication/teacherApplicationApi";
import { FiExternalLink, FiPlus, FiTrash2 } from "react-icons/fi";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { MdCheckCircle, MdPending, MdCancel } from "react-icons/md";

type Props = {
    user: any;
};

const inputClass =
    "w-full bg-[#E6E6E6] dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-text-basic placeholder-gray-500 dark:placeholder-text-input outline-none focus:border-hover-text-1 transition-all text-sm";
const labelClass = "block text-sm font-medium text-text-basic mb-1.5";
const selectClass =
    "w-full bg-[#E6E6E6] dark:bg-background-Card_1 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-text-basic outline-none focus:border-hover-text-1 transition-all text-sm cursor-pointer";

const SectionTitle: React.FC<{ number: number; title: string }> = ({
    number,
    title,
}) => (
    <div className="flex items-center gap-3 mb-5 mt-8">
        <div className="w-8 h-8 rounded-full bg-hover-text-1 flex items-center justify-center text-white dark:text-black text-sm font-bold flex-shrink-0">
            {number}
        </div>
        <h3 className="text-lg font-semibold text-text-basic">{title}</h3>
    </div>
);

const emptyEducation = {
    institutionName: "",
    degree: "",
    fieldOfStudy: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    grade: "",
    certificate: "",
};

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 60 }, (_, i) => String(currentYear - i));

const ApplyTeacher: React.FC<Props> = ({ user }) => {
    const { data: statusData, refetch } = useGetMyApplicationStatusQuery(
        undefined,
        { refetchOnMountOrArgChange: true }
    );
    const [submitApplication, { isLoading }] =
        useSubmitTeacherApplicationMutation();

    const existingApplication = statusData?.application;

    const [form, setForm] = useState({
        // Section 1
        fullName: user?.name || "",
        email: user?.email || "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        // Section 2
        country: "",
        city: "",
        postalCode: "",
        address: "",
        // Section 4
        subjectsToTeach: "",
        teachingExperience: "",
        preferredClassFormat: "",
        preferredLanguage: "",
        // Section 5
        linkedinUrl: "",
        facebookUrl: "",
        youtubeUrl: "",
        portfolioUrl: "",
        // Section 6
        whyJoin: "",
        // Agreement
        confirmAccuracy: false,
        agreeTerms: false,
    });

    const [educationList, setEducationList] = useState([{ ...emptyEducation }]);

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

    const handleEducationChange = (
        index: number,
        field: string,
        value: string
    ) => {
        setEducationList((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const addEducation = () => {
        setEducationList((prev) => [...prev, { ...emptyEducation }]);
    };

    const removeEducation = (index: number) => {
        if (educationList.length === 1) {
            toast.error("At least one education entry is required.");
            return;
        }
        setEducationList((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCertificate = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            handleEducationChange(index, "certificate", reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const validate = () => {
        const required = [
            "fullName", "email", "phoneNumber",
            "country", "city",
            "subjectsToTeach", "teachingExperience", "preferredClassFormat", "preferredLanguage",
        ];
        for (const field of required) {
            if (!form[field as keyof typeof form]) {
                toast.error("Please fill in all required fields.");
                return false;
            }
        }
        for (let i = 0; i < educationList.length; i++) {
            const edu = educationList[i];
            if (!edu.institutionName || !edu.degree || !edu.fieldOfStudy || !edu.startMonth || !edu.startYear || !edu.endMonth || !edu.endYear) {
                toast.error(`Please fill in all required fields in Education entry #${i + 1}.`);
                return false;
            }
        }
        if (form.whyJoin && form.whyJoin.length > 100) {
            toast.error("Why do you want to become a mentor must be under 100 characters.");
            return false;
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
            await submitApplication({ ...payload, education: educationList }).unwrap();
            toast.success("Application submitted successfully!");
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to submit application.");
        }
    };

    // --- Existing application status view ---
    if (existingApplication) {
        const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string; desc: string }> = {
            pending: {
                icon: <MdPending size={40} className="text-blue-600" />,
                color: "text-blue-700",
                bg: "bg-blue-100 border-blue-300 dark:bg-blue-500/10 dark:border-blue-500/30",
                label: "Under Review",
                desc: "Your application is currently being reviewed by our team. We'll get back to you soon.",
            },
            approved: {
                icon: <MdCheckCircle size={40} className="text-[#0D8043] dark:text-green-400" />,
                color: "text-[#0D8043] dark:text-green-400",
                bg: "bg-green-100 border-green-400 dark:bg-green-600/20 dark:border-green-500/40",
                label: "Approved!",
                desc: "Congratulations! Your teacher application has been approved.",
            },
            rejected: {
                icon: <MdCancel size={40} className="text-red-400" />,
                color: "text-red-400",
                bg: "bg-red-400/10 border-red-400/20",
                label: "Not Approved",
                desc: "Unfortunately, your application was not approved at this time.",
            },
        };
        const cfg = statusConfig[existingApplication.status as keyof typeof statusConfig];
        return (
            <div className="w-full max-w-2xl mx-auto px-6 py-10">
                <div className={`rounded-2xl border p-8 text-center ${cfg.bg}`}>
                    <div className="flex justify-center mb-4">{cfg.icon}</div>
                    <h2 className={`text-2xl font-bold mb-2 ${cfg.color}`}>
                        Application {cfg.label}
                    </h2>
                    <p className="text-text-basic opacity-70 mb-4">{cfg.desc}</p>
                    {existingApplication.adminNote && (
                        <div className="mt-4 p-4 bg-background-Card_2/10 dark:bg-white/5 rounded-xl text-sm text-text-basic text-left">
                            <span className="font-semibold">Admin note: </span>
                            {existingApplication.adminNote}
                        </div>
                    )}
                    <p className="text-xs text-text-basic opacity-40 mt-4">
                        Submitted on {new Date(existingApplication.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        );
    }

    // --- Application Form ---
    return (
        <div className="w-full">
            <div className="bg-background-Card_1 rounded-3xl border border-[#ffffff1a] shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-2">
                    <PiChalkboardTeacherFill size={32} className="text-hover-text-1" />
                    <h2 className="text-2xl font-bold text-text-basic">Apply to Become a Teacher</h2>
                </div>
                <p className="text-sm text-text-basic opacity-50 mb-8">
                    Fill out the form below to apply as a mentor at Best1 Academy. Fields marked with <span className="text-red-400">*</span> are required.
                </p>

                <form onSubmit={handleSubmit} className="space-y-2">
                    {/* ─── Section 1 ─── */}
                    <SectionTitle number={1} title="Personal Information" />
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
                            <label className={labelClass}>Date of Birth</label>
                            <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Gender</label>
                            <select name="gender" value={form.gender} onChange={handleChange} className={selectClass}>
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    {/* ─── Section 2 ─── */}
                    <SectionTitle number={2} title="Location" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Country <span className="text-red-400">*</span></label>
                            <input name="country" value={form.country} onChange={handleChange} placeholder="e.g. Bangladesh" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>City / District <span className="text-red-400">*</span></label>
                            <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Dhaka" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Postal Code</label>
                            <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="e.g. 1207" className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Address</label>
                            <input name="address" value={form.address} onChange={handleChange} placeholder="Street address, area" className={inputClass} />
                        </div>
                    </div>

                    {/* ─── Section 3 ─── */}
                    <SectionTitle number={3} title="Education" />
                    {educationList.map((edu, index) => (
                        <div key={index} className="bg-white/5 dark:bg-white/[0.02] rounded-2xl p-5 border border-[#ffffff0a] mb-4 relative">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold text-text-basic opacity-60">Education #{index + 1}</span>
                                {educationList.length > 1 && (
                                    <button type="button" onClick={() => removeEducation(index)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                        <FiTrash2 size={16} />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Institution Name <span className="text-red-400">*</span></label>
                                    <input value={edu.institutionName} onChange={(e) => handleEducationChange(index, "institutionName", e.target.value)} placeholder="e.g. University of Dhaka" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Degree <span className="text-red-400">*</span></label>
                                    <select value={edu.degree} onChange={(e) => handleEducationChange(index, "degree", e.target.value)} className={selectClass}>
                                        <option value="">Select degree</option>
                                        <option value="SSC">SSC</option>
                                        <option value="HSC">HSC</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Bachelor's">Bachelor's</option>
                                        <option value="Master's">Master's</option>
                                        <option value="PhD">PhD</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Field of Study <span className="text-red-400">*</span></label>
                                    <input value={edu.fieldOfStudy} onChange={(e) => handleEducationChange(index, "fieldOfStudy", e.target.value)} placeholder="e.g. Computer Science" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Start Month <span className="text-red-400">*</span></label>
                                    <select value={edu.startMonth} onChange={(e) => handleEducationChange(index, "startMonth", e.target.value)} className={selectClass}>
                                        <option value="">Month</option>
                                        {months.map((m) => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Start Year <span className="text-red-400">*</span></label>
                                    <select value={edu.startYear} onChange={(e) => handleEducationChange(index, "startYear", e.target.value)} className={selectClass}>
                                        <option value="">Year</option>
                                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>End Month <span className="text-red-400">*</span></label>
                                    <select value={edu.endMonth} onChange={(e) => handleEducationChange(index, "endMonth", e.target.value)} className={selectClass}>
                                        <option value="">Month</option>
                                        {months.map((m) => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>End Year <span className="text-red-400">*</span></label>
                                    <select value={edu.endYear} onChange={(e) => handleEducationChange(index, "endYear", e.target.value)} className={selectClass}>
                                        <option value="">Year</option>
                                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Grade</label>
                                    <input value={edu.grade} onChange={(e) => handleEducationChange(index, "grade", e.target.value)} placeholder="e.g. A, 3.8 GPA" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Certificate</label>
                                    <input type="file" accept="image/*" onChange={(e) => handleCertificate(index, e)} className={inputClass + " file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-hover-text-1 file:text-white dark:file:text-black"} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addEducation} className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 font-semibold transition-colors mt-2">
                        <FiPlus size={16} /> Add Education
                    </button>

                    {/* ─── Section 4 ─── */}
                    <SectionTitle number={4} title="Teaching Details" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Subject(s) You Want to Teach <span className="text-red-400">*</span></label>
                            <input name="subjectsToTeach" value={form.subjectsToTeach} onChange={handleChange} placeholder="e.g. Web Development, Mathematics, English Grammar" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Your Teaching Experience <span className="text-red-400">*</span></label>
                            <select name="teachingExperience" value={form.teachingExperience} onChange={handleChange} className={selectClass}>
                                <option value="">Select experience</option>
                                <option value="No experience">No experience</option>
                                <option value="Less than 1 year">Less than 1 year</option>
                                <option value="1–3 years">1–3 years</option>
                                <option value="3–5 years">3–5 years</option>
                                <option value="5+ years">5+ years</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Preferred Class Format <span className="text-red-400">*</span></label>
                            <select name="preferredClassFormat" value={form.preferredClassFormat} onChange={handleChange} className={selectClass}>
                                <option value="">Select format</option>
                                <option value="Live courses only">Live courses only</option>
                                <option value="Recorded courses only">Recorded courses only</option>
                                <option value="Both">Both</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Preferred Language of Instruction <span className="text-red-400">*</span></label>
                            <select name="preferredLanguage" value={form.preferredLanguage} onChange={handleChange} className={selectClass}>
                                <option value="">Select language</option>
                                <option value="Bangla">Bangla</option>
                                <option value="English">English</option>
                                <option value="Both">Both</option>
                            </select>
                        </div>
                    </div>

                    {/* ─── Section 5 ─── */}
                    <SectionTitle number={5} title="Online Presence (Optional)" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { name: "linkedinUrl", placeholder: "https://linkedin.com/in/yourprofile", label: "LinkedIn Profile URL" },
                            { name: "facebookUrl", placeholder: "https://facebook.com/yourprofile", label: "Facebook Profile URL" },
                            { name: "youtubeUrl", placeholder: "https://youtube.com/@yourchannel", label: "YouTube Channel URL" },
                            { name: "portfolioUrl", placeholder: "https://yourwebsite.com", label: "Personal Website / Portfolio" },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className={labelClass}>{field.label}</label>
                                <div className="relative">
                                    <input name={field.name} value={form[field.name as keyof typeof form] as string} onChange={handleChange} placeholder={field.placeholder} className={`${inputClass} pr-10`} />
                                    <FiExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ─── Section 6 ─── */}
                    <SectionTitle number={6} title="Additional Information" />
                    <div>
                        <label className={labelClass}>
                            Why do you want to become a member of Best1 Academy?
                            <span className="text-xs ml-2 opacity-50">({form.whyJoin.length}/100) Optional</span>
                        </label>
                        <textarea name="whyJoin" value={form.whyJoin} onChange={handleChange} rows={3} placeholder="Tell us what motivates you to teach and why you'd like to join Best1 Academy" className={`${inputClass} resize-none`} maxLength={100} />
                    </div>

                    {/* ─── Agreement ─── */}
                    <SectionTitle number={7} title="Agreement" />
                    <div className="space-y-4 mb-6">
                        {[
                            { name: "confirmAccuracy", label: "I confirm that all the information I have provided is accurate and truthful." },
                            { name: "agreeTerms", label: "I agree to the Terms & Conditions and Privacy Policy of Best1 Academy." },
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

                    {/* Submit */}
                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-hover-text-1 hover:opacity-90 text-white dark:text-black font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base">
                        {isLoading ? "Submitting..." : "Submit Application"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplyTeacher;
