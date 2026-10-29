'use client'
import React, { useEffect, useState } from 'react'

// component
import CourseInfo from './CourseInfo';
import CourseOptions from './CourseOptions';
import CourseData from './CourseData';
import CourseContent from './CourseContent';
import CoursePreview from './CoursePreview';
import { useCreateCourseMutation } from '../../../redux/features/courses/coursesApi';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import AdminPageHeader from '../../components/AdminPageHeader';
import { BiSolidVideoPlus } from 'react-icons/bi';

type Props = {}

const CreateCourse = (props: Props) => {
    const [createCourse, {isLoading, isSuccess, error}] = useCreateCourseMutation();

    useEffect(() => {
        if(isSuccess) {
            toast.success("Course created successfully");
            redirect("/admin/courses")
        }

        if(error) {
            const errorMessage = error as any;
            toast.error(errorMessage.data.message);
        }
    }, [isLoading, isSuccess, error])

    const [active, setActive] = useState(0);

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
        daysPerWeek: 1 as number,
        daysOfWeek: [] as string[],
        teachers: [] as string[],
        maxStudents: "" as string,
        sourceLinks: [] as { title: string; url: string }[],
    })

    const [benefits, setBenefits] = useState([{ title: "" }]);

    const [prerequisites, setPrerequisites] = useState([{ title: "" }]);

    type CourseContentItem = {
        title: string;
        videoTitle: string;
        videoUrl: string;
        videoLength: string;
        description: string;
        links: { title: string; url: string }[];
        startTime?: string;
        endTime?: string;
    };

    const [courseContentData, setCourseContentData] = useState<CourseContentItem[]>([{
        title: "Lesson 1",
        videoTitle: "",
        videoUrl: "",
        videoLength: "",
        description: "",
        links: [
            {
                title: "",
                url: "",
            }
        ],
        startTime: "",
        endTime: "",
    }]);

    const [courseData, setCourseData] = useState({});

    const handleSubmit = async () => {
        const formattedBenefits = benefits.map((benefit) => ({ title: benefit.title }));
        const formattedPrerequisites = prerequisites.map((prerequisite) => ({ title: prerequisite.title }));

        const formattedCourseContentData = courseContentData.map((courseContent) => {
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
                links: courseContent.links.map((link) => ({
                    title: link.title,
                    url: link.url
                })),
            };
        });

        const data = {
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
            daysPerWeek: courseInfo.subCategory === "Live" ? courseInfo.daysPerWeek : undefined,
            daysOfWeek: courseInfo.subCategory === "Live" ? courseInfo.daysOfWeek : undefined,
            teachers: courseInfo.subCategory === "Live" ? courseInfo.teachers : undefined,
            maxStudents: courseInfo.subCategory === "Live" ? Number(courseInfo.maxStudents) : undefined,
            sourceLinks: courseInfo.sourceLinks.filter(l => l.title || l.url),
            status: "pending",
            totalVideos: courseContentData.length,
            benefits: formattedBenefits,
            prerequisites: formattedPrerequisites,
            courseData: formattedCourseContentData
        }

        setCourseData(data);
    }

    const handleCreateCourse = async (e: any) => {
        const data = courseData;
        if(!isLoading) {
            await createCourse(data);
        }
    }

    const handleSaveDraft = async (e: any) => {
        const data = { ...courseData, status: "drafting" };
        if(!isLoading) {
            await createCourse(data);
        }
    }

    const handleSaveDraftFromAnyStep = async () => {
        await handleSubmit();
        await handleSaveDraft(undefined);
    }

    return (
        <div className='w-full flex min-h-screen bg-background-Theme'>
            <div className='flex-1 pt-20 sm:pt-24 px-4 sm:px-8 1200px:pr-[260px] pb-16'>
                <AdminPageHeader
                    icon={<BiSolidVideoPlus size={20} />}
                    title="Add Course"
                    subtitle="Create and configure a new course step by step"
                />

                {/* Mobile / Tablet Horizontal Step Indicator */}
                <div className='block 1200px:hidden mb-6 bg-background-Card_1 p-3 rounded-2xl border border-[#ffffff1a] shadow-sm'>
                    <CourseOptions active={active} setActive={setActive} horizontal={true} />
                </div>

                {active === 0 && (
                    <CourseInfo
                        courseInfo={courseInfo}
                        setCourseInfo={setCourseInfo}
                        active={active}
                        setActive={setActive}
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
                        handleSaveDraft={handleSaveDraft}
                        active={active}
                        setActive={setActive}
                    />
                )}
            </div>
            <div className='w-[240px] mt-[100px] h-screen fixed top-18 right-4 z-10 hidden 1200px:block'>
                <CourseOptions active={active} setActive={setActive}/>
            </div>
        </div>
    )
}

export default CreateCourse
