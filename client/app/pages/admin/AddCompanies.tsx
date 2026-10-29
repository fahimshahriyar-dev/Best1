"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { MdDelete, MdBusiness } from "react-icons/md";
import { FiExternalLink, FiGlobe } from "react-icons/fi";
import Loader from "@/app/components/Loader";
import AdminPageHeader from "../../components/AdminPageHeader";
import {
    useAddCompanyMutation,
    useGetAllCompaniesQuery,
    useDeleteCompanyMutation,
} from "@/redux/features/company/companyApi";

type Props = {};

const AddCompanies: React.FC<Props> = () => {
    const { data, isLoading, refetch } = useGetAllCompaniesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [addCompany, { isLoading: isAdding, isSuccess: addSuccess, error: addError }] = useAddCompanyMutation();
    const [deleteCompany, { isLoading: isDeleting, isSuccess: deleteSuccess, error: deleteError }] = useDeleteCompanyMutation();

    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [logo, setLogo] = useState<string>("");
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        if (addSuccess) {
            toast.success("Company added successfully!");
            setName("");
            setWebsite("");
            setLogo("");
            refetch();
        }
        if (deleteSuccess) {
            toast.success("Company deleted successfully!");
            refetch();
        }
    }, [addSuccess, deleteSuccess, refetch]);

    useEffect(() => {
        const err = addError || deleteError;
        if (err) {
            if ("data" in err) {
                const errorData = err as any;
                toast.error(errorData?.data?.message || "Something went wrong");
            }
        }
    }, [addError, deleteError]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setLogo(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setLogo(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Please enter the company name.");
            return;
        }
        if (!website.trim()) {
            toast.error("Please enter the website link.");
            return;
        }

        let formattedWebsite = website.trim();
        if (!/^https?:\/\//i.test(formattedWebsite)) {
            formattedWebsite = `https://${formattedWebsite}`;
        }

        await addCompany({
            name: name.trim(),
            website: formattedWebsite,
            logo: logo || undefined,
        });
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this company?")) {
            await deleteCompany(id);
        }
    };

    const companies = data?.companies || [];

    const labelClass = "block text-sm font-semibold text-text-basic mb-2";
    const inputClass =
        "w-full px-4 py-3 bg-[#E5E5E5] dark:bg-white/5 border border-text-basic/10 rounded-2xl text-text-basic focus:outline-none focus:border-blue-500 transition-all text-sm";

    return (
        <div className="w-full">
            <AdminPageHeader
                icon={<MdBusiness size={24} />}
                title="Companies"
                subtitle="Manage partner companies, logos, and website links for the headline and navbar"
            />

            {/* Create Company Form */}
            <div className="bg-background-Card_1 p-6 sm:p-8 rounded-3xl border border-text-basic/10 shadow-xl mb-8">
                <h2 className="text-lg font-bold text-text-basic mb-5 flex items-center gap-2">
                    <HiMiniPlusCircle size={22} className="text-blue-500" />
                    Add New Company
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Google, Microsoft, NextGen Tech"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Website Link <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="e.g. https://example.com"
                                    className={`${inputClass} pr-10`}
                                />
                                <FiGlobe className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-basic opacity-40" size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Logo Dropzone */}
                    <div>
                        <label className={labelClass}>
                            Company Logo <span className="text-xs font-normal opacity-60">(optional, will use 1st character circle if empty)</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            id="company-logo"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="company-logo"
                            className={`w-full min-h-[160px] border-2 border-dashed border-gray-300 dark:border-white/30 hover:border-gray-400 dark:hover:border-white/50 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                                dragging
                                    ? "bg-blue-500/10 border-blue-500"
                                    : "bg-[#E5E5E5] dark:bg-white/5 hover:bg-[#dedede] dark:hover:bg-white/10"
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {logo ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-20 h-20 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center overflow-hidden border border-gray-200">
                                        <img
                                            src={logo}
                                            alt="preview"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <span className="text-xs text-blue-500 font-semibold hover:underline">
                                        Click or drop to replace logo
                                    </span>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-2">
                                        <MdBusiness size={24} />
                                    </div>
                                    <p className="text-text-basic font-medium text-sm">
                                        Drop your company logo here
                                    </p>
                                    <p className="text-xs opacity-50 mt-1">PNG, JPG, SVG, WebP supported</p>
                                    <p className="text-xs opacity-40 mt-0.5">or click to browse from files</p>
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        {logo && (
                            <button
                                type="button"
                                onClick={() => setLogo("")}
                                className="px-5 py-3 rounded-xl border border-text-basic/15 text-text-basic text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                            >
                                Remove Logo
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isAdding}
                            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm cursor-pointer"
                        >
                            {isAdding ? "Adding..." : "Add Company"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Companies List */}
            <div className="bg-background-Card_1 p-6 sm:p-8 rounded-3xl border border-text-basic/10 shadow-xl">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-text-basic">
                            All Companies ({companies.length})
                        </h2>
                        <p className="text-xs text-text-basic opacity-50">
                            These appear in the headline banner and navbar menu box
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-10 flex justify-center">
                        <Loader />
                    </div>
                ) : companies.length === 0 ? (
                    <div className="text-center py-12 text-text-basic opacity-60">
                        <MdBusiness size={48} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No companies added yet</p>
                        <p className="text-xs mt-1">Use the form above to add your first company.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {companies.map((company: any) => {
                            const firstChar = company.name ? company.name.trim().charAt(0).toUpperCase() : "?";
                            return (
                                <div
                                    key={company._id}
                                    className="p-4 rounded-2xl bg-[#E5E5E5]/50 dark:bg-white/5 border border-text-basic/10 flex items-center justify-between gap-3 hover:border-blue-500/50 transition-all group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {company.logo?.url ? (
                                            <div className="w-12 h-12 rounded-xl bg-white p-1.5 shrink-0 flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
                                                <img
                                                    src={company.logo.url}
                                                    alt={company.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-lg shrink-0 flex items-center justify-center shadow-md">
                                                {firstChar}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-text-basic text-sm truncate">
                                                {company.name}
                                            </h3>
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-500 hover:underline flex items-center gap-1 truncate mt-0.5"
                                            >
                                                <span className="truncate">{company.website}</span>
                                                <FiExternalLink size={11} className="shrink-0" />
                                            </a>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(company._id)}
                                        disabled={isDeleting}
                                        title="Delete company"
                                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shrink-0 cursor-pointer"
                                    >
                                        <MdDelete size={20} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddCompanies;
