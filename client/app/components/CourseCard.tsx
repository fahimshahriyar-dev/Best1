import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react'
import Ratings from '../utils/Ratings';
import { FiCalendar, FiMonitor, FiBookOpen, FiUsers } from 'react-icons/fi';
import { useSelector } from 'react-redux';

type Props = {
    item: any;
    isProfile?: boolean
}

const CourseCard: FC<Props> = ({ item, isProfile }) => {
    const { user } = useSelector((state: any) => state.auth);
    const isPurchased = user && user?.courses?.some((course: any) => course.courseId?.toString() === item._id?.toString());
    const isStaff = user && (user.role === "superadmin" || user.role === "admin" || user.role === "moderator" || user.role === "teacher");
    const isLive = item.subCategory === "Live";

    return (
        <Link href={isStaff || isProfile ? `/course-access/${item._id}` : `/course/${item._id}`}>
            <div className='w-full min-h-[35vh] rounded-xl p-4 shadow-xl !bg-background-Card_1 border border-[#ffffff12] hover:border-[#ffffff30] transition-all duration-300 flex flex-col'>
                {/* Thumbnail */}
                <div className='relative'>
                    {item.thumbnail?.url ? (
                        <Image src={item.thumbnail.url} width={500} height={280} objectFit='contain' className='rounded-lg w-full' alt=''/>
                    ) : (
                        <div className='w-full h-[200px] bg-gray-700/50 rounded-lg flex items-center justify-center'>
                            <span className='text-gray-400 text-sm'>No thumbnail</span>
                        </div>
                    )}
                    {/* Badge */}
                    <span className={`absolute top-3 left-3 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg ${
                        isLive
                            ? "bg-orange-500 text-white"
                            : "bg-blue-500 text-white"
                    }`}>
                        {isLive ? "LIVE" : "RECORDED"}
                    </span>
                </div>

                <div className='flex-1 flex flex-col mt-4'>
                    <h1 className='font-Poppins font-semibold text-[16px] text-text-basic leading-snug line-clamp-2'>
                        {item.name}
                    </h1>

                    {/* Type & Level */}
                    <div className='flex flex-wrap gap-2 mt-3'>
                        <span className='text-[11px] px-2.5 py-1 bg-hover-text-1/20 text-text-basic rounded-full font-medium'>
                            {item.courseType}
                        </span>
                        <span className='text-[11px] px-2.5 py-1 bg-hover-text-1/20 text-text-basic rounded-full font-medium'>
                            {item.level}{item.levelTo ? ` → ${item.levelTo}` : ""}
                        </span>
                    </div>

                    {/* Rating & Students */}
                    <div className='flex items-center justify-between mt-3'>
                        <div className='flex items-center gap-1'>
                            <Ratings rating={item.ratings}/>
                        </div>
                        <span className='text-xs text-text-basic/60 flex items-center gap-1'>
                            <FiUsers size={13} />
                            {item.purchased || 0}
                        </span>
                    </div>

                    {/* Divider */}
                    <div className='border-t border-[#ffffff12] my-3' />

                    {/* Bottom row: info + price */}
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-1.5 text-xs text-text-basic/60'>
                            {isLive ? (
                                <>
                                    <FiCalendar size={13} />
                                    <span>{item.courseData?.length || 0} Sessions</span>
                                </>
                            ) : (
                                <>
                                    <FiBookOpen size={13} />
                                    <span>{item.courseData?.length || 0} Lectures</span>
                                </>
                            )}
                        </div>
                        <h3 className='text-base font-bold text-text-basic'>
                            {isPurchased && !isProfile ? "Purchased" : item.price === 0 ? "Free" : "৳" + item.price}
                        </h3>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default CourseCard
