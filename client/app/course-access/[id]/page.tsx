'use client'
import Loader from "@/app/components/Loader";
import CourseContent from "@/app/pages/CourseContent";
import CourseChat from "@/app/components/CourseChat";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import { redirect } from "next/navigation";
import React, { FC, useEffect } from "react";

type Props = {
    params: any;
};

const page: FC<Props> = ({ params }) => {
    const { id } = React.use(params) as any;

    const { isLoading: userLoading, error, data: userData } = useLoadUserQuery(undefined, {});
    const { data: courseData, isLoading: courseLoading, refetch } = useGetCourseDetailsQuery(id, { skip: !id });

    useEffect(() => {
        if (userData) {
            const isStaff = userData.user.role === "superadmin" || userData.user.role === "admin" || userData.user.role === "moderator" || userData.user.role === "teacher";
            const isPurchased = userData.user.courses.find(
                (item: any) => (item.courseId || item._id) === id
            );
            if (!isPurchased && !isStaff) {
                redirect("/");
            }
            if (error) {
                redirect("/");
            }
        }
    }, [userData, error]);

    if (userLoading || courseLoading) {
        return (
            <div className="bg-background-Theme min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    const course = courseData?.course;
    const isLiveCourse = course?.subCategory === "Live";

    return (
        <div className="bg-background-Theme min-h-screen">
            {isLiveCourse ? (
                <div className="w-[95%] 800px:w-[90%] m-auto pt-24">
                    <CourseChat
                        courseId={id}
                        user={userData?.user}
                        messages={course?.messages || []}
                        refetch={refetch}
                        enrolled={course?.enrolled || []}
                        teachers={course?.teachers || []}
                        courseName={course?.name}
                    />
                </div>
            ) : (
                <CourseContent id={id} user={userData?.user} />
            )}
        </div>
    );
};

export default page;
