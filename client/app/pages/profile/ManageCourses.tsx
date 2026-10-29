import CourseCard from "@/app/components/CourseCard";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { translations } from "../../utils/translations";
import { IoIosSearch } from "react-icons/io";
import Loader from "../../components/Loader";
import Link from "next/link";

type Props = {
    user: any;
    defaultSubCategory?: string;
};

const ManageCourses: FC<Props> = ({ user, defaultSubCategory }) => {
    const { language } = useSelector((state: any) => state.language);
    const { data, isLoading, isError } = useGetUsersAllCoursesQuery(undefined, {});
    const [search, setSearch] = useState("");
    const [sortByLastUploaded, setSortByLastUploaded] = useState(false);
    const [subCategory, setSubCategory] = useState(defaultSubCategory || "All");
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (data?.courses) {
            let filtered = [...data.courses];

            if (search) {
                filtered = filtered.filter((item: any) =>
                    item.name.toLowerCase().includes(search.toLowerCase())
                );
            }
            if (subCategory !== "All") {
                filtered = filtered.filter((item: any) => item.subCategory === subCategory);
            }
            if (sortByLastUploaded) {
                filtered = filtered.sort(
                    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            }
            setCourses(filtered);
        }
    }, [data, search, sortByLastUploaded, subCategory]);

    if (isLoading) {
        return <div className="w-full h-[300px] flex items-center justify-center text-text-basic opacity-70">Loading courses...</div>;
    }

    if (isError) {
        return <div className="w-full h-[300px] flex items-center justify-center text-red-500">Error loading courses. Please try again.</div>;
    }

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 mt-5">
                <div className="flex flex-col md:flex-row items-center w-full md:w-auto gap-4">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-[250px]">
                        <input
                            type="text"
                            value={search}
                            placeholder={translations[language].search_courses || "Search Courses..."}
                            className="bg-transparent border border-text-basic/20 rounded-[5px] p-2 w-full h-[40px] outline-none text-text-basic font-medium font-Poppins text-[14px]"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="absolute flex items-center justify-center w-[40px] h-[40px] right-0 top-0 text-text-basic opacity-50">
                            <IoIosSearch size={20} />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center">
                        <select
                            className="bg-background-Card_1 border border-text-basic/20 rounded-[5px] p-2 h-[40px] outline-none text-text-basic font-medium font-Poppins text-[14px] cursor-pointer"
                            value={sortByLastUploaded ? "Last Uploaded" : "All"}
                            onChange={(e) => setSortByLastUploaded(e.target.value === "Last Uploaded")}
                        >
                            <option value="All">All Courses</option>
                            <option value="Last Uploaded">Last Uploaded</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* SubCategory Tabs */}
            {!defaultSubCategory && (
            <div className="flex gap-2 mb-6">
                {["All", "Recorded", "Live"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSubCategory(tab)}
                        className={`px-4 py-2 rounded-[5px] font-Poppins text-[14px] font-medium transition-colors ${
                            subCategory === tab
                                ? "bg-blue-600 text-white"
                                : "bg-background-Card_1 text-text-basic border border-text-basic/20 hover:bg-background-Card_1/80"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            )}

            {courses.length > 0 ? (
                <div className="grid grid-cols-1 gap-[15px] md:grid-cols-2 md:gap-[20px] lg:grid-cols-3 lg:gap-[20px] 1500px:grid-cols-4 1500px:gap-[25px] border-0 mb-10">
                    {courses.map((item: any, index: number) => (
                        <div key={index} className="relative">
                            {item.subCategory === "Live" && (
                                <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded-full uppercase shadow-lg">
                                    Live
                                </div>
                            )}
                            <CourseCard
                                item={item}
                                isProfile={true}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full h-[300px] flex items-center justify-center">
                    <h1 className="text-center text-[18px] font-Poppins text-text-basic opacity-60">
                        No courses found.
                    </h1>
                </div>
            )}
        </div>
    );
};

export default ManageCourses;
