import CourseCard from "@/app/components/CourseCard";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { translations } from "../../utils/translations";

type Props = {
    user: any;
};

const EnrolledCourses: FC<Props> = ({ user }) => {
    const { language } = useSelector((state: any) => state.language);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const { data: allCoursesData, isLoading: allCoursesLoading, isError: allCoursesError } = useGetUsersAllCoursesQuery();

    useEffect(() => {
        if (allCoursesData?.courses) {
            const isStaff = user?.role === "superadmin" || user?.role === "admin" || user?.role === "moderator" || user?.role === "teacher";
            
            if (isStaff) {
                const recordedCourses = allCoursesData.courses.filter(
                    (course: any) => course.subCategory !== "Live"
                );
                setEnrolledCourses(recordedCourses);
            } else if (user?.courses) {
                const filteredCourses = user.courses
                    .map((userCourse: any) =>
                        allCoursesData.courses.find((course: any) => course._id === userCourse.courseId)
                    )
                    .filter((course: any) => course !== undefined && course.subCategory !== "Live");
                setEnrolledCourses(filteredCourses);
            }
        }
    }, [allCoursesData, user?.courses, user?.role]);

    if (allCoursesLoading) {
        return <div className="w-full h-[300px] flex items-center justify-center">Loading enrolled courses...</div>;
    }

    if (allCoursesError) {
        return <div className="w-full h-[300px] flex items-center justify-center text-red-500">Error loading courses. Please try again.</div>;
    }

    return (
        <div className="w-full">
            {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 gap-[15px] md:grid-cols-2 md:gap-[20px] lg:grid-cols-3 lg:gap-[20px] 1500px:grid-cols-4 1500px:gap-[25px] border-0">
                    {enrolledCourses.map((item: any, index: number) => (
                        <div key={index}>
                            <CourseCard
                                item={item}
                                isProfile={true}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full h-[300px] flex items-center justify-center">
                    <h1 className="text-center text-[18px] font-Poppins text-gray-600">
                        {translations[language].no_enrolled_courses}
                    </h1>
                </div>
            )}
        </div>
    );
};

export default EnrolledCourses;