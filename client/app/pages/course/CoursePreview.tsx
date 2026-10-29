'use client'
import CoursePlayer from '../../../app/utils/CoursePlayer';
import Ratings from '../../../app/utils/Ratings';
import React, { FC } from 'react'
import { FiCheckCircle, FiClock, FiUsers, FiCalendar, FiMonitor, FiUserCheck, FiBookOpen } from "react-icons/fi";

type Props = {
    courseData: any;
    handleCreateCourse: any;
    handleSaveDraft?: any;
    active: number;
    setActive: (active: number) => void;
    isEdit?: boolean;
}

const CoursePreview: FC<Props> = ({ courseData, handleCreateCourse, handleSaveDraft, active, setActive, isEdit }) =>  {
    const prevBtn = () => {
        setActive(active - 1);
    }

    const createCourse = () => {
        handleCreateCourse();
    }

    const isLive = courseData?.subCategory === "Live";

    return (
        <div className='w-full py-5 mb-5'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-6 bg-background-Card_1/50 rounded-2xl p-6 border border-[#ffffff12]'>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isLive ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"}`}>
                    {isLive ? <FiMonitor size={28} /> : <FiBookOpen size={28} />}
                </div>
                <div>
                    <h2 className='text-xl font-bold text-text-basic'>{courseData?.name}</h2>
                    <div className='flex items-center gap-3 mt-1'>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isLive ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"}`}>
                            {isLive ? "Live Course" : "Recorded Course"}
                        </span>
                        <span className='text-xs opacity-50'>{courseData?.courseType}</span>
                    </div>
                </div>
            </div>

            {/* Main media / info hero */}
            {isLive ? (
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                    <div className='md:col-span-2 bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl p-6 border border-orange-500/20'>
                        <div className='flex items-center gap-3 mb-4'>
                            <FiCalendar size={24} className='text-orange-400' />
                            <h3 className='text-lg font-bold text-text-basic'>Schedule & Teachers</h3>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            {courseData?.daysOfWeek?.length > 0 && (
                                <div className='bg-background-Card_1 rounded-xl p-4 border border-[#ffffff12]'>
                                    <FiClock className='text-orange-400 mb-2' size={20} />
                                    <p className='text-sm font-semibold text-text-basic'>Schedule</p>
                                    <p className='text-xs opacity-60'>{courseData.daysOfWeek.join(", ")}</p>
                                    <p className='text-xs opacity-60'>{courseData.daysPerWeek}x per week</p>
                                </div>
                            )}
                            {courseData?.teachers?.length > 0 && (
                                <div className='bg-background-Card_1 rounded-xl p-4 border border-[#ffffff12]'>
                                    <FiUserCheck className='text-orange-400 mb-2' size={20} />
                                    <p className='text-sm font-semibold text-text-basic'>Teachers</p>
                                    <p className='text-xs opacity-60'>{courseData.teachers.length} assigned</p>
                                </div>
                            )}
                            {courseData?.courseData?.length > 0 && (
                                <div className='bg-background-Card_1 rounded-xl p-4 border border-[#ffffff12]'>
                                    <FiCalendar className='text-orange-400 mb-2' size={20} />
                                    <p className='text-sm font-semibold text-text-basic'>Sessions</p>
                                    <p className='text-xs opacity-60'>{courseData.courseData.length} sessions planned</p>
                                </div>
                            )}
                            {courseData?.maxStudents && (
                                <div className='bg-background-Card_1 rounded-xl p-4 border border-[#ffffff12]'>
                                    <FiUsers className='text-orange-400 mb-2' size={20} />
                                    <p className='text-sm font-semibold text-text-basic'>Student Limit</p>
                                    <p className='text-xs opacity-60'>Max {courseData.maxStudents} students</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='bg-background-Card_1 rounded-2xl p-6 border border-[#ffffff12]'>
                        <h3 className='text-sm font-semibold opacity-60 mb-3'>Pricing</h3>
                        <div className='flex items-baseline gap-2'>
                            <span className='text-3xl font-bold text-text-basic'>{courseData?.price === 0 ? "Free" : courseData?.price + "৳"}</span>
                            {courseData?.discountCoupon && (
                                <span className='text-sm text-green-400 font-medium'>({courseData.discountCoupon} — {courseData.discountPercent}% OFF)</span>
                            )}
                        </div>
                        <div className='mt-4 flex flex-wrap gap-2'>
                            <span className='px-3 py-1 bg-hover-text-1/20 text-text-basic rounded-full text-xs font-medium'>{courseData?.courseType}</span>
                            <span className='px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium'>Live</span>
                            <span className='px-3 py-1 bg-hover-text-1/20 text-text-basic rounded-full text-xs font-medium'>{courseData?.level}{courseData?.levelTo ? ` → ${courseData.levelTo}` : ""}</span>
                        </div>
                        <div className='flex items-center gap-2 mt-4 pt-4 border-t border-[#ffffff12]'>
                            <Ratings rating={0} />
                            <span className='text-xs opacity-50'>0 Reviews</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                    <div className='md:col-span-2'>
                        <div className='rounded-2xl overflow-hidden border border-[#ffffff12]'>
                            <CoursePlayer
                                videoUrl={courseData?.demoUrl}
                                title={courseData?.name}
                            />
                        </div>
                    </div>
                    <div className='bg-background-Card_1 rounded-2xl p-6 border border-[#ffffff12] h-fit sticky top-24'>
                        <h3 className='text-sm font-semibold opacity-60 mb-3'>Pricing</h3>
                        <div className='flex items-baseline gap-2'>
                            <span className='text-3xl font-bold text-text-basic'>{courseData?.price === 0 ? "Free" : courseData?.price + "৳"}</span>
                            {courseData?.discountCoupon && (
                                <span className='text-sm text-green-400 font-medium'>({courseData.discountCoupon} — {courseData.discountPercent}% OFF)</span>
                            )}
                        </div>
                        <div className='mt-4 flex flex-wrap gap-2'>
                            <span className='px-3 py-1 bg-hover-text-1/20 text-text-basic rounded-full text-xs font-medium'>{courseData?.courseType}</span>
                            <span className='px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium'>Recorded</span>
                            <span className='px-3 py-1 bg-hover-text-1/20 text-text-basic rounded-full text-xs font-medium'>{courseData?.level}{courseData?.levelTo ? ` → ${courseData.levelTo}` : ""}</span>
                        </div>
                        <div className='flex items-center gap-2 mt-4 pt-4 border-t border-[#ffffff12]'>
                            <Ratings rating={0} />
                            <span className='text-xs opacity-50'>0 Reviews</span>
                        </div>
                        {courseData?.courseData?.length > 0 && (
                            <div className='flex items-center gap-2 mt-3 text-xs opacity-60'>
                                <FiBookOpen size={14} />
                                <span>{courseData.courseData.length} Lectures</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tags */}
            {courseData?.tags?.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-6'>
                    {courseData.tags.map((tag: string, i: number) => (
                        <span key={i} className='px-2.5 py-1 bg-white/10 text-text-basic rounded-md text-xs font-medium'>
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Benefits */}
            {courseData?.benefits?.length > 0 && (
            <div className='bg-background-Card_1/30 rounded-2xl p-6 border border-[#ffffff12] mb-6'>
                <h3 className='text-lg font-bold text-text-basic mb-4'>What you will learn from this course?</h3>
                <div className='space-y-3'>
                    {courseData?.benefits?.map((item: any, index: number) => (
                        <div key={index} className='flex items-start gap-3'>
                            <FiCheckCircle className='text-green-400 mt-0.5 shrink-0' size={18} />
                            <span className='text-sm text-text-basic'>{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>
            )}

            {/* Prerequisites */}
            {courseData?.prerequisites?.length > 0 && (
            <div className='bg-background-Card_1/30 rounded-2xl p-6 border border-[#ffffff12] mb-6'>
                <h3 className='text-lg font-bold text-text-basic mb-4'>Prerequisites</h3>
                <div className='space-y-3'>
                    {courseData?.prerequisites?.map((item: any, index: number) => (
                        <div key={index} className='flex items-start gap-3'>
                            <FiCheckCircle className='text-blue-400 mt-0.5 shrink-0' size={18} />
                            <span className='text-sm text-text-basic'>{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>
            )}

            {/* Description */}
            <div className='bg-background-Card_1/30 rounded-2xl p-6 border border-[#ffffff12] mb-6'>
                <h3 className='text-lg font-bold text-text-basic mb-4'>Course Details</h3>
                <p className='text-sm text-text-basic/80 leading-relaxed whitespace-pre-line'>
                    {courseData?.description}
                </p>
            </div>

            {/* Recorded: Source Links */}
            {!isLive && courseData?.sourceLinks?.length > 0 && (
                <div className='bg-background-Card_1/30 rounded-2xl p-6 border border-[#ffffff12] mb-6'>
                    <h3 className='text-lg font-bold text-text-basic mb-4'>Source Links</h3>
                    <div className='space-y-2'>
                        {courseData.sourceLinks.map((link: any, i: number) => (
                            <div key={i} className='flex items-center gap-2'>
                                <span className='text-sm font-medium text-text-basic'>{link.title}:</span>
                                <span className='text-sm text-blue-400 break-all'>{link.url}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Prev / Save / Create */}
            <div className='flex justify-between gap-4 pt-8 mt-8 border-t border-[#ffffff1a]'>
                <button
                    className='w-full md:w-auto px-8 py-4 bg-background-Card_2 hover:bg-background-Card_2/80 text-text-basic font-bold rounded-2xl transition-all border border-[#ffffff1a] cursor-pointer active:scale-95'
                    onClick={() => prevBtn()}
                >
                    Prev
                </button>
                <div className='flex items-center gap-4'>
                    {!isEdit && handleSaveDraft && (
                    <button
                        className='w-full md:w-auto px-8 py-4 bg-background-Card_2 hover:bg-background-Card_2/80 text-text-basic font-bold rounded-2xl transition-all border border-[#ffffff1a] cursor-pointer active:scale-95'
                        onClick={() => handleSaveDraft()}
                    >
                        Save as Draft
                    </button>
                )}
                <button
                    className='w-full md:w-auto px-12 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer active:scale-95'
                    onClick={() => createCourse()}
                >
                    {isEdit ? "Update" : "Create"}
                </button>
                </div>
            </div>
        </div>
    )
}

export default CoursePreview
