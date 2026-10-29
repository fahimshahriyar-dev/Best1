'use client'
import React, { FC, useEffect, useState } from 'react'

// component
import CourseInfo from './CourseInfo';
import CourseOptions from './CourseOptions';
import CourseData from './CourseData';
import CourseContent from './CourseContent';
import CoursePreview from './CoursePreview';
import { useEditCourseMutation, useGetAllCoursesQuery } from '../../../redux/features/courses/coursesApi';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';

type Props = {
    id: string
}

const EditCourse: FC<Props> = ({ id }) => {
    const [ editCourse, { isSuccess, error } ] = useEditCourseMutation();
    const { data, refetch } = useGetAllCoursesQuery({}, {refetchOnMountOrArgChange: true});

    const editCourseData = data && data.courses.find((i: any) => i._id === id);

    useEffect(() => {
        if(isSuccess) {
            toast.success("Course updated successfully");
            redirect("/admin/courses")
        }

        if(error && "data" in error) {
            const errorMessage = error as any;
            toast.error(errorMessage.data.message);
        }
    }, [isSuccess, error])

    const [active, setActive] = useState(0);

    useEffect(() => {
        if(editCourseData) {
            const courseData = JSON.parse(JSON.stringify(editCourseData));
            setCourseInfo({
                name: courseData.name,
                description: courseData.description,
                categories: courseData.categories || "",
                price: courseData.price,
                tags: courseData.tags || [],
                level: courseData.level,
                levelTo: courseData.levelTo || "",
                courseType: courseData.courseType || "",
                subCategory: courseData.subCategory || "",
                demoUrl: courseData.demoUrl,
                thumbnail: courseData.thumbnail?.url || courseData.thumbnail,
                discountCoupon: courseData.discountCoupon || "",
                discountPercent: courseData.discountPercent || "",
                couponExpiry: courseData.couponExpiry || "",
                daysPerWeek: courseData.daysPerWeek || 1,
                daysOfWeek: courseData.daysOfWeek || [],
                teachers: courseData.teachers || [],
                sourceLinks: courseData.sourceLinks || [],
                maxStudents: courseData.maxStudents?.toString() || "",
            })
            setBenefits(courseData.benefits)
            setPrerequisites(courseData.prerequisites)
            const isLive = courseData.subCategory === "Live";
            const mappedContent = (courseData.courseData || []).map((item: any) => {
                if (isLive) {
                    return {
                        title: item.title || `Session ${item._id}`,
                        startTime: item.startTime || "",
                        endTime: item.endTime || "",
                        description: item.description || "",
                    };
                }
                return {
                    title: item.title || `Lesson ${item._id}`,
                    videoTitle: item.videoSec || item.videoTitle || "",
                    videoUrl: item.videoUrl || "",
                    videoLength: item.videoLength || "",
                    description: item.description || "",
                    links: (item.link || item.links || [{ title: "", url: "" }]).map((l: any) => ({ title: l.title, url: l.url })),
                };
            })
            setCourseContentData(mappedContent)
        }
    }, [editCourseData])

    const [courseInfo, setCourseInfo] = useState({
        name: "",
        description: "",
        categories: "",
        price: "",
        tags: [] as string[],
        level: "",
        levelTo: "",
        courseType: "",
        subCategory: "",
        demoUrl: "",
        thumbnail: "",
        discountCoupon: "",
        discountPercent: "",
        couponExpiry: "",
        daysPerWeek: 1,
        daysOfWeek: [] as string[],
        teachers: [] as string[],
        maxStudents: "",
        sourceLinks: [] as { title: string; url: string }[],
    })

    const [benefits, setBenefits] = useState([{ title: "" }]);

    const [prerequisites, setPrerequisites] = useState([{ title: "" }]);

    const [courseContentData, setCourseContentData] = useState([{
        title: "Lesson 1",
        videoTitle: "",
        videoUrl: "",
        videoLength: "",
        description: "",
        links: [{ title: "", url: "" }],
    }]);

    const [courseData, setCourseData] = useState({});

    const isDrafting = editCourseData?.status === "drafting";

    const buildCourseData = (statusOverride?: string) => {
        const formattedBenefits = (benefits || []).map((benefit) => ({ title: benefit.title }));
        const formattedPrerequisites = (prerequisites || []).map((prerequisite) => ({ title: prerequisite.title }));

        const formattedCourseContentData = (courseContentData || []).map((courseContent) => {
            if (courseInfo.subCategory === "Live") {
                return {
                    title: courseContent.title,
                    startTime: courseContent.startTime,
                    endTime: courseContent.endTime,
                    description: courseContent.description,
                };
            }
            return {
                title: courseContent.title,
                videoSec: courseContent.videoTitle,
                videoUrl: courseContent.videoUrl,
                    videoLength: Number(courseContent.videoLength) || 0,
                description: courseContent.description,
                links: (courseContent.links || []).map((link: any) => ({
                    title: link.title,
                    url: link.url
                })),
            };
        });

        return {
            name: courseInfo.name,
            description: courseInfo.description,
            categories: courseInfo.categories,
            price: courseInfo.price,
            tags: courseInfo.tags,
            level: courseInfo.level,
            levelTo: courseInfo.levelTo || undefined,
            courseType: courseInfo.courseType,
            subCategory: courseInfo.subCategory,
            demoUrl: courseInfo.demoUrl,
            thumbnail: courseInfo.thumbnail,
            discountCoupon: courseInfo.discountCoupon || undefined,
            discountPercent: courseInfo.discountPercent ? Number(courseInfo.discountPercent) : undefined,
            couponExpiry: courseInfo.couponExpiry || undefined,
            status: statusOverride || (isDrafting ? "pending" : (editCourseData?.status || "pending")),
            daysPerWeek: courseInfo.subCategory === "Live" ? courseInfo.daysPerWeek : undefined,
            daysOfWeek: courseInfo.subCategory === "Live" ? courseInfo.daysOfWeek : undefined,
            teachers: courseInfo.subCategory === "Live" ? courseInfo.teachers : undefined,
            maxStudents: courseInfo.subCategory === "Live" ? Number(courseInfo.maxStudents) : undefined,
            sourceLinks: courseInfo.sourceLinks.filter((l: any) => l.title || l.url),
            totalVideos: courseContentData?.length || 0,
            benefits: formattedBenefits,
            prerequisites: formattedPrerequisites,
            courseData: formattedCourseContentData
        };
    }

    const handleSubmit = async () => {
        setCourseData(buildCourseData());
    }

    const handleCreateCourse = async (e: any) => {
        const data = courseData;
        await editCourse({ id: editCourseData?._id, data });
    }

    const handleSaveDraftFromAnyStep = async () => {
        const data = buildCourseData("drafting");
        await editCourse({ id: editCourseData?._id, data });
    }

    return (
        <div className='w-full flex min-h-screen bg-background-Theme'>
            <div className='flex-1 px-4 800px:px-8 1200px:pr-[260px] pt-20 sm:pt-24 pb-16'>
                {/* Mobile / Tablet Horizontal Step Indicator */}
                <div className='block 1200px:hidden mb-6 bg-background-Card_1 p-3 rounded-2xl border border-[#ffffff1a] shadow-sm'>
                    <CourseOptions active={active} setActive={setActive} clickable={true} horizontal={true} />
                </div>

                {active === 0 && (
                    <CourseInfo
                        courseInfo={courseInfo}
                        setCourseInfo={setCourseInfo}
                        active={active}
                        setActive={setActive}
                        isEdit={true}
                        handleSaveDraft={handleSaveDraftFromAnyStep}
                    />
                )}

                {active === 1 && (
                    <CourseContent
                        courseContentData={courseContentData}
                        setCourseContentData={setCourseContentData}
                        handleSubmit={handleSubmit}
                        active={active}
                        setActive={setActive}
                        subCategory={courseInfo.subCategory}
                        isEdit={true}
                        onScheduleChange={(daysPerWeek, daysOfWeek) =>
                            setCourseInfo((prev) => ({ ...prev, daysPerWeek, daysOfWeek }))
                        }
                        onTeachersChange={(teachers) =>
                            setCourseInfo((prev) => ({ ...prev, teachers }))
                        }
                        onMaxStudentsChange={(maxStudents) =>
                            setCourseInfo((prev) => ({ ...prev, maxStudents }))
                        }
                        initialMaxStudents={courseInfo.maxStudents}
                        initialTeachers={courseInfo.teachers}
                        handleSaveDraft={handleSaveDraftFromAnyStep}
                    />
                )}

                {active === 2 && (
                    <CourseData
                        benefits={benefits}
                        setBenefits={setBenefits}
                        prerequisites={prerequisites}
                        setPrerequisites={setPrerequisites}
                        active={active}
                        setActive={setActive}
                        handleSaveDraft={handleSaveDraftFromAnyStep}
                        handleSubmit={handleSubmit}
                    />
                )}

                {active === 3 && (
                    <CoursePreview
                        courseData={courseData}
                        handleCreateCourse={handleCreateCourse}
                        active={active}
                        setActive={setActive}
                        isEdit={!isDrafting}
                    />
                )}
            </div>
            <div className='hidden 1200px:block w-[240px] mt-[100px] h-screen fixed top-18 right-4 z-10'>
                <CourseOptions active={active} setActive={setActive} clickable={true}/>
            </div>
        </div>
    )
}

export default EditCourse
