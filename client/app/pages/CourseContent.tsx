import { useGetCourseContentQuery, useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { FC, useState } from "react";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import CourseContentMedia from "./CourseContentMedia";
import CourseContentList from "./CourseContentList";
import { AiOutlineCheckCircle, AiOutlinePlayCircle } from "react-icons/ai";
import Ratings from "../utils/Ratings";

type Props = {
    id: string;
    user: any;
};

const CourseContent: FC<Props> = ({ id, user }) => {
    const { data: contentData, isLoading, refetch } = useGetCourseContentQuery(id, {refetchOnMountOrArgChange: true});
    const { data: courseDetails } = useGetCourseDetailsQuery(id, { refetchOnMountOrArgChange: true });

    const [activeVideo, setActiveVideo] = useState(0);
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const data = contentData?.content;
    const course = courseDetails?.course;

    const totalVideos = data?.length || 0;
    const progressPct = totalVideos > 0 ? Math.round(((activeVideo + 1) / totalVideos) * 100) : 0;

    return (
        <div className="bg-background-Theme min-h-screen">
            <Header
                open={open}
                setOpen={setOpen}
                route={route}
                setRoute={setRoute}
            />

            {isLoading ? (
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader />
                </div>
            ) : !data ? (
                <div className="flex items-center justify-center h-[60vh]">
                    <p className="text-red-400 text-lg font-Poppins">Failed to load course content. Please try again.</p>
                </div>
            ) : (
                <>
                    <Heading
                        title={data?.[activeVideo]?.title || "Course Content"}
                        description="anything"
                        keywords={data?.[activeVideo]?.tags}
                    />

                    {/* Course Header Banner */}
                    <div className="bg-gradient-to-r from-[#1a1a4e] via-[#2d1b69] to-[#1a1a4e] border-b border-[#ffffff1a] pt-20">
                        <div className="w-[95%] 800px:w-[90%] m-auto py-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <h1 className="text-[22px] 800px:text-[28px] font-bold text-white font-Poppins leading-tight">
                                        {course?.name || "Course Content"}
                                    </h1>
                                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                                        <div className="flex items-center gap-1">
                                            <Ratings rating={course?.ratings || 0} />
                                            <span className="text-white text-sm ml-1">
                                                {course?.ratings?.toFixed(1) || "0.0"}
                                            </span>
                                        </div>
                                        <span className="text-[#ffffff83] text-sm">
                                            {course?.purchased || 0} students
                                        </span>
                                        <span className="text-[#ffffff83] text-sm flex items-center gap-1">
                                            <AiOutlinePlayCircle className="text-green-400" />
                                            {totalVideos} lessons
                                        </span>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="min-w-[200px]">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-[#ffffff83]">Progress</span>
                                        <span className="text-white font-medium">{progressPct}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#ffffff1a] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${progressPct}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                                        <AiOutlineCheckCircle />
                                        <span>{activeVideo + 1} of {totalVideos} completed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="w-[95%] 800px:w-[90%] m-auto mt-6">
                        <div className="flex gap-6">
                            {/* Sidebar Toggle (mobile) */}
                            <button
                                className="800px:hidden fixed bottom-6 right-6 z-50 bg-button-btn_5 text-white p-3 rounded-full shadow-lg"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            {/* Sidebar Overlay (mobile) */}
                            {sidebarOpen && (
                                <div
                                    className="800px:hidden fixed inset-0 bg-black/50 z-40"
                                    onClick={() => setSidebarOpen(false)}
                                />
                            )}

                            {/* Sidebar */}
                            <div className={`800px:w-[320px] 800px:min-w-[320px] shrink-0 ${
                                sidebarOpen
                                    ? "fixed right-0 top-0 h-full z-50 w-[300px] shadow-2xl"
                                    : "hidden 800px:block"
                            }`}>
                                <div className={`h-full ${sidebarOpen ? "overflow-y-auto" : ""} bg-background-Card_1 rounded-xl border border-[#ffffff1a]`}>
                                    <div className="p-4 border-b border-[#ffffff1a]">
                                        <h3 className="text-text-basic font-semibold text-lg font-Poppins">Course Content</h3>
                                        <p className="text-[#ffffff83] text-sm mt-1">{totalVideos} lessons • {progressPct}% complete</p>
                                    </div>
                                    <div className="p-2">
                                        <CourseContentList
                                            setActiveVideo={(idx: number) => { setActiveVideo(idx); setSidebarOpen(false); }}
                                            data={data}
                                            activeVideo={activeVideo}
                                            isDemo={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                                <div className="bg-background-Card_1 rounded-xl border border-[#ffffff1a] p-4 800px:p-6">
                                    <CourseContentMedia
                                        data={data}
                                        id={id}
                                        activeVideo={activeVideo}
                                        setActiveVideo={setActiveVideo}
                                        user={user}
                                        refetch={refetch}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-12" />
                </>
            )}
        </div>
    );
};

export default CourseContent;
