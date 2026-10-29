import { useGetUsersAllCoursesQuery } from "../../redux/features/courses/coursesApi";
import React from "react";
import CourseCard from "../components/CourseCard";
import { useSelector } from "react-redux";
import { translations } from "../utils/translations";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

const Courses = () => {
    const { data } = useGetUsersAllCoursesQuery({});
    const { language } = useSelector((state: any) => state.language);
    const courses = data?.courses?.slice(0, 8) || [];

    return (
        <div className="bg-background-Theme mt-[clamp(48px,8.89vw,128px)]">
            <div className="w-[90%] 800px:w-[80%] m-auto pt-[clamp(24px,3.47vw,50px)] pb-[clamp(40px,7.08vw,102px)]">
                <div className="text-center pb-[50px]">
                    <h1 className="font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl text-text-basic 800px:!leading-[60px] font-bold tracking-tight">
                        {translations[language].popular} <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">{translations[language].courses}</span>
                    </h1>
                    <h2 className="title text-center">
                        <span aria-hidden="true" className="inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-2 align-middle" />
                        {translations[language].comprehensive_courses}
                    </h2>
                </div>

                {courses.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] border-0">
                            {courses.map((item: any, index: number) => (
                                <CourseCard item={item} key={index} />
                            ))}
                        </div>
                        <div className="flex justify-end mt-8">
                            <Link
                                href="/courses/certificate-course"
                                className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-semibold text-sm transition-colors"
                            >
                                {translations[language]?.see_all_courses || "See all courses"}
                                <IoIosArrowForward size={16} />
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center mt-16">
                        <h2 className="text-xl text-text-basic opacity-60">
                            {language === "bangla" ? "কোন কোর্স পাওয়া যায়নি।" : "No courses found."}
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;