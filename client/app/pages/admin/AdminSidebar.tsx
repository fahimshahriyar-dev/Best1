'use client'
import React, { FC, useState } from 'react'
import { usePathname } from 'next/navigation';

// image
import Image from 'next/image';
import avatarIcon from '../../../public/assests/avatar.png'

// icons
import { SlArrowLeft } from "react-icons/sl";
import { MdOutlineHome } from "react-icons/md";
import { MdGroups2 } from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import { BiSolidVideoPlus, BiSolidBookAdd } from "react-icons/bi";
import { MdLiveTv } from "react-icons/md";
import { MdSpaceDashboard, MdClass } from "react-icons/md";
import { BsFillPatchQuestionFill } from "react-icons/bs";
import { LuTouchpad } from "react-icons/lu";
import { RiGroupFill } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { PiChalkboardTeacherFill, PiCertificateFill } from "react-icons/pi";
import { MdAssignment, MdStorefront, MdLibraryBooks, MdCategory, MdLocalOffer, MdForum, MdSchool, MdBusiness } from "react-icons/md";
import { SiCoursera } from 'react-icons/si';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useSignOutQuery } from '@/redux/features/auth/authApi';
import { translations } from '../../utils/translations';

import AnimatedPopup from "../../components/AnimatedPopup";
import { signOut } from 'next-auth/react';
import { IoClose } from 'react-icons/io5';
import { ADMIN_SIDEBAR_TOGGLE_EVENT } from '../../utils/adminSidebar';

type Props = {
    avatar?: string | null;
    user: any;
    isCollapsed: boolean;
    setIsCollapsed: (val: boolean) => void;
};

