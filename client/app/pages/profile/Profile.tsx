"use client";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

// hooks
import { useSignOutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";

// pages
import ProfileInfo from "./ProfileInfo";

// images
import Image from "next/image";
import avatarDefault from "../../../public/assests/avatar.png";

// icons
import { MdOutlineAdminPanelSettings, MdClass, MdExpandMore, MdExpandLess, MdStorefront, MdLibraryBooks } from "react-icons/md";
import { PiBookOpenTextFill, PiChalkboardTeacherFill, PiPaperPlaneTiltFill, PiPasswordFill, PiSignOutDuotone, PiStudentFill } from "react-icons/pi";
import { SiCoursera } from "react-icons/si";
import ChangePass from "./ChangePass";
import EnrolledCourses from "./EnrolledCourses";
import EnrolledClasses from "./EnrolledClasses";
import EnrolledEbooks from "./EnrolledEbooks";
import ApplyTeacher from "./ApplyTeacher";
import ApplySeller from "./ApplySeller";
import ManageCourses from "./ManageCourses";

import { useSelector } from "react-redux";
import { translations } from "../../utils/translations";

import AnimatedPopup from "../../components/AnimatedPopup";

type Props = {
    user: any;
    initialTab?: number;
};

const Profile: FC<Props> = ({ user, initialTab }) => {
    const { language } = useSelector((state: any) => state.language);
    const [avatar, setAvatar] = useState(null);
    const [scroll, setScroll] = useState(false);
    const [signout, setSignout] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);

    const { } = useSignOutQuery(undefined, {
        skip: !signout ? true : false,
    });

    const signOutHandler = async () => {
        setSignout(true);
        setLogoutModal(false);
        await signOut({ redirect: false });
    };

    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 85) {
                setScroll(true);
            } else {
                setScroll(false);
            }
        });
    }

    const [active, setActive] = useState(initialTab || 1);
    const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(active === 3 || active === 4 || active === 5);
    const [isApplyOpen, setIsApplyOpen] = useState(active === 6 || active === 8);

    return (
        <div className="bg-background-Theme min-h-screen flex">
            <div className="w-[60px] 800px:w-[310px] flex-shrink-0 relative">
                <div
                    className={`fixed w-[60px] 800px:w-[310px] h-[calc(100vh-120px)] bg-background-Card_1 bg-opacity-90 border border-[#ffffff1d] rounded-2xl transition-all duration-300 ${scroll ? "top-[100px]" : "top-[100px]"
                        } left-[15px] 800px:left-[30px] z-10 overflow-y-auto custom-scrollbar`}
                >
                    {/* sidebar */}
                    <div className="w-full">
                        {/* profile */}
                        <div
                            className={`w-full flex items-center px-3 py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${active === 1 ? "bg-black/10 dark:bg-white/20 border-r-4 border-hover-text-1" : ""}`}
                            onClick={() => setActive(1)}
                        >
                            <Image
                                src={
                                    user.avatar || avatar
                                        ? user.avatar.url || avatar
                                        : avatarDefault
                                }
                                alt={
                                    user.avatar || avatar
                                        ? user.avatar.url || avatar
                                        : avatarDefault
                                }
                                width={20}
                                height={20}
                                className="800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full"
                            />
                            <h5 className="pl-2 800px:block hidden font-Poppins text-text-basic">
                                {translations[language].my_account}
                            </h5>
                        </div>

                        {/* change pass */}
                        <div
                            className={`w-full flex items-center px-3 py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${active === 2 ? "bg-black/10 dark:bg-white/20 border-r-4 border-hover-text-1" : ""}`}
                            onClick={() => setActive(2)}
                        >
                            <PiPasswordFill
                                size={20}
                                className="text-text-basic"
                            />
                            <h5 className="pl-2 800px:block hidden font-Poppins text-text-basic">
                                {translations[language].change_password}
                            </h5>
                        </div>

                        {/* enrollments dropdown */}
                        {user.role !== "superadmin" && user.role !== "admin" && user.role !== "moderator" && (
                            <>
                                <div
                                    className={`w-full flex items-center justify-between px-3 py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${(active === 3 || active === 4 || active === 5) ? "bg-black/10 dark:bg-white/20 border-r-4 border-hover-text-1" : ""}`}
                                    onClick={() => setIsEnrollmentOpen(!isEnrollmentOpen)}
                                >
                                    <div className="flex items-center">
                                        <PiBookOpenTextFill size={20} className="text-text-basic" />
                                        <h5 className="pl-2 800px:block hidden font-Poppins text-text-basic">
                                            {translations[language].enrollments}
                                        </h5>
                                    </div>
                                    <div className="800px:block hidden text-text-basic">
                                        {isEnrollmentOpen ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                                    </div>
                                </div>

                                {/* dropdown items */}
                                <div className={`transition-all duration-300 overflow-hidden ${isEnrollmentOpen ? "max-h-[200px]" : "max-h-0"}`}>
                                    <div
                                        className={`w-full flex items-center px-8 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${active === 3 ? "text-hover-text-1 font-semibold" : "text-text-basic opacity-80"}`}
                                        onClick={() => setActive(3)}
                                    >
                                        <SiCoursera size={16} />
                                        <h5 className="pl-2 800px:block hidden font-Poppins text-[14px]">
                                            {translations[language].enrolled_courses}
                                        </h5>
                                    </div>

                                    <div
                                        className={`w-full flex items-center px-8 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${active === 4 ? "text-hover-text-1 font-semibold" : "text-text-basic opacity-80"}`}
                                        onClick={() => setActive(4)}
                                    >
                                        <MdClass size={16} />
                                      <h5 className="pl-2 800px:block hidden font-Poppins text-[14px]">
                                          {translations[language].enrolled_live_courses}
                                      </h5>
                                    </div>

                                    <div
                                        className={`w-full flex items-center px-8 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${active === 5 ? "text-hover-text-1 font-semibold" : "text-text-basic opacity-80"}`}
                                        onClick={() => setActive(5)}
                                    >
                                        <MdLibraryBooks size={16} />
                                        <h5 className="pl-2 800px:block hidden font-Poppins text-[14px]">
                                            {translations[language].enrolled_ebooks}
                                        </h5>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* manage live courses for staff */}
                        {(user.role === "superadmin" || user.role === "admin" || user.role === "moderator" || user.role === "teacher") && (
                            <div
                                className={`w-full flex items-center px-3 py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${active === 7 ? "bg-black/10 dark:bg-white/20 border-r-4 border-hover-text-1" : ""}`}
                                onClick={() => setActive(7)}
                            >
                                <MdClass size={20} className="text-text-basic" />
                                <h5 className="pl-2 800px:block hidden font-Poppins text-text-basic">
                                    {translations[language].manage_live_course}
                                </h5>
                            </div>
                        )}

                        {/* manage courses for staff */}
                        {(user.role === "superadmin" || user.role === "admin" || user.role === "moderator" || user.role === "teacher") && (
                            <div
                                className={`w-full flex items-center px-3 py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${active === 9 ? "bg-black/10 dark:bg-white/20 border-r-4 border-hover-text-1" : ""}`}
                                onClick={() => setActive(9)}
                            >
                                <SiCoursera size={20} className="text-text-basic" />
                                <h5 className="pl-2 800px:block hidden font-Poppins text-text-basic">
                                    {translations[language].manage_courses}
                                </h5>
                            </div>
                        )}

                        {/* apply dropdown — only for normal users */}
                        {user && (user.role !== "superadmin" && user.role !== "admin" && user.role !== "moderator" && user.role !== "teacher") && (
                            <>
                                <div
                                    className={`w-full flex items-center justify-between px-3 py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${active === 6 ? "bg-black/10 dark:bg-white/20 border-r-4 border-hover-text-1" : ""}`}
                                    onClick={() => setIsApplyOpen(!isApplyOpen)}
                                >
                                    <div className="flex items-center">
                                        <PiPaperPlaneTiltFill size={20} className="text-text-basic" />
                                        <h5 className="pl-2 800px:block hidden font-Poppins text-text-basic">
                                            {translations[language].apply}
                                        </h5>
                                    </div>
                                    <div className="800px:block hidden text-text-basic">
                                        {isApplyOpen ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                                    </div>
                                </div>

                                {/* dropdown items */}
                                <div className={`transition-all duration-300 overflow-hidden ${isApplyOpen ? "max-h-[200px]" : "max-h-0"}`}>
                                    <div
                                        className={`w-full flex items-center px-8 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${active === 6 ? "text-hover-text-1 font-semibold" : "text-text-basic opacity-80"}`}
                                        onClick={() => setActive(6)}
                                    >
                                        <PiChalkboardTeacherFill size={16} />
                                        <h5 className="pl-2 800px:block hidden font-Poppins text-[14px]">
                                            {translations[language].apply_teacher}
                                        </h5>
                                    </div>
                                    <div
                                        className={`w-full flex items-center px-8 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all ${active === 8 ? "text-hover-text-1 font-semibold" : "text-text-basic opacity-80"}`}
                                        onClick={() => setActive(8)}
                                    >
                                        <MdStorefront size={16} />
                                        <h5 className="pl-2 800px:block hidden font-Poppins text-[14px]">
                                            Apply for Seller
                                        </h5>
                                    </div>
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
                                <h5 className="pl-2 800px:block hidden font-Poppins text-text-basic">
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
                            <h5 className="pl-2 800px:block hidden font-Poppins text-text-basic">
                                {translations[language].sign_out}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* profile info */}
            {active === 1 && (
                <div className="w-full h-full bg-transparent pt-[80px]">
                    <ProfileInfo avatar={avatar} user={user} />
                </div>
            )}

            {/* change password */}
            {active === 2 && (
                <div className="w-full h-full bg-transparent pt-[80px]">
                    <ChangePass />
                </div>
            )}

            {/* enrolled courses & classes — visible to all users */}
            {active === 3 && (
                <div className="w-full h-full bg-transparent pt-[80px]">
                    <EnrolledCourses user={user} />
                </div>
            )}

            {active === 4 && (
                <div className="w-full h-full bg-transparent pt-[80px]">
                    <EnrolledClasses user={user} />
                </div>
            )}

            {active === 5 && (
                <div className="w-full h-full bg-transparent pt-[80px]">
                    <EnrolledEbooks user={user} />
                </div>
            )}

            {active === 7 && (
                <div className="w-full h-full bg-transparent pt-[80px]">
                    <ManageCourses user={user} />
                </div>
            )}

            {active === 9 && (
                <div className="w-full h-full bg-transparent pt-[80px]">
                    <ManageCourses user={user} />
                </div>
            )}

            {/* apply forms — only for normal users */}
            {user && (user.role !== "superadmin" && user.role !== "admin" && user.role !== "moderator" && user.role !== "teacher") && (
                <>
                    {active === 6 && (
                        <div className="w-full h-full bg-transparent pt-[80px]">
                            <ApplyTeacher user={user} />
                        </div>
                    )}
                    {active === 8 && (
                        <div className="w-full h-full bg-transparent pt-[80px]">
                            <ApplySeller user={user} />
                        </div>
                    )}
                </>
            )}

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
        </div>
    );
};

export default Profile;