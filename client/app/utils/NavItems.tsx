"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useSelector } from "react-redux";
import { translations } from "./translations";
import { usePathname } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";

export const NavItemsData = [
  { name: "home", url: "/" },
  { name: "courses", url: "/courses", hasDropdown: true },
  { name: "ebooks", url: "/ebooks", hasDropdown: true },
  { name: "training", url: "/trainings" },
  { name: "consultancy", url: "/consultancy" },
];

export const courseTypes = [
  { nameKey: "certificate_course", slug: "Certificate Course", path: "/courses/certificate-course" },
  { nameKey: "academic_course", slug: "Academic Course", path: "/courses/academic-course" },
  { nameKey: "religious_course", slug: "Religious Course", path: "/courses/religious-course" },
];

export const ebookTypes = [
  { nameKey: "certificate_ebook", slug: "Certificate E-Book", path: "/ebooks/certificate-ebook" },
  { nameKey: "academic_ebook", slug: "Academic E-Book", path: "/ebooks/academic-ebook" },
  { nameKey: "religious_ebook", slug: "Religious E-Book", path: "/ebooks/religious-ebook" },
];

type Props = {
  isMobile: boolean;
  user?: any;
};

const NavItems: React.FC<Props> = ({ isMobile, user }) => {
  const { language } = useSelector((state: any) => state.language);
  const pathname = usePathname();
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [coursesDropdownVisible, setCoursesDropdownVisible] = useState(false);
  const coursesDropdownRef = useRef<HTMLDivElement>(null);

  const [ebooksDropdownOpen, setEbooksDropdownOpen] = useState(false);
  const [ebooksDropdownVisible, setEbooksDropdownVisible] = useState(false);
  const ebooksDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (coursesDropdownOpen) {
      setCoursesDropdownVisible(true);
    }
  }, [coursesDropdownOpen]);

  useEffect(() => {
    if (coursesDropdownRef.current) {
      if (coursesDropdownOpen) {
        gsap.fromTo(coursesDropdownRef.current,
          { opacity: 0, y: -8, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" }
        );
      } else {
        gsap.to(coursesDropdownRef.current, {
          opacity: 0, y: -8, scale: 0.95, duration: 0.15, ease: "power2.in",
          onComplete: () => setCoursesDropdownVisible(false)
        });
      }
    }
  }, [coursesDropdownOpen, coursesDropdownVisible]);

  useEffect(() => {
    if (ebooksDropdownOpen) {
      setEbooksDropdownVisible(true);
    }
  }, [ebooksDropdownOpen]);

  useEffect(() => {
    if (ebooksDropdownRef.current) {
      if (ebooksDropdownOpen) {
        gsap.fromTo(ebooksDropdownRef.current,
          { opacity: 0, y: -8, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" }
        );
      } else {
        gsap.to(ebooksDropdownRef.current, {
          opacity: 0, y: -8, scale: 0.95, duration: 0.15, ease: "power2.in",
          onComplete: () => setEbooksDropdownVisible(false)
        });
      }
    }
  }, [ebooksDropdownOpen, ebooksDropdownVisible]);

  return (
    <div className={isMobile ? "1100px:hidden mt-5" : "hidden 1100px:flex items-center"}>
      {NavItemsData.map((item, index) => {
        if (item.hasDropdown) {
          const isCourses = item.name === "courses";
          const isEbooks = item.name === "ebooks";
          const dropdownOpen = isCourses ? coursesDropdownOpen : isEbooks ? ebooksDropdownOpen : false;
          const dropdownVisible = isCourses ? coursesDropdownVisible : isEbooks ? ebooksDropdownVisible : false;
          const dropdownRef = isCourses ? coursesDropdownRef : ebooksDropdownRef;
          const setDropdownOpen = isCourses ? setCoursesDropdownOpen : setEbooksDropdownOpen;
          const typesList = isCourses ? courseTypes : ebookTypes;
          const isParentActive = isCourses ? pathname.startsWith("/courses") : pathname.startsWith("/ebooks");

          return (
            <div
              key={index}
              className={`relative ${isMobile ? "border-b border-text-basic/10" : ""}`}
              onMouseEnter={() => !isMobile && setDropdownOpen(true)}
              onMouseLeave={() => !isMobile && setDropdownOpen(false)}
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span
                  className={`${
                    isMobile ? "block text-base sm:text-lg font-medium text-left px-2 py-3" : "inline-block text-[15px] 1200px:text-base 1300px:text-lg font-[400] text-center py-2 px-2 1200px:px-3.5 1300px:px-5"
                  } font-Poppins ${
                    isParentActive
                      ? "text-hover-text-1 1100px:border-b-2 1100px:border-hover-text-1"
                      : "text-text-basic"
                  } hover:text-hover-text-1 transition-all 1100px:border-b 1100px:border-b-transparent w-full`}
                >
                  {translations[language][item.name]}
                </span>
                <FiChevronDown
                  className={`text-text-basic transition-transform mr-2 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  size={14}
                />
              </div>
              {/* Mobile slide-down accordion with rounded-0 */}
              {isMobile ? (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    dropdownOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                  } bg-black/5 dark:bg-white/5 border-l-2 border-hover-text-1 rounded-none`}
                >
                  <div className="py-1">
                    {typesList.map((type, idx) => {
                      const isTypeActive = pathname === type.path;
                      return (
                        <Link
                          key={idx}
                          href={type.path}
                          className={`block px-6 py-2.5 transition-all text-sm font-Poppins rounded-none ${
                            isTypeActive
                              ? "text-hover-text-1 font-semibold bg-black/5 dark:bg-white/10"
                              : "text-text-basic hover:bg-black/5 dark:hover:bg-white/10"
                          }`}
                        >
                          {translations[language][type.nameKey]}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                dropdownVisible && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 top-full mt-0 bg-background-Card_1 border border-[#ffffff1d] rounded-xl shadow-2xl overflow-hidden z-50 min-w-[200px]"
                  >
                    {typesList.map((type, idx) => {
                      const isTypeActive = pathname === type.path;
                      return (
                        <Link
                          key={idx}
                          href={type.path}
                          className={`block px-4 py-3 transition-all text-sm font-Poppins ${
                            isTypeActive
                              ? "text-hover-text-1 bg-black/5 dark:bg-white/10"
                              : "text-text-basic hover:bg-black/5 dark:hover:bg-white/10"
                          }`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          {translations[language][type.nameKey]}
                        </Link>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          );
        }

        return (
          <Link
            href={item.url}
            key={index}
            passHref
            className={`flex items-center ${isMobile ? "border-b border-text-basic/10" : ""}`}
          >
            <span
              className={`${
                isMobile ? "block text-base sm:text-lg font-medium text-left px-2 py-3" : "inline-block text-[15px] 1200px:text-base 1300px:text-lg font-[400] text-center py-2 px-2 1200px:px-3.5 1300px:px-5"
              } font-Poppins ${
                pathname === item.url
                  ? "text-hover-text-1 1100px:border-b-2 1100px:border-hover-text-1"
                  : "text-text-basic"
              } hover:text-hover-text-1 transition-all 1100px:border-b 1100px:border-b-transparent w-full`}
            >
              {translations[language][item.name]}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default NavItems;
