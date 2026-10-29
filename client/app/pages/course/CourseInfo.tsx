'use client'
import { useGetHeroDataQuery } from '../../../redux/features/layout/layoutApi';
import { useGetAllCourseTagsQuery } from '../../../redux/features/tags/tagsApi';
import { useGetAllDiscountCouponsQuery } from '../../../redux/features/discountCoupon/discountCouponApi';
import React, { FC, useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5';
import { RiPencilFill } from "react-icons/ri";

type Props = {
    courseInfo: any;
    setCourseInfo: (courseInfo: any) => void;
    active: number;
    setActive: (active: number) => void;
    isEdit?: boolean;
    handleSaveDraft?: () => void;
}

const inputClass = "w-full p-4 rounded-xl bg-background-bar_2 border border-[#ffffff1a] outline-none focus:border-blue-500 transition-all text-text-basic";
const labelClass = "block text-sm font-medium opacity-60 mb-2 text-text-basic";

const CourseInfo: FC<Props> = ({ courseInfo, setCourseInfo, active, setActive, isEdit = false, handleSaveDraft }) => {
    const [dragging, setDragging] = useState(false);
    const [priceLocked, setPriceLocked] = useState(true);
    const [demoUrlLocked, setDemoUrlLocked] = useState(true);
    const [linkLocks, setLinkLocks] = useState<boolean[]>([]);

    useEffect(() => {
        if (isEdit && courseInfo.sourceLinks) {
            setLinkLocks(courseInfo.sourceLinks.map(() => true));
        }
    }, [isEdit, courseInfo.sourceLinks]);

    const toggleLinkLock = (index: number) => {
        setLinkLocks((prev) => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
        });
    }
    const { data } = useGetHeroDataQuery("Categories", {});
    const { data: tagsData } = useGetAllCourseTagsQuery(undefined, {});
    const [categories, setCategories] = useState([]);
    const [allTags, setAllTags] = useState<any[]>([]);
    const [tagSearch, setTagSearch] = useState("");
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const { data: couponsData } = useGetAllDiscountCouponsQuery(undefined, { refetchOnMountOrArgChange: true });
    const [coupons, setCoupons] = useState<any[]>([]);
    const [couponSearch, setCouponSearch] = useState("");
    const [showCouponDropdown, setShowCouponDropdown] = useState(false);

    useEffect(() => {
        if (data?.layout) {
            setCategories(data.layout.categories)
        }
    }, [data])

    useEffect(() => {
        if (tagsData?.tags) {
            setAllTags(tagsData.tags)
        }
    }, [tagsData])

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
    }, [couponsData])

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setActive(active + 1)
    }

    const cropImageToSquare = (base64Str: string): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const size = Math.min(img.width, img.height);
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(
                        img,
                        (img.width - size) / 2,
                        (img.height - size) / 2,
                        size,
                        size,
                        0,
                        0,
                        size,
                        size
                    );
                    resolve(canvas.toDataURL('image/jpeg'));
                } else {
                    resolve(base64Str);
                }
            };
        });
    };

    const handleFileChange = async (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e: any) => {
                if (reader.readyState === 2) {
                    const cropped = await cropImageToSquare(reader.result as string);
                    setCourseInfo({ ...courseInfo, thumbnail: cropped })
                }
            };
            reader.readAsDataURL(file)
        }
    }

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setDragging(true);
    }

    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setDragging(false);
    }

    const handleDrop = (e: any) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
                const cropped = await cropImageToSquare(reader.result as string);
                setCourseInfo({ ...courseInfo, thumbnail: cropped })
            };
            reader.readAsDataURL(file)
        }
    }

    const addTag = (tagTitle: string) => {
        if (!courseInfo.tags.includes(tagTitle)) {
            setCourseInfo({ ...courseInfo, tags: [...courseInfo.tags, tagTitle] })
        }
        setTagSearch("")
        setShowTagDropdown(false)
    }

    const removeTag = (tagTitle: string) => {
        setCourseInfo({ ...courseInfo, tags: courseInfo.tags.filter((t: string) => t !== tagTitle) })
    }

    const filteredTags = allTags.filter((t: any) =>
        t.title.toLowerCase().includes(tagSearch.toLowerCase()) &&
        !courseInfo.tags.includes(t.title)
    )

    const addSourceLink = () => {
        setCourseInfo({
            ...courseInfo,
            sourceLinks: [...courseInfo.sourceLinks, { title: "", url: "" }]
        })
    }

    const updateSourceLink = (index: number, field: string, value: string) => {
        const updated = [...courseInfo.sourceLinks]
        updated[index][field] = value
        setCourseInfo({ ...courseInfo, sourceLinks: updated })
    }

    const removeSourceLink = (index: number) => {
        const updated = courseInfo.sourceLinks.filter((_: any, i: number) => i !== index)
        setCourseInfo({ ...courseInfo, sourceLinks: updated })
    }

    return (
        <div className='w-full mx-auto pt-6 pb-20'>
            <div className="bg-background-Card_1 p-10 rounded-3xl border border-[#ffffff1a] shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Course Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={courseInfo.name}
                                placeholder='MERN stack LMS platform with next 13'
                                className={inputClass}
                                onChange={(e: any) => setCourseInfo({ ...courseInfo, name: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Course Description <span className="text-red-500">*</span></label>
                            <textarea
                                rows={4}
                                value={courseInfo.description}
                                placeholder='Write something amazing....'
                                className={`${inputClass} resize-none`}
                                onChange={(e: any) => setCourseInfo({ ...courseInfo, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className={labelClass}>Course Price (৳) <span className="text-red-500">*</span></label>
                            <div className='relative'>
                                <input
                                    type="number"
                                    required
                                    value={courseInfo.price}
                                    placeholder='500'
                                    disabled={isEdit && priceLocked}
                                    className={`${inputClass} ${isEdit && priceLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onChange={(e: any) => setCourseInfo({ ...courseInfo, price: e.target.value })}
                                />
                                {isEdit && (
                                    <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                                        {priceLocked ? (
                                            <RiPencilFill
                                                size={16}
                                                className="text-background-Icon_1 cursor-pointer"
                                                onClick={() => setPriceLocked(false)}
                                            />
                                        ) : (
                                            <IoClose
                                                size={18}
                                                className="text-red-400 cursor-pointer"
                                                onClick={() => setPriceLocked(true)}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
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
                                                c.code !== courseInfo.discountCoupon
                                            )
                                            .map((c: any) => (
                                                <div
                                                    key={c._id}
                                                    className='px-4 py-2.5 hover:bg-hover-bg-1 cursor-pointer text-text-basic text-sm transition-all'
                                                    onMouseDown={() => {
                                                        setCourseInfo({
                                                            ...courseInfo,
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
                                            c.code !== courseInfo.discountCoupon
                                        ).length === 0 && (
                                            <div className='px-4 py-2.5 text-text-basic opacity-40 text-sm'>
                                                No coupons found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {courseInfo.discountCoupon && (
                                <div className='flex flex-wrap gap-2 mt-3'>
                                    <span className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-sm font-medium border border-green-500/20'>
                                        {courseInfo.discountCoupon} — {courseInfo.discountPercent}% OFF
                                        <IoClose
                                            className='cursor-pointer hover:text-red-400 transition-colors'
                                            size={16}
                                            onClick={() => {
                                                setCourseInfo({
                                                    ...courseInfo,
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

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className={labelClass}>Course Type</label>
                            <select
                                value={courseInfo.courseType}
                                className={inputClass}
                                onChange={(e: any) => setCourseInfo({ ...courseInfo, courseType: e.target.value })}
                            >
                                <option value="">Select course type</option>
                                <option value="Certificate Course">Certificate Course</option>
                                <option value="Academic Course">Academic Course</option>
                                <option value="Religious Course">Religious Course</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Course Categories</label>
                            <select
                                value={courseInfo.categories}
                                className={inputClass}
                                onChange={(e: any) => setCourseInfo({ ...courseInfo, categories: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map((item: any) => (
                                    <option value={item._id} key={item._id}>
                                        {item.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className={labelClass}>Course SubCategory</label>
                            <select
                                value={courseInfo.subCategory}
                                disabled={isEdit}
                                className={`${inputClass} ${isEdit ? "opacity-50 cursor-not-allowed" : ""}`}
                                onChange={(e: any) => setCourseInfo({ ...courseInfo, subCategory: e.target.value })}
                            >
                                <option value="">Select type</option>
                                <option value="Recorded">Recorded</option>
                                <option value="Live">Live</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Course Level</label>
                            <div className='flex items-center gap-2'>
                                <select
                                    value={courseInfo.level}
                                    className={`${inputClass} flex-1`}
                                    onChange={(e: any) => setCourseInfo({ ...courseInfo, level: e.target.value })}
                                >
                                    <option value="">From</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Expert">Expert</option>
                                </select>
                                <span className='text-text-basic font-medium'>To</span>
                                <select
                                    value={courseInfo.levelTo}
                                    className={`${inputClass} flex-1`}
                                    onChange={(e: any) => setCourseInfo({ ...courseInfo, levelTo: e.target.value })}
                                >
                                    <option value="">To</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='w-full'>
                        <label className={labelClass}>Course Tags</label>
                        <div className='relative'>
                            <input
                                type="text"
                                value={tagSearch}
                                placeholder='Search and add tags...'
                                className={inputClass}
                                onChange={(e) => {
                                    setTagSearch(e.target.value)
                                    setShowTagDropdown(true)
                                }}
                                onFocus={() => setShowTagDropdown(true)}
                                onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
                            />
                            {showTagDropdown && tagSearch && filteredTags.length > 0 && (
                                <div className='absolute top-full left-0 right-0 bg-background-Card_1 border border-[#ffffff1a] rounded-xl mt-1 max-h-40 overflow-y-auto z-50 shadow-xl'>
                                    {filteredTags.map((tag: any) => (
                                        <div
                                            key={tag._id}
                                            className='px-4 py-2.5 hover:bg-hover-bg-1 cursor-pointer text-text-basic text-sm transition-all'
                                            onMouseDown={() => addTag(tag.title)}
                                        >
                                            {tag.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {courseInfo.tags.length > 0 && (
                            <div className='flex flex-wrap gap-2 mt-3'>
                                {courseInfo.tags.map((tag: string, i: number) => (
                                    <span key={i} className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-hover-text-1/20 text-text-basic rounded-full text-sm font-medium'>
                                        {tag}
                                        <IoClose
                                            className='cursor-pointer hover:text-red-400 transition-colors'
                                            size={16}
                                            onClick={() => removeTag(tag)}
                                        />
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='w-full'>
                        <label className={labelClass}>General Source Links</label>
                        {courseInfo.sourceLinks.map((link: any, index: number) => (
                            <div key={index} className='flex items-center gap-2 mb-2'>
                                <div className='relative flex-1'>
                                    <input
                                        type="text"
                                        placeholder='Title (e.g. GitHub)'
                                        value={link.title}
                                        disabled={isEdit && linkLocks[index]}
                                        className={`${inputClass} ${isEdit && linkLocks[index] ? "opacity-50 cursor-not-allowed" : ""}`}
                                        onChange={(e) => updateSourceLink(index, "title", e.target.value)}
                                    />
                                    {isEdit && (
                                        <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                                            {linkLocks[index] ? (
                                                <RiPencilFill
                                                    size={16}
                                                    className="text-background-Icon_1 cursor-pointer"
                                                    onClick={() => toggleLinkLock(index)}
                                                />
                                            ) : (
                                                <IoClose
                                                    size={18}
                                                    className="text-red-400 cursor-pointer"
                                                    onClick={() => toggleLinkLock(index)}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className='relative flex-1'>
                                    <input
                                        type="text"
                                        placeholder='URL'
                                        value={link.url}
                                        disabled={isEdit && linkLocks[index]}
                                        className={`${inputClass} ${isEdit && linkLocks[index] ? "opacity-50 cursor-not-allowed" : ""}`}
                                        onChange={(e) => updateSourceLink(index, "url", e.target.value)}
                                    />
                                    {isEdit && (
                                        <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                                            {linkLocks[index] ? (
                                                <RiPencilFill
                                                    size={16}
                                                    className="text-background-Icon_1 cursor-pointer"
                                                    onClick={() => toggleLinkLock(index)}
                                                />
                                            ) : (
                                                <IoClose
                                                    size={18}
                                                    className="text-red-400 cursor-pointer"
                                                    onClick={() => toggleLinkLock(index)}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {(!isEdit || !linkLocks[index]) && (
                                    <button
                                        type='button'
                                        onClick={() => removeSourceLink(index)}
                                        className='text-red-400 hover:text-red-500 text-sm font-semibold shrink-0'
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type='button'
                            onClick={addSourceLink}
                            className='text-sm text-blue-400 hover:text-blue-300 font-semibold mt-1'
                        >
                            + Add Link
                        </button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className={labelClass}>Intro Video URL <span className="text-red-500">*</span></label>
                            <div className='relative'>
                                <input
                                    type="text"
                                    required
                                    value={courseInfo.demoUrl}
                                    placeholder='https://www.youtube.com/course-intro'
                                    disabled={isEdit && demoUrlLocked}
                                    className={`${inputClass} ${isEdit && demoUrlLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onChange={(e: any) => setCourseInfo({ ...courseInfo, demoUrl: e.target.value })}
                                />
                                {isEdit && (
                                    <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                                        {demoUrlLocked ? (
                                            <RiPencilFill
                                                size={16}
                                                className="text-background-Icon_1 cursor-pointer"
                                                onClick={() => setDemoUrlLocked(false)}
                                            />
                                        ) : (
                                            <IoClose
                                                size={18}
                                                className="text-red-400 cursor-pointer"
                                                onClick={() => setDemoUrlLocked(true)}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <label className={labelClass}>Course Thumbnail <span className="text-red-500">*</span></label>
                        <input
                            type="file"
                            accept='image/*'
                            id='file'
                            className='hidden'
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="file"
                            className={`w-full min-h-[200px] border-2 border-dashed border-gray-300 dark:border-white/40 hover:border-gray-400 dark:hover:border-white/60 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${dragging ? "bg-blue-500/10 border-blue-500" : "bg-[#E5E5E5] dark:bg-white/5 hover:bg-[#dedede] dark:hover:bg-white/10"}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {courseInfo.thumbnail ? (
                                <div className="relative w-[200px] h-[200px] mx-auto">
                                    <img
                                        src={courseInfo.thumbnail}
                                        alt="thumbnail"
                                        className='w-full h-full object-cover rounded-2xl shadow-lg'
                                    />
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className='text-text-basic font-medium'>Drop your 4x4 thumbnail here</p>
                                    <p className='text-xs opacity-60 mt-1'>Images will be automatically cropped to square</p>
                                    <p className='text-xs opacity-40 mt-1'>or click to browse from files</p>
                                </div>
                            )}
                        </label>
                    </div>

                    <div className='flex justify-end gap-4 pt-6'>
                        {handleSaveDraft && (
                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                className='w-full md:w-auto px-6 py-4 bg-background-Card_2 hover:bg-background-Card_2/80 text-text-basic font-bold rounded-2xl transition-all border border-[#ffffff1a] cursor-pointer active:scale-95 text-sm'
                            >
                                Save as Draft
                            </button>
                        )}
                        <button
                            type="submit"
                            className='w-full md:w-auto px-12 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer active:scale-95'
                        >
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CourseInfo
