"use client";
import Link from "next/link";
import React, { FC, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import Verification from "../pages/auth/Verification";
import NavItems from "../utils/NavItems";
import CustomModal from "../utils/CustomModal";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { setLanguage } from "@/redux/features/language/languageSlice";

//hooks
import { useSocialAuthMutation, useSignOutQuery } from "@/redux/features/auth/authApi";
import { useGetAllCompaniesQuery } from "@/redux/features/company/companyApi";

// image
import Image from "next/image";
import avatar from "../../public/assests/avatar.png";

import { signOut } from "next-auth/react";

// icons
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import { TbUserHexagon } from "react-icons/tb";
import { MdOutlineManageAccounts, MdClass, MdLibraryBooks, MdOutlineDashboard } from "react-icons/md";
import { SiCoursera } from "react-icons/si";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { PiSignOutDuotone } from "react-icons/pi";
import { LuGrip } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

// notification
import toast from "react-hot-toast";

import AnimatedPopup from "./AnimatedPopup";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ open, setOpen, route, setRoute }) => {
  const { user } = useSelector((state: any) => state.auth);
  const { language } = useSelector((state: any) => state.language);
  const dispatch = useDispatch();

  const { data: companiesData } = useGetAllCompaniesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 85);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // show auth menu
  const handleProfileClick = () => {
    setOpen(true);
    setRoute("SignIn");
  };

  // grip popup
  const [gripPopup, setGripPopup] = useState(false);
  const gripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (gripRef.current && !gripRef.current.contains(e.target as Node)) {
        setGripPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // profile dropdown
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [signout, setSignout] = useState(false);

  useEffect(() => {
    if (profileDropdown) {
      setDropdownVisible(true);
    }
  }, [profileDropdown]);

  useEffect(() => {
    if (dropdownRef.current) {
      if (profileDropdown) {
        gsap.fromTo(dropdownRef.current,
          { opacity: 0, y: -8, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" }
        );
      } else {
        gsap.to(dropdownRef.current, {
          opacity: 0, y: -8, scale: 0.95, duration: 0.15, ease: "power2.in",
          onComplete: () => setDropdownVisible(false)
        });
      }
    }
  }, [profileDropdown, dropdownVisible]);

  const { } = useSignOutQuery(undefined, {
    skip: !signout ? true : false,
  });

  const signOutHandler = async () => {
    setSignout(true);
    setLogoutModal(false);
    await signOut({ redirect: false });
  };

  // showSideBar
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1100) {
        setOpenSidebar(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data } = useSession();

  // social auth
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();

  useEffect(() => {
    if (!user && data) {
      socialAuth({
        email: data?.user?.email,
        name: data?.user?.name,
        avatar: data?.user?.image,
        provider: "google",
      });
    }

    if (isSuccess) {
      toast.success("Login Successfully!");
      setOpen(false); // Close the sign-in modal
    }
    
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [data, user, isSuccess, error, socialAuth, setOpen]);

  const handleLanguageChange = (lang: string) => {
    dispatch(setLanguage(lang));
  };

  if (!mounted) {
      return null;
  }

  return (
    <div className="w-full fixed bg-background-Theme z-50">
      <div
        className={`${
          isScrolled
            ? "backdropFilter fixed top-0 left-0 w-full h-[80px] border-b shadow-xl transition-all z-50"
            : "w-full border-b h-[80px] z-10"
        }`}
      >
        <div className="h-full w-[88%] max-w-[1440px] mx-auto px-4 1000px:px-10 1000px:w-[96%] 1000px:max-w-[2200px]">
          <div className="w-full h-20 flex-between items-center">
            <Link
              href="/"
              className="text-base sm:text-xl md:text-2xl font-Poppins font-[600] text-text-basic tracking-tight whitespace-nowrap"
            >
              Best1 Academy
            </Link>
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 md:gap-5">
              {/* Nav Links - Desktop only */}
              <NavItems isMobile={false} user={user} />
              
              {/* 1. Theme Switcher */}
              <ThemeSwitcher />

              {/* 2. Companies Menu Icon (Grip) */}
              <div className="relative" ref={gripRef}>
                <button
                  type="button"
                  aria-label="Partner companies"
                  className="cursor-pointer text-text-basic p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
                  onClick={() => setGripPopup(!gripPopup)}
                >
                  <LuGrip size={22} />
                </button>
                {gripPopup && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-h-[420px] overflow-y-auto bg-white/95 dark:bg-background-Card_1/95 backdrop-blur-xl border border-text-basic/15 rounded-2xl shadow-2xl z-50 p-4">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-text-basic/10">
                      <div>
                        <h4 className="text-sm font-bold text-text-basic">
                          {language === "bn" ? "আমাদের কোম্পানি সমূহ" : "Our Companies"}
                        </h4>
                        <p className="text-[11px] text-text-basic opacity-50">
                          {language === "bn" ? "ওয়েবসাইট দেখতে ক্লিক করুন" : "Click to visit website"}
                        </p>
                      </div>
                    </div>

                    {!companiesData?.companies || companiesData.companies.length === 0 ? (
                      <div className="text-center py-6 text-text-basic opacity-60 text-xs">
                        {language === "bn" ? "কোন কোম্পানি পাওয়া যায়নি" : "No companies available yet"}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        {companiesData.companies.map((company: any) => {
                          const href = company.website?.startsWith("http")
                            ? company.website
                            : `https://${company.website}`;
                          const firstChar = company.name ? company.name.trim().charAt(0).toUpperCase() : "?";

                          return (
                            <a
                              key={company._id}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setGripPopup(false)}
                              className="group flex flex-col items-center p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all text-center"
                              title={`${company.name} - ${company.website}`}
                            >
                              {company.logo?.url ? (
                                <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center overflow-hidden border border-gray-200/80 shadow-sm group-hover:scale-105 transition-transform">
                                  <img
                                    src={company.logo.url}
                                    alt={company.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-base flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                  {firstChar}
                                </div>
                              )}
                              <span className="text-[11px] font-medium text-text-basic mt-1.5 truncate max-w-full">
                                {company.name}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. User Profile Dropdown / Auth Icon (hidden on sm devices, visible from md and up) */}
              <div className="hidden sm:block">
                {user ? (
                  <div className="relative">
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => setProfileDropdown(!profileDropdown)}
                      onMouseEnter={() => setProfileDropdown(true)}
                    >
                      <Image
                        src={user.avatar?.url || user.avatar || avatar}
                        alt={user.avatar?.url || user.avatar || avatar}
                        width={30}
                        height={30}
                        className="w-[28px] h-[28px] sm:w-[30px] sm:h-[30px] rounded-full object-cover"
                      />
                      <FiChevronDown className={`text-text-basic hidden 1100px:block transition-transform duration-200 ${profileDropdown ? "rotate-180" : ""}`} size={16} />
                    </div>
                    {dropdownVisible && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 top-full mt-2 w-56 bg-background-Card_1 border border-[#ffffff1d] rounded-xl shadow-2xl overflow-hidden z-50"
                        onMouseLeave={() => setProfileDropdown(false)}
                      >
                        {/* Profile - always */}
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-text-basic hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                          onClick={() => setProfileDropdown(false)}
                        >
                          <MdOutlineManageAccounts size={20} />
                          <span className="font-Poppins text-sm">Profile</span>
                        </Link>

                        {/* Normal user: enrolled courses/ebooks */}
                        {user.role !== "superadmin" && user.role !== "admin" && user.role !== "moderator" && user.role !== "teacher" && (
                          <>
                            <Link
                              href="/profile/enrolled-courses"
                              className="flex items-center gap-3 px-4 py-3 text-text-basic hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                              onClick={() => setProfileDropdown(false)}
                            >
                              <SiCoursera size={18} />
                              <span className="font-Poppins text-sm">Enrolled Recorded Courses</span>
                            </Link>
                            <Link
                              href="/profile/enrolled-live-courses"
                              className="flex items-center gap-3 px-4 py-3 text-text-basic hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                              onClick={() => setProfileDropdown(false)}
                            >
                              <MdClass size={20} />
                              <span className="font-Poppins text-sm">Enrolled Live Courses</span>
                            </Link>
                            <Link
                              href="/profile/enrolled-ebooks"
                              className="flex items-center gap-3 px-4 py-3 text-text-basic hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                              onClick={() => setProfileDropdown(false)}
                            >
                              <MdLibraryBooks size={20} />
                              <span className="font-Poppins text-sm">Enrolled E-Books</span>
                            </Link>
                          </>
                        )}

                        {/* Staff (teacher, admin, moderator, superadmin): Manage Live Courses */}
                        {(user.role === "superadmin" || user.role === "admin" || user.role === "moderator" || user.role === "teacher") && (
                          <Link
                            href="/profile/manage-live-courses"
                            className="flex items-center gap-3 px-4 py-3 text-text-basic hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                            onClick={() => setProfileDropdown(false)}
                          >
                            <MdClass size={20} />
                            <span className="font-Poppins text-sm">Manage Live Courses</span>
                          </Link>
                        )}

                        {/* Admin-level only: Admin Dashboard */}
                        {(user.role === "superadmin" || user.role === "admin" || user.role === "moderator") && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 text-text-basic hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                            onClick={() => setProfileDropdown(false)}
                          >
                            <MdOutlineDashboard size={20} />
                            <span className="font-Poppins text-sm">Admin Dashboard</span>
                          </Link>
                        )}

                        <div className="border-t border-[#ffffff1a] my-1" />
                        <button
                          onClick={() => { setProfileDropdown(false); setLogoutModal(true); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <FiLogOut size={20} />
                          <span className="font-Poppins text-sm">Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <TbUserHexagon
                    className="cursor-pointer text-text-basic"
                    size={24}
                    onClick={handleProfileClick}
                  />
                )}
              </div>

              {/* 4. Hamburger Icon for Mobile & Collapsed view */}
              <div className="1100px:hidden flex items-center">
                <HiOutlineBars3BottomRight
                  className="cursor-pointer text-text-basic"
                  size={26}
                  onClick={() => {
                    setOpenSidebar(!openSidebar);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Sidebar Drawer for Mobile & Collapsed view with Right-to-Left Slide Animation */}
        <div
          className={`fixed inset-0 w-full h-screen z-50 flex justify-end transition-all duration-300 ${
            openSidebar ? "pointer-events-auto visible" : "pointer-events-none invisible"
          }`}
        >
          {/* Backdrop with Fade */}
          <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
              openSidebar ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setOpenSidebar(false)}
          />
          {/* Drawer Box with Right-to-Left Slide */}
          <div
            className={`relative w-[75%] max-w-[320px] h-screen z-50 bg-background-Theme border-l border-text-basic/10 shadow-2xl overflow-y-auto px-4 py-5 transform transition-transform duration-300 ease-in-out ${
              openSidebar ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Top Close Button on the Right */}
            <div className="flex justify-end items-center mb-2">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpenSidebar(false)}
                className="p-1.5 rounded-lg text-text-basic hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
              >
                <IoClose size={26} />
              </button>
            </div>

            {/* User Profile for sm/mobile inside Drawer */}
            {user ? (
              <div className="flex sm:hidden items-center gap-3 p-3 mb-4 rounded-xl bg-black/5 dark:bg-white/5 border border-text-basic/10">
                <Link
                  href="/profile"
                  onClick={() => setOpenSidebar(false)}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <Image
                    src={user.avatar?.url || user.avatar || avatar}
                    alt={user.name || "User"}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border border-text-basic/15 shrink-0"
                  />
                  <div className="truncate">
                    <h5 className="font-Poppins font-semibold text-sm text-text-basic truncate">
                      {user.name}
                    </h5>
                    <p className="font-Poppins text-xs text-text-basic opacity-60 truncate capitalize">
                      {user.role || "Student"}
                    </p>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex sm:hidden items-center justify-between p-3 mb-4 rounded-xl bg-black/5 dark:bg-white/5 border border-text-basic/10">
                <div
                  onClick={() => {
                    setOpenSidebar(false);
                    handleProfileClick();
                  }}
                  className="flex items-center gap-2 cursor-pointer text-text-basic hover:text-hover-text-1 w-full"
                >
                  <TbUserHexagon size={24} />
                  <span className="font-Poppins text-sm font-medium">Sign In / Register</span>
                </div>
              </div>
            )}

            <NavItems isMobile={true} user={user} />

            {/* Logout button at bottom of drawer */}
            {user && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpenSidebar(false);
                    setLogoutModal(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-Poppins text-sm font-semibold"
                >
                  <FiLogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Logout Confirmation Modal */}
      <AnimatedPopup isOpen={logoutModal} onClose={() => setLogoutModal(false)} zIndex={100} overlayClassName="bg-black/50">
        <div className="bg-background-Card_1 border border-[#ffffff1d] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
            <PiSignOutDuotone size={32} />
          </div>
          <h3 className="text-xl font-bold text-text-basic text-center mb-2">Sign Out</h3>
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

      {/* signIn */}
      {route === "SignIn" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              component={SignIn}
            />
          )}
        </>
      )}
      {/* signUp */}
      {route === "SignUp" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              component={SignUp}
            />
          )}
        </>
      )}
      {/* signUp */}
      {route === "Verification" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              component={Verification}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