const AdminSidebar: FC<Props> = ({ avatar, user, isCollapsed, setIsCollapsed }) => {
    const pathname = usePathname();
    const { language } = useSelector((state: any) => state.language);
    const [logoutModal, setLogoutModal] = useState(false);
    const [signout, setSignout] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const { } = useSignOutQuery(undefined, {
        skip: !signout ? true : false,
    });

    React.useEffect(() => {
        const handleToggle = () => {
            setIsMobileOpen((prev) => !prev);
            setIsCollapsed(false);
        };
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsMobileOpen(false);
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMobileOpen(false);
        };
        window.addEventListener(ADMIN_SIDEBAR_TOGGLE_EVENT, handleToggle);
        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener(ADMIN_SIDEBAR_TOGGLE_EVENT, handleToggle);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [setIsCollapsed]);

    React.useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const signOutHandler = async () => {
        setSignout(true);
        setLogoutModal(false);
        await signOut({ redirect: false });
    };

    const isActive = (path: string) => {
        if (path === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(path);
    };

    const activeItemStyle = 'bg-hover-bg-1';
    const sidebarRef = React.useRef<HTMLDivElement>(null);

    React.useLayoutEffect(() => {
        const savedScroll = sessionStorage.getItem('admin_sidebar_scroll');
        if (savedScroll && sidebarRef.current) {
            const scrollPos = Number(savedScroll);
            sidebarRef.current.scrollTop = scrollPos;
            requestAnimationFrame(() => {
                if (sidebarRef.current) {
                    sidebarRef.current.scrollTop = scrollPos;
                }
            });
        }
    }, [pathname]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        sessionStorage.setItem('admin_sidebar_scroll', String(e.currentTarget.scrollTop));
    };

    return (
        <>
            <div
                onClick={() => setIsMobileOpen(false)}
                className={`fixed inset-0 z-[110] bg-black/50 transition-opacity duration-300 lg:hidden ${isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            />
            <div
                ref={sidebarRef}
                onScroll={handleScroll}
                className={`fixed right-0 lg:right-auto lg:left-0 top-0 z-[120] h-screen w-[280px] sm:w-[300px] max-w-[85vw] ${
                    isCollapsed
                        ? "lg:w-[80px] xl:w-[90px] 2xl:w-[100px] lg:px-3 xl:px-4"
                        : "lg:w-[220px] xl:w-[250px] 2xl:w-[280px] lg:px-4 xl:px-6 2xl:px-8"
                } overflow-y-auto bg-background-Card_1 px-6 sm:px-8 pt-7 text-text-basic custom-scrollbar transition-all duration-300 shadow-2xl lg:shadow-none ${
                    isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
                }`}
            >
                <button
                    type="button"
                    onClick={() => setIsMobileOpen(false)}
                    aria-label="Close sidebar"
                    className="lg:hidden absolute top-4 left-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 text-text-basic transition-all"
                >
                    <IoClose size={20} />
                </button>
            {/* sidebar-header */}
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} pl-10 lg:pl-0 pr-2 lg:pr-0`}>
                {
                    !isCollapsed && (
                        <Link href="/">
                            <h2 className='font-bold text-2xl xl:text-3xl tracking-tight cursor-pointer truncate'>E-Learning</h2>
                        </Link>
                    )
                }
                <SlArrowLeft
                    fontSize={22}
                    fontWeight={800} 
                    className={`hidden lg:block cursor-pointer transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
                    onClick={() => setIsCollapsed(!isCollapsed)}/>
            </div>

            {/* admin info */}
            {
                !isCollapsed && (
                    <div className='mt-8 text-center'>
                        <Image
                            src={user.avatar || avatar ? user.avatar.url || avatar : avatarIcon}
                            alt="User Avatar"
                            width={80}
                            height={80}
                            className="rounded-full border-[3px] border-[#37a39a] mx-auto"
                        />
                        <h1 className='text-xl font-medium mt-3 capitalize'>{user.name}</h1>
                        <h3 className='text-lg font-bold capitalize'>({user.role})</h3>
                    </div>
                )
            }

            {/* items */}
            <div>
                {/* dashboard */}
                <Link 
                    href="/admin"
                    className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden mt-7 parent cursor-pointer ${isActive('/admin') ? activeItemStyle : ''}`}
                >
                    <MdOutlineHome className='iconShake shrink-0 text-xl xl:text-2xl'/>
                    {
                        !isCollapsed && (
                            <h4 className="truncate whitespace-nowrap">Dashboard</h4>
                        )
                    }
                </Link>

                {/* data */}
                <div>
                    {
                        !isCollapsed && (
                            <h2 className='text-xl font-medium mt-3'>Data</h2>
                        )
                    }
                    {/* users */}
                    <Link
                        href="/admin/users"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/users') ? activeItemStyle : ''}`}
                    >
                        <MdGroups2 className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Users</h4>
                            )
                        }
                    </Link>
                    {/* invoices */}
                    <Link
                        href="/admin/invoices"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/invoices') ? activeItemStyle : ''}`}
                    >
                        <CgNotes className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Invoices</h4>
                            )
                        }
                    </Link>
                </div>

                {/* courses */}
                <div>
                    {
                        !isCollapsed && (
                            <h2 className='text-xl font-medium mt-3'>Courses</h2>
                        )
                    }
                    {/* Add course */}
                    <Link 
                        href="/admin/create-course"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/create-course') ? activeItemStyle : ''}`}
                    >
                        <BiSolidVideoPlus className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Add Course</h4>
                            )
                        }
                    </Link>
                    {/* all courses */}
                    <Link 
                        href="/admin/courses"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/courses') ? activeItemStyle : ''}`}
                    >
                        <SiCoursera className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">All Courses</h4>
                            )
                        }
                    </Link>
                </div>

                {/* e-books */}
                <div>
                    {
                        !isCollapsed && (
                            <h2 className='text-xl font-medium mt-3'>E-Books</h2>
                        )
                    }
                    {/* add e-book */}
                    <Link 
                        href="/admin/create-ebook"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/create-ebook') ? activeItemStyle : ''}`}
                    >
                        <BiSolidBookAdd className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Add E-Book</h4>
                            )
                        }
                    </Link>
                    {/* all e-books */}
                    <Link 
                        href="/admin/ebooks"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/ebooks') ? activeItemStyle : ''}`}
                    >
                        <MdLibraryBooks className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">All E-Books</h4>
                            )
                        }
                    </Link>
                </div>

                {/* training */}
                <div>
                    {
                        !isCollapsed && (
                            <h2 className='text-xl font-medium mt-3'>Training</h2>
                        )
                    }
                    {/* add training */}
                    <Link 
                        href="/admin/create-training"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/create-training') ? activeItemStyle : ''}`}
                    >
                        <PiCertificateFill className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Add Training</h4>
                            )
                        }
                    </Link>
                    {/* all trainings */}
                    <Link 
                        href="/admin/trainings"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/trainings') ? activeItemStyle : ''}`}
                    >
                        <MdSchool className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">All Trainings</h4>
                            )
                        }
                    </Link>
                </div>

                {/* customization */}
                <div>
                    {
                        !isCollapsed && (
                            <h2 className='text-xl font-medium mt-3'>Customization</h2>
                        )
                    }
                    {/* faq */}
                    <Link 
                        href="/admin/faq"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/faq') ? activeItemStyle : ''}`}
                    >
                        <BsFillPatchQuestionFill className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">FAQ</h4>
                            )
                        }
                    </Link>
                    {/* discount coupons */}
                    <Link 
                        href="/admin/discount-coupons"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/discount-coupons') ? activeItemStyle : ''}`}
                    >
                        <MdLocalOffer className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Discount Coupons</h4>
                            )
                        }
                    </Link>
                    {/* companies */}
                    <Link 
                        href="/admin/companies"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/companies') ? activeItemStyle : ''}`}
                    >
                        <MdBusiness className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Companies</h4>
                            )
                        }
                    </Link>
                </div>

                {/* categories */}
                <div>
                    {
                        !isCollapsed && (
                            <h2 className='text-xl font-medium mt-3'>Categories</h2>
                        )
                    }
                    {/* course categories */}
                    <Link 
                        href="/admin/categories"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/categories') ? activeItemStyle : ''}`}
                    >
                        <MdCategory className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Course Categories</h4>
                            )
                        }
                    </Link>
                    {/* ebook categories */}
                    <Link 
                        href="/admin/ebook-categories"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/ebook-categories') ? activeItemStyle : ''}`}
                    >
                        <MdCategory className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">E-Book Categories</h4>
                            )
                        }
                    </Link>
                </div>

                {/* tags */}
                <div>
                    {
                        !isCollapsed && (
                            <h2 className='text-xl font-medium mt-3'>Tags</h2>
                        )
                    }
                    <Link 
                        href="/admin/learning-goal-tags"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/learning-goal-tags') ? activeItemStyle : ''}`}
                    >
                        <MdLocalOffer className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Learning Goal Tags</h4>
                            )
                        }
                    </Link>
                    <Link 
                        href="/admin/course-tags"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/course-tags') ? activeItemStyle : ''}`}
                    >
                        <MdLocalOffer className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Course Tags</h4>
                            )
                        }
                    </Link>
                    <Link 
                        href="/admin/ebook-tags"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/ebook-tags') ? activeItemStyle : ''}`}
                    >
                        <MdLocalOffer className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">E-book Tags</h4>
                            )
                        }
                    </Link>
                </div>

                {/* controllers */}
                <div>
                    {
                        !isCollapsed && (
                            <h2 className='text-xl font-medium mt-3'>Controllers</h2>
                        )
                    }
                    {/* manage team */}
                    <Link 
                        href="/admin/team"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/team') ? activeItemStyle : ''}`}>
                        <RiGroupFill className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Manage Team</h4>
                            )
                        }
                    </Link>
                    {/* teacher forms */}
                    <Link
                        href="/admin/teacher-applications"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/teacher-applications') ? activeItemStyle : ''}`}
                    >
                        <PiChalkboardTeacherFill className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Teacher Forms</h4>
                            )
                        }
                    </Link>
                    {/* seller forms */}
                    <Link
                        href="/admin/seller-applications"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/seller-applications') ? activeItemStyle : ''}`}
                    >
                        <MdStorefront className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Seller Forms</h4>
                            )
                        }
                    </Link>
                    {/* consultancy */}
                    <Link
                        href="/admin/consultancy"
                        className={`flex items-center gap-2.5 xl:gap-3 text-sm xl:text-base 2xl:text-lg hover:bg-hover-bg-1 transition-all rounded-lg p-2 overflow-hidden parent cursor-pointer ${isActive('/admin/consultancy') ? activeItemStyle : ''}`}
                    >
                        <MdForum className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Consultancy</h4>
                            )
                        }
                    </Link>
                </div>

                {/* extras */}
                <div>
                    {
                        !isCollapsed && (
                            <h2 className='text-xl font-medium mt-3'>Extras</h2>
                        )
                    }
                    {/* logout */}
                    <div 
                        className='flex items-center gap-3 text-lg hover:bg-red-500/10 transition-all rounded p-2 parent cursor-pointer text-text-basic'
                        onClick={() => setLogoutModal(true)}
                    >
                        <TbLogout className='iconShake shrink-0 text-xl xl:text-2xl'/>
                        {
                            !isCollapsed && (
                                <h4 className="truncate whitespace-nowrap">Logout</h4>
                            )
                        }
                    </div>
                </div>
            </div>
            </div>

            {/* Logout Confirmation Modal */}
            <AnimatedPopup isOpen={logoutModal} onClose={() => setLogoutModal(false)} zIndex={100} overlayClassName="bg-black/50">
                <div className="bg-background-Card_1 border border-[#ffffff1d] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                        <TbLogout size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-text-basic text-center mb-2">
                        {translations[language].sign_out}
                    </h3>
                    <p className="text-sm text-text-basic opacity-60 text-center mb-6">
                        Are you sure you want to log out of the admin panel?
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setLogoutModal(false)}
                            className="flex-1 py-3 rounded-xl border border-text-input/20 text-text-basic hover:bg-black/5 dark:hover:bg-white/5 transition-all text-sm font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={signOutHandler}
                            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all text-sm font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </AnimatedPopup>
        </>
    )
}

export default AdminSidebar