import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useRef, useState } from "react";
import Blob from "../components/animation/Blob";
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { HiOutlineClock } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import Loader from "../components/Loader";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { translations } from "../utils/translations";
import AnimatedPopup from "../components/AnimatedPopup";
import BrandSlider from "../components/BrandSlider";
const STORAGE_KEY = "course_search_history";

const Hero: FC = () => {
    const { data, isLoading } = useGetHeroDataQuery("Banner", {});
    const { data: coursesData } = useGetUsersAllCoursesQuery(undefined, {});
    const allCourses = coursesData?.courses || [];

    const [search, setSearch] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const router = useRouter();
    const { language } = useSelector((state: any) => state.language);
    const { user } = useSelector((state: any) => state.auth);
    const popupRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setSearchHistory(JSON.parse(stored));
            } catch {}
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        if (isSearchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSearchOpen]);

    const saveToHistory = (query: string) => {
        const updated = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
        setSearchHistory(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const removeFromHistory = (query: string) => {
        const updated = searchHistory.filter(h => h !== query);
        setSearchHistory(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleSearch = (course: any) => {
        const trimmed = course.name?.trim();
        if (!trimmed) return;
        saveToHistory(trimmed);
        setIsSearchOpen(false);
        setSearch("");
        router.push(`/course/${course._id}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && filteredCourses.length > 0) {
            handleSearch(filteredCourses[0]);
        }
    };

    const filteredCourses = search.trim()
        ? allCourses.filter((c: any) =>
              c.name?.toLowerCase().includes(search.toLowerCase())
          )
        : [];

    const bannerImage =
        data?.layout?.banner?.image?.url ?? "/assests/bannerImg.png";
    const title = data?.layout?.banner?.title ?? translations[language].hero_title;
    const subTitle =
        data?.layout?.banner?.subTitle ?? translations[language].hero_subtitle;

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="bg-background-Theme pt-20">
                    <div className="w-[88%] max-w-[1440px] mx-auto px-4 1000px:px-10 1000px:w-[96%] 1000px:max-w-[2200px] flex-between flex-col 1000px:flex-row items-center">
                        <div className="relative order-2 w-[800px] max-w-full aspect-square mx-auto 1000px:order-none 1000px:mx-0 1000px:w-[calc(min(100vh,60vw)_-_clamp(42px,4.17vw,60px))]">
                            <Blob />
                            <Image
                                src={bannerImage}
                                alt="Banner"
                                fill
                                priority
                                sizes="(max-width: 1000px) 80vw, 48vw"
                                className="object-contain p-[calc(15%_+_30px)] sm:p-[calc(15%_+_65px)] 1000px:p-[calc(15%_+_clamp(45px,4.51vw,65px))] z-10"
                            />
                        </div>

                        <div className="contents 1000px:flex 1000px:w-[42%] 1000px:max-w-[660px] 1000px:flex-col 1000px:items-start 1000px:mt-0">
                            <h2 className="order-1 w-full text-center text-text-basic text-[30px] 1000px:text-[clamp(40px,4.86vw,70px)] 1000px:text-left font-semibold font-Josefin pt-2 pb-0 1000px:py-2 1000px:leading-[clamp(44px,5.21vw,75px)]">
                                {title}
                            </h2>
                            <p className="order-3 text-center text-text-basic font-Josefin font-semibold text-lg 1000px:text-[clamp(14px,1.25vw,18px)] 1000px:leading-[1.56] 1000px:text-left 1000px:w-[78%] 1500px:w-[85%]">
                                {subTitle}
                            </p>

                            {user?.role !== "superadmin" && user?.role !== "admin" && user?.role !== "moderator" && user?.role !== "teacher" && (
                                <>
                                    <div className="order-4 1500px:w-[55%] w-[90%] 1000px:w-[78%] h-[50px] 1000px:h-[clamp(40px,3.47vw,50px)] bg-transparent relative mt-4 1000px:mt-[clamp(12px,1.11vw,16px)]">
                                        <div
                                            onClick={() => setIsSearchOpen(true)}
                                            className="w-full h-full bg-transparent border border-text-basic rounded-[5px] p-2 flex items-center cursor-pointer text-text-basic text-xl 1000px:text-[clamp(15px,1.39vw,20px)] 1000px:leading-[1.4] font-medium font-Josefin"
                                        >
                                            <span className="opacity-40">Search Courses...</span>
                                        </div>
                                        <div className="absolute flex items-center justify-center w-[51px] h-[50px] 1000px:w-[clamp(41px,3.54vw,51px)] 1000px:h-[clamp(40px,3.47vw,50px)] cursor-pointer right-0 top-0 bg-button-btn_1 rounded-r-[5px] text-text-basic">
                                            <IoIosSearch className="text-text-basic_dim text-2xl 1000px:text-[clamp(18px,1.67vw,24px)]" />
                                        </div>
                                    </div>

                                    <AnimatedPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} overlayClassName="!p-2 1000px:!p-4">
                                        <div ref={popupRef} className="w-full h-full sm:max-h-[80vh] 1000px:max-w-[700px] 1000px:max-h-[500px] bg-background-Card_1 rounded-2xl shadow-2xl border border-[#ffffff1a] flex flex-col">
                                                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-[#ffffff1a] shrink-0">
                                                    <FiSearch className="shrink-0 opacity-40" size={20} />
                                                    <input
                                                        ref={inputRef}
                                                        type="text"
                                                        value={search}
                                                        placeholder="Search Courses..."
                                                        className="flex-1 min-w-0 bg-transparent outline-none text-text-basic text-base sm:text-lg"
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        onKeyDown={handleKeyDown}
                                                        autoFocus
                                                    />
                                                    {search && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setSearch("")}
                                                            className="shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
                                                        >
                                                            <IoClose size={20} className="text-text-basic" />
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="flex-1 overflow-y-auto">
                                                    {search.trim() && filteredCourses.length > 0 && (
                                                        <div>
                                                            <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider opacity-40">
                                                                Courses
                                                            </p>
                                              {filteredCourses.slice(0, 8).map((course: any) => (
                                                                  <button
                                                                      key={course._id}
                                                                      type="button"
                                                                      onClick={() => handleSearch(course)}
                                                                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-text-basic hover:bg-hover-bg-1 transition-colors"
                                                                  >
                                                                      <FiSearch className="shrink-0 opacity-40" size={16} />
                                                                      <span className="truncate">{course.name}</span>
                                                                  </button>
                                                              ))}
                                                        </div>
                                                    )}

                                                    {search.trim() && filteredCourses.length === 0 && (
                                                        <div className="px-4 py-3 text-sm opacity-40">
                                                            No courses found
                                                        </div>
                                                    )}

                                                    {!search.trim() && searchHistory.length > 0 && (
                                                        <div>
                                                            <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider opacity-40">
                                                                Recent Searches
                                                            </p>
                                                            {searchHistory.map((item) => (
                                                                <div
                                                                    key={item}
                                                                    className="flex items-center gap-3 px-4 py-3 group"
                                                                >
                                                                    <HiOutlineClock className="shrink-0 opacity-40" size={16} />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSearch(item)}
                                                                        className="flex-1 text-left text-text-basic truncate hover:text-blue-500 transition-colors"
                                                                    >
                                                                        {item}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            removeFromHistory(item);
                                                                        }}
                                                                        className="shrink-0 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                                                                    >
                                                                        <IoClose size={16} className="text-text-basic" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {!search.trim() && searchHistory.length === 0 && (
                                                        <div className="flex flex-col items-center justify-center py-10 sm:py-16 px-4 text-center">
                                                            <FiSearch className="opacity-20 mb-4 w-10 h-10 sm:w-12 sm:h-12" />
                                                            <p className="text-sm opacity-40">No courses have been searched yet</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </AnimatedPopup>

                                    <div className="order-5 flex items-center gap-2 1000px:gap-[clamp(6px,0.56vw,8px)] mt-4 1000px:mt-[clamp(12px,1.11vw,16px)] mb-[70px] 1000px:mb-0">
                                        <Image
                                            src="/assests/client-1.jpg"
                                            alt="Client 1"
                                            width={50}
                                            height={50}
                                            className="rounded-full mr-[-30px] 1000px:mr-[clamp(-30px,-2.08vw,-21px)] border-2 1000px:w-[clamp(38px,3.47vw,50px)] 1000px:h-[clamp(38px,3.47vw,50px)]"
                                        />
                                        <Image
                                            src="/assests/client-2.jpg"
                                            alt="Client 2"
                                            width={50}
                                            height={50}
                                            className="rounded-full mr-[-30px] 1000px:mr-[clamp(-30px,-2.08vw,-21px)] border-2 1000px:w-[clamp(38px,3.47vw,50px)] 1000px:h-[clamp(38px,3.47vw,50px)]"
                                        />
                                        <Image
                                            src="/assests/client-3.jpg"
                                            alt="Client 3"
                                            width={50}
                                            height={50}
                                            className="rounded-full border-2 1000px:w-[clamp(38px,3.47vw,50px)] 1000px:h-[clamp(38px,3.47vw,50px)]"
                                        />
                                        <p className="font-Josefin text-text-basic text-lg 1000px:text-[clamp(14px,1.25vw,18px)] 1000px:leading-[1.56] font-semibold ml-3 1000px:ml-[clamp(8px,0.83vw,12px)]">
                                            {translations[language].trust_message}{" "}
                                            <Link
                                                href="/courses/certificate-course"
                                                className="text-link-link_1 underline"
                                            >
                                                {translations[language].view_courses}
                                            </Link>
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <BrandSlider />
                </div>
            )}
        </>
    );
};

export default Hero;
