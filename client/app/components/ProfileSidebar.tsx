"use client";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useSignOutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";

import Image from "next/image";
import avatarDefault from "../../public/assests/avatar.png";

import { MdOutlineAdminPanelSettings, MdClass, MdExpandMore, MdExpandLess, MdStorefront, MdLibraryBooks, MdForum } from "react-icons/md";
import { FiChevronRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { PiBookOpenTextFill, PiChalkboardTeacherFill, PiPaperPlaneTiltFill, PiPasswordFill, PiSignOutDuotone } from "react-icons/pi";
import { SiCoursera } from "react-icons/si";

import { useSelector } from "react-redux";
import { translations } from "../utils/translations";

import AnimatedPopup from "./AnimatedPopup";

type Props = {
    user: any;
};

const ProfileSidebar: FC<Props> = ({ user }) => {
    const { language } = useSelector((state: any) => state.language);
    const pathname = usePathname();
    const [scroll, setScroll] = useState(false);
    const [signout, setSignout] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const {} = useSignOutQuery(undefined, {
        skip: !signout ? true : false,
    });

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 85) {
                setScroll(true);
            } else {
                setScroll(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setSidebarOpen(false);
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSidebarOpen(false);
        };
        window.addEventListener("resize", handleResize);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const signOutHandler = async () => {
        setSignout(true);
        setLogoutModal(false);
        await signOut({ redirect: false });
    };

    const isActive = (path: string) => pathname === path;
    const isEnrollmentActive = pathname.startsWith("/profile/enrolled-");
    const isApplyActive = pathname === "/profile/apply-teacher" || pathname === "/profile/apply-seller" || pathname === "/profile/apply-consultancy";

    const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(isEnrollmentActive);
    const [isApplyOpen, setIsApplyOpen] = useState(isApplyActive);

    useEffect(() => {
        if (isEnrollmentActive) setIsEnrollmentOpen(true);
    }, [pathname]);

    useEffect(() => {
        if (isApplyActive) setIsApplyOpen(true);
    }, [pathname]);

    const avatarSrc = typeof user?.avatar === "string"
        ? user.avatar
        : user?.avatar?.url || avatarDefault;

    return (
        <>
            <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open profile menu"
                className="lg:hidden fixed left-[15px] top-[92px] z-40 w-11 h-11 flex items-center justify-center rounded-xl bg-background-Card_1 border border-[#ffffff1d] shadow-lg text-text-basic"
            >
                <FiChevronRight size={24} />
            </button>

            <div
                onClick={() => setSidebarOpen(false)}
                className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            />

            <div className="w-0 lg:w-[310px] flex-shrink-0">
                <div
                    className={`fixed lg:sticky left-0 lg:left-auto top-[100px] w-[280px] sm:w-[310px] lg:w-[310px] h-[calc(100vh-120px)] bg-background-Card_1 bg-opacity-90 border border-[#ffffff1d] rounded-2xl transition-all duration-300 z-50 lg:z-10 overflow-y-auto custom-scrollbar ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
                >
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close profile menu"
                        className="lg:hidden absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-text-basic transition-colors"
                    >
                        <IoClose size={20} />
                    </button>

                    <div className="w-full">
                        {/* my account */}
                        <Link
                            href="/profile"
                            className={`w-full flex items-center px-3 py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${isActive("/profile") ? "bg-black/10 dark:bg-white/20 border-r-4 border-hover-text-1" : ""}`}
                        >
                            <Image
                                src={avatarSrc}
                                alt="Profile"
                                width={20}
                                height={20}
                                className="sm:w-[30px] sm:h-[30px] cursor-pointer rounded-full"
                            />
                            <h5 className="pl-2 block font-Poppins text-text-basic">
                                {translations[language].my_account}
                            </h5>
                        </Link>

                        {/* change password */}
                        <Link
                            href="/profile/change-password"
                            className={`w-full flex items-center px-3 py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${isActive("/profile/change-password") ? "bg-black/10 dark:bg-white/20 border-r-4 border-hover-text-1" : ""}`}
                        >
                            <PiPasswordFill
                                size={20}
                                className="text-text-basic"
                            />
                            <h5 className="pl-2 block font-Poppins text-text-basic">
                                {translations[language].change_password}
                            </h5>
                        </Link>

                        {/* enrollments dropdown */}
                        {user.role !== "superadmin" && user.role !== "admin" && user.role !== "moderator" && (
                            <>
                                <div
                                    className={`w-full flex items-center justify-between px-3 py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${isEnrollmentActive ? "bg-black/10 dark:bg-white/20 border-r-4 border-hover-text-1" : ""}`}
                                    onClick={() => setIsEnrollmentOpen(!isEnrollmentOpen)}
                                >
                                    <div className="flex items-center">
                                        <PiBookOpenTextFill size={20} className="text-text-basic" />
                                        <h5 className="pl-2 block font-Poppins text-text-basic">
                                            {translations[language].enrollments}
                                        </h5>
                                    </div>
                                    <div className="block text-text-basic">
                                        {isEnrollmentOpen ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                                    </div>
                                </div>

                                <div className={`transition-all duration-300 overflow-hidden ${isEnrollmentOpen ? "max-h-[200px]" : "max-h-0"}`}>
                                    <Link
                                        href="/profile/enrolled-courses"
                                        className={`w-full flex items-center px-8 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${isActive("/profile/enrolled-courses") ? "text-hover-text-1 font-semibold" : "text-text-basic opacity-80"}`}
                                    >
                                        <SiCoursera size={16} />
                                        <h5 className="pl-2 block font-Poppins text-[14px]">
                                            {translations[language].enrolled_courses}
                                        </h5>
                                    </Link>

                                    <Link
                                        href="/profile/enrolled-live-courses"
                                        className={`w-full flex items-center px-8 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${isActive("/profile/enrolled-live-courses") ? "text-hover-text-1 font-semibold" : "text-text-basic opacity-80"}`}
                                    >
                                        <MdClass size={16} />
                                        <h5 className="pl-2 block font-Poppins text-[14px]">
                                            {translations[language].enrolled_live_courses}
                                        </h5>
                                    </Link>

                                    <Link
                                        href="/profile/enrolled-ebooks"
                                        className={`w-full flex items-center px-8 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${isActive("/profile/enrolled-ebooks") ? "text-hover-text-1 font-semibold" : "text-text-basic opacity-80"}`}
                                    >
                                        <MdLibraryBooks size={16} />
                                        <h5 className="pl-2 block font-Poppins text-[14px]">
                                            {translations[language].enrolled_ebooks}
                                        </h5>
                                    </Link>
                                </div>
                            </>
                        )}

                        {/* manage live courses for staff */}
                        {(user.role === "superadmin" || user.role === "admin" || user.role === "moderator" || user.role === "teacher") && (
                            <Link
                                href="/profile/manage-live-courses"
                                className={`w-full flex items-center px-3 py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${isActive("/profile/manage-live-courses") ? "bg-black/10 dark:bg-white/20 border-r-4 border-hover-text-1" : ""}`}
                            >
                                <MdClass size={20} className="text-text-basic" />
                                <h5 className="pl-2 block font-Poppins text-text-basic">
                                    {translations[language].manage_live_course}
                                </h5>
                            </Link>
                        )}

                        {/* apply dropdown — only for normal users */}
                        {user && (user.role !== "superadmin" && user.role !== "admin" && user.role !== "moderator" && user.role !== "teacher") && (
                            <>
                                <div
                                    className={`w-full flex items-center justify-between px-3 py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${isApplyActive ? "bg-black/10 dark:bg-white/20 border-r-4 border-hover-text-1" : ""}`}
                                    onClick={() => setIsApplyOpen(!isApplyOpen)}
                                >
                                    <div className="flex items-center">
                                        <PiPaperPlaneTiltFill size={20} className="text-text-basic" />
                                        <h5 className="pl-2 block font-Poppins text-text-basic">
                                            {translations[language].apply}
                                        </h5>
                                    </div>
                                    <div className="block text-text-basic">
                                        {isApplyOpen ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                                    </div>
                                </div>

                                <div className={`transition-all duration-300 overflow-hidden ${isApplyOpen ? "max-h-[200px]" : "max-h-0"}`}>
                                    <Link
                                        href="/profile/apply-teacher"
                                        className={`w-full flex items-center px-8 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${isActive("/profile/apply-teacher") ? "text-hover-text-1 font-semibold" : "text-text-basic opacity-80"}`}
                                    >
                                        <PiChalkboardTeacherFill size={16} />
                                        <h5 className="pl-2 block font-Poppins text-[14px]">
                                            {translations[language].apply_teacher}
                                        </h5>
                                    </Link>
                                    <Link
                                        href="/profile/apply-seller"
                                        className={`w-full flex items-center px-8 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${isActive("/profile/apply-seller") ? "text-hover-text-1 font-semibold" : "text-text-basic opacity-80"}`}
                                    >
                                        <MdStorefront size={16} />
                                        <h5 className="pl-2 block font-Poppins text-[14px]">
                                            Apply for Seller
                                        </h5>
                                    </Link>
                                    <Link
                                        href="/profile/apply-consultancy"
                                        className={`w-full flex items-center px-8 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${isActive("/profile/apply-consultancy") ? "text-hover-text-1 font-semibold" : "text-text-basic opacity-80"}`}
                                    >
                                        <MdForum size={16} />
                                        <h5 className="pl-2 block font-Poppins text-[14px]">
                                            Consultancy
                                        </h5>
                                    </Link>
                                </div>
                            </>
                        )}

                        {/* admin dashboard */}
                        {(user.role === "superadmin" || user.role === "admin" || user.role === "moderator") && (
                            <Link
                                className="w-full flex items-center px-3 py-4 cursor-pointer"
                                href={"/admin"}
                            >
                                <MdOutlineAdminPanelSettings
                                    size={20}
                                    className="text-text-basic"
                                />
                                <h5 className="pl-2 block font-Poppins text-text-basic">
                                    {translations[language].admin_dashboard}
                                </h5>
                            </Link>
                        )}

                        {/* sign out */}
                        <div
                            className="w-full flex items-center px-3 py-4 cursor-pointer hover:bg-red-500/10 transition-all"
                            onClick={() => setLogoutModal(true)}
                        >
                            <PiSignOutDuotone
                                size={20}
                                className="text-text-basic"
                            />
                            <h5 className="pl-2 block font-Poppins text-text-basic">
                                {translations[language].sign_out}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <AnimatedPopup isOpen={logoutModal} onClose={() => setLogoutModal(false)} zIndex={100} overlayClassName="bg-black/50">
                <div className="bg-background-Card_1 border border-[#ffffff1d] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                        <PiSignOutDuotone size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-text-basic text-center mb-2">
                        {translations[language].sign_out}
                    </h3>
                    <p className="text-sm text-text-basic opacity-60 text-center mb-6">
                        Are you sure you want to log out of your account?
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
    );
};

export default ProfileSidebar;
