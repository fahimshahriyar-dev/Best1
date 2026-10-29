"use client";
import React, { useState, useEffect } from "react";
import { useCreateEbookMutation } from "../../../redux/features/ebook/ebookApi";
import { useGetHeroDataQuery } from "../../../redux/features/layout/layoutApi";
import { useGetAllEbookTagsQuery } from "../../../redux/features/tags/tagsApi";
import { useGetAllDiscountCouponsQuery } from "../../../redux/features/discountCoupon/discountCouponApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { IoClose } from "react-icons/io5";
import AdminPageHeader from "../../components/AdminPageHeader";
import { BiSolidBookAdd } from "react-icons/bi";

const CreateEbook = () => {
    const [createEbook, { isLoading, isSuccess, error }] = useCreateEbookMutation();
    const { data: categoriesData } = useGetHeroDataQuery("EbookCategories", {});
    const { data: tagsData } = useGetAllEbookTagsQuery(undefined, {});
    const { data: couponsData } = useGetAllDiscountCouponsQuery(undefined, { refetchOnMountOrArgChange: true });
    const [categories, setCategories] = useState<any[]>([]);
    const [allTags, setAllTags] = useState<any[]>([]);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [tagSearch, setTagSearch] = useState("");
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const [couponSearch, setCouponSearch] = useState("");
    const [showCouponDropdown, setShowCouponDropdown] = useState(false);

    const [ebookInfo, setEbookInfo] = useState({
        name: "",
        author: "",
        description: "",
        price: "",
        pdf: "",
        thumbnail: "",
        categories: "",
        ebookType: "",
        tags: [] as string[],
        discountCoupon: "",
        discountPercent: "",
        couponExpiry: "",
    });

    useEffect(() => {
        if (couponsData?.coupons) {
            const activeCoupons = couponsData.coupons.filter((c: any) => {
                if (!c.isActive) return false;
                if (!c.expiryDate) return true;
                const today = new Date(new Date().toDateString());
                const expiry = new Date(c.expiryDate);
                return expiry >= today;
            });
            setCoupons(activeCoupons);
        }
    }, [couponsData]);

    useEffect(() => {
        if (tagsData?.tags) {
            setAllTags(tagsData.tags);
        }
    }, [tagsData]);

    useEffect(() => {
        if(categoriesData?.layout?.categories) {
            setCategories(categoriesData.layout.categories);
        }
    }, [categoriesData]);

    const [dragging, setDragging] = useState(false);
    const [pdfDragging, setPdfDragging] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            toast.success("E-Book created successfully!");
            redirect("/admin/ebooks");
        }
        if (error) {
            const errorData = error as any;
            toast.error(errorData?.data?.message || "Something went wrong.");
        }
    }, [isLoading, isSuccess, error]);

    const handleFileChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (reader.readyState === 2) {
                    setEbookInfo({ ...ebookInfo, thumbnail: reader.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePdfChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                toast.error("Please upload a valid PDF file.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (reader.readyState === 2) {
                    setEbookInfo({ ...ebookInfo, pdf: reader.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setEbookInfo({ ...ebookInfo, thumbnail: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePdfDrop = (e: any) => {
        e.preventDefault();
        setPdfDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                toast.error("Please upload a valid PDF file.");
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setEbookInfo({ ...ebookInfo, pdf: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: any, status?: string) => {
        e.preventDefault();
        if (
            !ebookInfo.name ||
            !ebookInfo.author ||
            !ebookInfo.description ||
            !ebookInfo.price ||
            !ebookInfo.pdf ||
            !ebookInfo.thumbnail
        ) {
            toast.error("Please fill all required fields, including the author, cover image and PDF file.");
            return;
        }

        const data = {
            name: ebookInfo.name,
            author: ebookInfo.author,
            description: ebookInfo.description,
            categories: ebookInfo.categories,
            ebookType: ebookInfo.ebookType,
            tags: ebookInfo.tags,
            price: Number(ebookInfo.price),
            discountCoupon: ebookInfo.discountCoupon || undefined,
            discountPercent: ebookInfo.discountPercent ? Number(ebookInfo.discountPercent) : undefined,
            couponExpiry: ebookInfo.couponExpiry || undefined,
            pdf: ebookInfo.pdf,
            thumbnail: ebookInfo.thumbnail,
            status: status || "pending",
        };

        if(!isLoading) {
            await createEbook(data);
        }
    };

    const inputClass = "w-full p-4 rounded-xl bg-background-bar_2 border border-[#ffffff1a] outline-none focus:border-blue-500 transition-all text-text-basic";
    const labelClass = "block text-sm font-medium opacity-60 mb-2 text-text-basic";

    return (
        <div className='w-full pt-20 sm:pt-24 px-4 sm:px-8 pb-16'>
            <div className='w-full mx-auto'>
                <AdminPageHeader
                    icon={<BiSolidBookAdd size={20} />}
                    title="Add E-Book"
                    subtitle="Upload and configure a new e-book for the platform"
                />
                <div className="bg-background-Card_1 p-8 sm:p-10 rounded-3xl border border-[#ffffff1a] shadow-2xl">
                    <form onSubmit={(e) => handleSubmit(e, "pending")} className="space-y-6">
                        {/* Basic Info */}
                        <div className='space-y-4'>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>E-Book Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={ebookInfo.name}
                                        placeholder='e.g. Mastering Next.js'
                                        className={inputClass}
                                        onChange={(e: any) => setEbookInfo({ ...ebookInfo, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Author Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={ebookInfo.author}
                                        placeholder='e.g. John Doe'
                                        className={inputClass}
                                        onChange={(e: any) => setEbookInfo({ ...ebookInfo, author: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Description <span className="text-red-500">*</span></label>
                                <textarea
                                    rows={4}
                                    required
                                    value={ebookInfo.description}
                                    placeholder='Write a detailed description of the e-book...'
                                    className={`${inputClass} resize-none`}
                                    onChange={(e: any) => setEbookInfo({ ...ebookInfo, description: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        {/* Type + Category Grid */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className={labelClass}>E-Book Type</label>
                                <select
                                    value={ebookInfo.ebookType}
                                    className={inputClass}
                                    onChange={(e: any) => setEbookInfo({ ...ebookInfo, ebookType: e.target.value })}
                                >
                                    <option value="">Select type</option>
                                    <option value="Certificate E-Book">Certificate E-Book</option>
                                    <option value="Academic E-Book">Academic E-Book</option>
                                    <option value="Religious E-Book">Religious E-Book</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>E-Book Category</label>
                                <select
                                    value={ebookInfo.categories}
                                    className={inputClass}
                                    onChange={(e: any) => setEbookInfo({ ...ebookInfo, categories: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((item: any) => (
                                        <option value={item._id} key={item._id}>{item.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* E-Book Tags */}
                        <div className='w-full'>
                            <label className={labelClass}>E-Book Tags</label>
                            <div className='relative'>
                                <input
                                    type="text"
                                    value={tagSearch}
                                    placeholder='Search and add tags...'
                                    className={inputClass}
                                    onChange={(e) => {
                                        setTagSearch(e.target.value);
                                        setShowTagDropdown(true);
                                    }}
                                    onFocus={() => setShowTagDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
                                />
                                {showTagDropdown && tagSearch && (
                                    <div className='absolute top-full left-0 right-0 bg-background-Card_1 border border-[#ffffff1a] rounded-xl mt-1 max-h-40 overflow-y-auto z-50 shadow-xl'>
                                        {allTags
                                            .filter((t: any) =>
                                                t.title.toLowerCase().includes(tagSearch.toLowerCase()) &&
                                                !ebookInfo.tags.includes(t.title)
                                            )
                                            .map((tag: any) => (
                                                <div
                                                    key={tag._id}
                                                    className='px-4 py-2.5 hover:bg-hover-bg-1 cursor-pointer text-text-basic text-sm transition-all'
                                                    onMouseDown={() => {
                                                        setEbookInfo({
                                                            ...ebookInfo,
                                                            tags: [...ebookInfo.tags, tag.title],
                                                        });
                                                        setTagSearch("");
                                                        setShowTagDropdown(false);
                                                    }}
                                                >
                                                    {tag.title}
                                                </div>
                                            ))}
                                        {allTags.filter((t: any) =>
                                            t.title.toLowerCase().includes(tagSearch.toLowerCase()) &&
                                            !ebookInfo.tags.includes(t.title)
                                        ).length === 0 && (
                                            <div className='px-4 py-2.5 text-text-basic opacity-40 text-sm'>No tags found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {ebookInfo.tags.length > 0 && (
                                <div className='flex flex-wrap gap-2 mt-3'>
                                    {ebookInfo.tags.map((tag: string, i: number) => (
                                        <span key={i} className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-hover-text-1/20 text-text-basic rounded-full text-sm font-medium'>
                                            {tag}
                                            <IoClose
                                                className='cursor-pointer hover:text-red-400 transition-colors'
                                                size={16}
                                                onClick={() => {
                                                    setEbookInfo({
                                                        ...ebookInfo,
                                                        tags: ebookInfo.tags.filter((t) => t !== tag),
                                                    });
                                                }}
                                            />
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pricing Grid */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <label className={labelClass}>Price (৳) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    required
                                    value={ebookInfo.price}
                                    placeholder='e.g. 500'
                                    className={inputClass}
                                    onChange={(e: any) => setEbookInfo({ ...ebookInfo, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Discount Coupon</label>
                                <div className='relative'>
                                    <input
                                        type="text"
                                        value={couponSearch}
                                        placeholder='Search and select a coupon...'
                                        className={inputClass}
                                        onChange={(e) => {
                                            setCouponSearch(e.target.value);
                                            setShowCouponDropdown(true);
                                        }}
                                        onFocus={() => setShowCouponDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowCouponDropdown(false), 200)}
                                    />
                                    {showCouponDropdown && couponSearch && (
                                        <div className='absolute top-full left-0 right-0 bg-background-Card_1 border border-[#ffffff1a] rounded-xl mt-1 max-h-40 overflow-y-auto z-50 shadow-xl'>
                                            {coupons
                                                .filter((c: any) =>
                                                    c.code.toLowerCase().includes(couponSearch.toLowerCase()) &&
                                                    c.code !== ebookInfo.discountCoupon
                                                )
                                                .map((c: any) => (
                                                    <div
                                                        key={c._id}
                                                        className='px-4 py-2.5 hover:bg-hover-bg-1 cursor-pointer text-text-basic text-sm transition-all'
                                                        onMouseDown={() => {
                                                            setEbookInfo({
                                                                ...ebookInfo,
                                                                discountCoupon: c.code,
                                                                discountPercent: c.discountPercent,
                                                                couponExpiry: c.expiryDate,
                                                            });
                                                            setCouponSearch("");
                                                            setShowCouponDropdown(false);
                                                        }}
                                                    >
                                                        {c.code} - {c.discountPercent}% off
                                                    </div>
                                                ))}
                                            {coupons.filter((c: any) =>
                                                c.code.toLowerCase().includes(couponSearch.toLowerCase()) &&
                                                c.code !== ebookInfo.discountCoupon
                                            ).length === 0 && (
                                                <div className='px-4 py-2.5 text-text-basic opacity-40 text-sm'>No coupons found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {ebookInfo.discountCoupon && (
                                    <div className='flex flex-wrap gap-2 mt-3'>
                                        <span className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-sm font-medium border border-green-500/20'>
                                            {ebookInfo.discountCoupon} — {ebookInfo.discountPercent}% OFF
                                            <IoClose
                                                className='cursor-pointer hover:text-red-400 transition-colors'
                                                size={16}
                                                onClick={() => {
                                                    setEbookInfo({
                                                        ...ebookInfo,
                                                        discountCoupon: "",
                                                        discountPercent: "",
                                                        couponExpiry: "",
                                                    });
                                                }}
                                            />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PDF Upload */}
                        <div className="w-full">
                            <label className={labelClass}>Upload E-Book PDF <span className="text-red-500">*</span></label>
                            <input
                                type="file"
                                accept='application/pdf'
                                id='pdf-file'
                                className='hidden'
                                onChange={handlePdfChange}
                            />
                            <label
                                htmlFor="pdf-file"
                                className={`w-full min-h-[150px] border-2 border-dashed border-gray-300 dark:border-white/40 hover:border-gray-400 dark:hover:border-white/60 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${pdfDragging ? "bg-blue-500/10 border-blue-500" : "bg-[#E5E5E5] dark:bg-white/5 hover:bg-[#dedede] dark:hover:bg-white/10"}`}
                                onDragOver={(e) => { e.preventDefault(); setPdfDragging(true); }}
                                onDragLeave={(e) => { e.preventDefault(); setPdfDragging(false); }}
                                onDrop={handlePdfDrop}
                            >
                                {ebookInfo.pdf ? (
                                    <div className="text-center">
                                        <div className="bg-green-500/20 text-green-500 p-4 rounded-full mb-3 mx-auto w-fit">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className='text-text-basic font-medium text-green-500'>PDF Selected Successfully!</p>
                                        <p className='text-xs opacity-60 mt-1'>Click or drop to replace the file</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className='text-text-basic font-medium'>Drop your e-book PDF file here</p>
                                        <p className='text-xs opacity-40 mt-1'>or click to browse from files</p>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* Thumbnail Upload */}
                        <div className="w-full">
                            <label className={labelClass}>E-Book Cover (1410 x 2250) <span className="text-red-500">*</span></label>
                            <input
                                type="file"
                                accept='image/*'
                                id='file'
                                className='hidden'
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="file"
                                className={`w-full min-h-[300px] border-2 border-dashed border-gray-300 dark:border-white/40 hover:border-gray-400 dark:hover:border-white/60 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${dragging ? "bg-blue-500/10 border-blue-500" : "bg-[#E5E5E5] dark:bg-white/5 hover:bg-[#dedede] dark:hover:bg-white/10"}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {ebookInfo.thumbnail ? (
                                    <div className="relative h-[300px] mx-auto">
                                        <img
                                            src={ebookInfo.thumbnail}
                                            alt="Cover"
                                            className='h-full w-auto object-cover rounded-2xl shadow-lg'
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className='text-text-basic font-medium'>Drop your 1410x2250 cover image here</p>
                                        <p className='text-xs opacity-60 mt-1'>Images should ideally be in portrait orientation</p>
                                        <p className='text-xs opacity-40 mt-1'>or click to browse from files</p>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* Submit Buttons */}
                        <div className='flex justify-end gap-4 pt-6'>
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={(e) => handleSubmit(e, "drafting")}
                                className={`w-full md:w-auto px-8 py-4 bg-background-Card_2 hover:bg-background-Card_2/80 text-text-basic font-bold rounded-2xl transition-all border border-[#ffffff1a] ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                            >
                                {isLoading ? "Saving..." : "Save as Draft"}
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full md:w-auto px-12 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                            >
                                {isLoading ? "Creating..." : "Create & Publish"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEbook;
