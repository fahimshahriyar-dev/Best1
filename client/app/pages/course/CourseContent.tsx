import React, { FC, useEffect, useState } from 'react'

// icons
import { MdDelete } from "react-icons/md";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { IoLinkSharp, IoClose } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";
import { RiPencilFill } from "react-icons/ri";

// notification
import toast from 'react-hot-toast';
import { useGetTeachersQuery } from '../../../redux/features/user/userApi';
import AnimatedPopup from "../../components/AnimatedPopup";

const dayOptions = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

type Props = {
    courseContentData: any
    setCourseContentData: (setCourseContentData: any) => void
    handleSubmit: any
    active: number;
    setActive: (active: number) => void;
    subCategory?: string;
    isEdit?: boolean;
    onScheduleChange?: (daysPerWeek: number, daysOfWeek: string[]) => void;
    onTeachersChange?: (teachers: string[]) => void;
    onMaxStudentsChange?: (maxStudents: string) => void;
    initialMaxStudents?: string;
    initialTeachers?: string[];
    handleSaveDraft?: () => void;
}

const inputClass = "w-full p-4 rounded-xl bg-background-bar_2 border border-[#ffffff1a] outline-none focus:border-blue-500 transition-all text-text-basic";
const labelClass = "block text-sm font-medium opacity-60 mb-2 text-text-basic";

const CourseContent: FC<Props> = ({ courseContentData, setCourseContentData, handleSubmit: handleCourseSubmit, active, setActive, subCategory, isEdit = false, onScheduleChange, onTeachersChange, onMaxStudentsChange, initialMaxStudents = "", initialTeachers = [], handleSaveDraft }) => {
    const [localDaysPerWeek, setLocalDaysPerWeek] = useState(1);
    const [localDaysOfWeek, setLocalDaysOfWeek] = useState<string[]>([]);
    const [localMaxStudents, setLocalMaxStudents] = useState(initialMaxStudents);

    const [videoUrlLocks, setVideoUrlLocks] = useState<boolean[]>([]);
    const [linkUrlLocks, setLinkUrlLocks] = useState<boolean[][]>([]);

    useEffect(() => {
        if (isEdit && courseContentData) {
            setVideoUrlLocks(courseContentData.map(() => true));
            setLinkUrlLocks(courseContentData.map((item: any) =>
                (item.links || []).map(() => true)
            ));
        }
    }, [isEdit, courseContentData?.length]);

    const toggleVideoUrlLock = (index: number) => {
        setVideoUrlLocks((prev) => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
        });
    };

    const toggleLinkUrlLock = (contentIndex: number, linkIndex: number) => {
        setLinkUrlLocks((prev) => {
            const updated = [...prev];
            updated[contentIndex] = [...(updated[contentIndex] || [])];
            updated[contentIndex][linkIndex] = !updated[contentIndex][linkIndex];
            return updated;
        });
    };
    const { data: teachersData } = useGetTeachersQuery(undefined, {});
    const [isCollapsed, setIsCollapsed] = useState(
        Array(courseContentData?.length || 0).fill(false)
    )

    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
    const [localTeachers, setLocalTeachers] = useState<string[]>(initialTeachers)

    const handleSubmit = (e: any) => {
        e.preventDefault()
    }

    const handleCollapseToggle = (index: number) => {
        const updatedCollapsed = [...isCollapsed];
        updatedCollapsed[index] = !updatedCollapsed[index];
        setIsCollapsed(updatedCollapsed);
    }

    const handleRemoveLink = (index: number, linkIndex: number) => {
        const updatedData = [...courseContentData];
        updatedData[index].links.splice(linkIndex, 1);
        setCourseContentData(updatedData)
    }

    const handleAddLink = (index: number) => {
        const updatedData = [...courseContentData];
        updatedData[index].links.push({ title: "", url: "" });
        setCourseContentData(updatedData)
    }

    const newContentHandler = () => {
        const lastItem = courseContentData?.[courseContentData?.length - 1];
        const isLive = subCategory === "Live";
        if (isLive) {
            if (
                lastItem?.description === "" ||
                lastItem?.startTime === "" ||
                lastItem?.endTime === ""
            ) {
                toast.error("Please fill in the current session fields first");
            } else {
                const sessionNumber = courseContentData.length + 1;
                const newContent = {
                    title: `Session ${sessionNumber}`,
                    startTime: "",
                    endTime: "",
                    description: "",
                }
                setCourseContentData([...courseContentData, newContent]);
                setIsCollapsed([...isCollapsed, false]);
            }
        } else {
            if (
                lastItem?.videoTitle === "" ||
                lastItem?.description === "" ||
                lastItem?.videoUrl === "" ||
                lastItem?.links?.[0]?.title === "" ||
                lastItem?.links?.[0]?.url === ""
            ) {
                toast.error("Please fill in the current lesson fields first");
            } else {
                const lessonNumber = courseContentData.length + 1;
                const newContent = {
                    title: `Lesson ${lessonNumber}`,
                    videoTitle: "",
                    videoUrl: "",
                    videoLength: "",
                    description: "",
                    links: [{ title: "", url: "" }],
                }
                const updatedCollapsed = [...isCollapsed];
                updatedCollapsed[updatedCollapsed.length - 1] = true;
                setCourseContentData([...courseContentData, newContent]);
                setIsCollapsed([...updatedCollapsed, false]);
            }
        }
    }

    const confirmDelete = (index: number) => {
        setDeleteConfirm(index);
    }

    const executeDelete = () => {
        if (deleteConfirm !== null) {
            const updatedData = [...courseContentData];
            updatedData.splice(deleteConfirm, 1);
            setCourseContentData(updatedData);
            setIsCollapsed(isCollapsed.filter((_, i) => i !== deleteConfirm));
            setDeleteConfirm(null);
        }
    }

    const cancelDelete = () => {
        setDeleteConfirm(null);
    }

    const prevBtn = () => {
        setActive(active - 1);
    }

    const handleOptions = () => {
        const lastItem = courseContentData?.[courseContentData?.length - 1];
        const isLive = subCategory === "Live";
        if (isLive) {
            if (
                lastItem?.description === "" ||
                lastItem?.startTime === "" ||
                lastItem?.endTime === ""
            ) {
                toast.error("All fields are required");
            } else {
                setActive(active + 1);
                handleCourseSubmit();
            }
        } else {
            if (
                lastItem?.videoTitle === "" ||
                lastItem?.description === "" ||
                lastItem?.videoUrl === "" ||
                lastItem?.links?.[0]?.title === "" ||
                lastItem?.links?.[0]?.url === ""
            ) {
                toast.error("All fields are required");
            } else {
                setActive(active + 1);
                handleCourseSubmit();
            }
        }
    }

    return (
        <div className='w-full mx-auto pt-6 pb-20'>
            <div className="bg-background-Card_1 p-10 rounded-3xl border border-[#ffffff1a] shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {courseContentData?.map((item: any, index: number) => (
                        <div key={index} className={`${index > 0 ? "mt-8 pt-8 border-t border-[#ffffff1a]" : ""}`}>
                            <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-2'>
                                {subCategory !== "Live" && (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCollapsed[index] ? "bg-blue-500/20 text-blue-400" : "bg-blue-500 text-white"}`}>
                                        {index + 1}
                                    </div>
                                )}
                                {isCollapsed[index] && item.title ? (
                                    <p className='font-Poppins text-text-basic font-medium'>{item.title}</p>
                                ) : null}
                            </div>

                            <div className='flex items-center gap-2'>
                                {subCategory !== "Live" && (
                                    <>
                                        <MdDelete
                                            className={`text-[28px] ${index > 0 ? "cursor-pointer text-red-400 hover:text-red-500" : "cursor-not-allowed opacity-30"}`}
                                            onClick={() => {
                                                if (index > 0) confirmDelete(index)
                                            }}
                                        />
                                        <IoMdArrowDropdownCircle
                                            className={`text-[30px] text-text-basic cursor-pointer transition-transform duration-300 ${isCollapsed[index] ? "rotate-180" : ""}`}
                                            onClick={() => handleCollapseToggle(index)}
                                        />
                                    </>
                                )}
                            </div>
                            </div>

                            {!isCollapsed[index] && (
                                <div className="space-y-4">
                                    {subCategory !== "Live" && (
                                        <div>
                                            <label className={labelClass}>Content Title</label>
                                            <input
                                                type="text"
                                                value={item.title}
                                                className={inputClass}
                                                onChange={(e) => {
                                                    const updatedData = [...courseContentData];
                                                    updatedData[index].title = e.target.value;
                                                    setCourseContentData(updatedData)
                                                }}
                                            />
                                        </div>
                                    )}

                                    {subCategory === "Live" ? (
                                        <>
                                            {index === 0 && (
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                <div>
                                                    <label className={labelClass}>Start Time</label>
                                                    <input
                                                        type="time"
                                                        className={inputClass}
                                                        value={item.startTime}
                                                        onChange={(e) => {
                                                            const updatedData = [...courseContentData];
                                                            updatedData[index].startTime = e.target.value;
                                                            setCourseContentData(updatedData)
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>End Time</label>
                                                    <input
                                                        type="time"
                                                        className={inputClass}
                                                        value={item.endTime}
                                                        onChange={(e) => {
                                                            const updatedData = [...courseContentData];
                                                            updatedData[index].endTime = e.target.value;
                                                            setCourseContentData(updatedData)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            )}

                                            {index === 0 && (
                                                <div className='p-5 bg-background-bar_2 rounded-xl border border-[#ffffff0a] space-y-4'>
                                                    <h3 className='text-base font-semibold text-text-basic'>Course Settings</h3>
                                                    <div>
                                                        <label className={labelClass}>Maximum Students</label>
                                                        <input
                                                            type="number"
                                                            placeholder='e.g. 50'
                                                            min="1"
                                                            className={inputClass}
                                                            value={localMaxStudents}
                                                            onChange={(e) => {
                                                                setLocalMaxStudents(e.target.value);
                                                                if (onMaxStudentsChange) onMaxStudentsChange(e.target.value);
                                                            }}
                                                        />
                                                        <p className='text-xs opacity-40 mt-1'>Set the maximum number of students that can enroll in this course</p>
                                                    </div>
                                                    <h3 className='text-base font-semibold text-text-basic'>Weekly Schedule</h3>
                                                    <div>
                                                        <label className={labelClass}>How many days per week?</label>
                                                        <select
                                                            value={localDaysPerWeek}
                                                            className={inputClass}
                                                            onChange={(e) => {
                                                                const val = Number(e.target.value);
                                                                setLocalDaysPerWeek(val);
                                                                setLocalDaysOfWeek([]);
                                                                if (onScheduleChange) onScheduleChange(val, []);
                                                            }}
                                                        >
                                                            {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => (
                                                                <option key={n} value={n}>{n}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Days you want to take class</label>
                                                        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-2'>
                                                            {Array.from({ length: localDaysPerWeek }, (_, i) => (
                                                                <select
                                                                    key={i}
                                                                    value={localDaysOfWeek[i] || dayOptions[0]}
                                                                    className={inputClass}
                                                                    onChange={(e) => {
                                                                        const updated = [...localDaysOfWeek];
                                                                        updated[i] = e.target.value;
                                                                        setLocalDaysOfWeek(updated);
                                                                        if (onScheduleChange) onScheduleChange(localDaysPerWeek, updated);
                                                                    }}
                                                                >
                                                                    {dayOptions.map((d) => (
                                                                        <option key={d} value={d}>{d}</option>
                                                                    ))}
                                                                </select>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <label className={labelClass}>Description</label>
                                                <textarea
                                                    rows={4}
                                                    placeholder='What will students learn in this session?'
                                                    className={`${inputClass} resize-none`}
                                                    value={item.description}
                                                    onChange={(e) => {
                                                        const updatedData = [...courseContentData];
                                                        updatedData[index].description = e.target.value;
                                                        setCourseContentData(updatedData)
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label className={labelClass}>Assign Teachers</label>
                                                <div className='grid grid-cols-2 md:grid-cols-3 gap-3 mt-2'>
                                                    {teachersData?.teachers?.length > 0 ? (
                                                        teachersData.teachers.map((teacher: any) => (
                                                            <label key={teacher._id} className='flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-background-bar_2 border border-[#ffffff0a] hover:border-blue-500/30 transition-all'>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={localTeachers.includes(teacher._id)}
                                                                    className='w-4 h-4 accent-blue-500'
                                                                    onChange={(e) => {
                                                                        const updated = e.target.checked
                                                                            ? [...localTeachers, teacher._id]
                                                                            : localTeachers.filter((id) => id !== teacher._id);
                                                                        setLocalTeachers(updated);
                                                                        if (onTeachersChange) onTeachersChange(updated);
                                                                    }}
                                                                />
                                                                <span className='text-sm text-text-basic'>{teacher.name}</span>
                                                            </label>
                                                        ))
                                                    ) : (
                                                        <p className='text-sm text-text-muted'>No teachers found</p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <label className={labelClass}>Video Title</label>
                                                <input
                                                    type="text"
                                                    placeholder='Introduction to the course...'
                                                    className={inputClass}
                                                    value={item.videoTitle}
                                                    onChange={(e) => {
                                                        const updatedData = [...courseContentData];
                                                        updatedData[index].videoTitle = e.target.value;
                                                        setCourseContentData(updatedData)
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label className={labelClass}>Video URL</label>
                                                <div className='relative'>
                                                    <input
                                                        type="text"
                                                        placeholder='https://www.youtube.com/course-content'
                                                        disabled={isEdit && videoUrlLocks[index]}
                                                        className={`${inputClass} ${isEdit && videoUrlLocks[index] ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        value={item.videoUrl}
                                                        onChange={(e) => {
                                                            const updatedData = [...courseContentData];
                                                            updatedData[index].videoUrl = e.target.value;
                                                            setCourseContentData(updatedData)
                                                        }}
                                                    />
                                                    {isEdit && (
                                                        <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                                                            {videoUrlLocks[index] ? (
                                                                <RiPencilFill
                                                                    size={16}
                                                                    className="text-background-Icon_1 cursor-pointer"
                                                                    onClick={() => toggleVideoUrlLock(index)}
                                                                />
                                                            ) : (
                                                                <IoClose
                                                                    size={18}
                                                                    className="text-red-400 cursor-pointer"
                                                                    onClick={() => toggleVideoUrlLock(index)}
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className={labelClass}>Video Length (in minutes)</label>
                                                <input
                                                    type="number"
                                                    placeholder='20'
                                                    className={inputClass}
                                                    value={item.videoLength}
                                                    onChange={(e) => {
                                                        const updatedData = [...courseContentData];
                                                        updatedData[index].videoLength = e.target.value;
                                                        setCourseContentData(updatedData)
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label className={labelClass}>Video Description</label>
                                                <textarea
                                                    rows={4}
                                                    placeholder='Write a description for this video...'
                                                    className={`${inputClass} resize-none`}
                                                    value={item.description}
                                                    onChange={(e) => {
                                                        const updatedData = [...courseContentData];
                                                        updatedData[index].description = e.target.value;
                                                        setCourseContentData(updatedData)
                                                    }}
                                                />
                                            </div>

                                            {(item?.links || []).map((link: any, linkIndex: number) => (
                                                <div key={linkIndex} className='p-4 bg-background-bar_2 rounded-xl border border-[#ffffff0a] space-y-3'>
                                                    <div className='flex items-center justify-between'>
                                                        <label className={labelClass}>Link {linkIndex + 1}</label>
                                                        <MdDelete
                                                            className={`text-[20px] ${linkIndex === 0 ? "cursor-not-allowed opacity-30" : "cursor-pointer text-red-400 hover:text-red-500"}`}
                                                            onClick={() => {
                                                                if (linkIndex !== 0) handleRemoveLink(index, linkIndex)
                                                            }}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder='Title'
                                                        className={inputClass}
                                                        value={link.title}
                                                        onChange={(e) => {
                                                            const updatedData = [...courseContentData];
                                                            updatedData[index].links[linkIndex].title = e.target.value;
                                                            setCourseContentData(updatedData)
                                                        }}
                                                    />
                                                    <div className='relative'>
                                                        <input
                                                            type="url"
                                                            placeholder='Source Code'
                                                            disabled={isEdit && linkUrlLocks[index]?.[linkIndex]}
                                                            className={`${inputClass} ${isEdit && linkUrlLocks[index]?.[linkIndex] ? "opacity-50 cursor-not-allowed" : ""}`}
                                                            value={link.url}
                                                            onChange={(e) => {
                                                                const updatedData = [...courseContentData];
                                                                updatedData[index].links[linkIndex].url = e.target.value;
                                                                setCourseContentData(updatedData)
                                                            }}
                                                        />
                                                        {isEdit && (
                                                            <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                                                                {linkUrlLocks[index]?.[linkIndex] ? (
                                                                    <RiPencilFill
                                                                        size={16}
                                                                        className="text-background-Icon_1 cursor-pointer"
                                                                        onClick={() => toggleLinkUrlLock(index, linkIndex)}
                                                                    />
                                                                ) : (
                                                                    <IoClose
                                                                        size={18}
                                                                        className="text-red-400 cursor-pointer"
                                                                        onClick={() => toggleLinkUrlLock(index, linkIndex)}
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className='inline-block'>
                                                <p
                                                    className='flex items-center text-sm text-blue-400 hover:text-blue-300 cursor-pointer font-semibold'
                                                    onClick={() => handleAddLink(index)}
                                                >
                                                    <IoLinkSharp className='mr-2' /> Add Link
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {subCategory !== "Live" && (
                        <div className='pt-4'>
                            <p
                                className='flex items-center text-sm text-blue-400 hover:text-blue-300 cursor-pointer font-semibold w-max'
                                onClick={newContentHandler}
                            >
                                <IoIosAddCircle className='mr-2 text-lg' /> Add New Content
                            </p>
                        </div>
                    )}
                </form>

                <div className='flex justify-between gap-4 pt-8 mt-6 border-t border-[#ffffff1a]'>
                    <button
                        className='w-full md:w-auto px-8 py-4 bg-background-Card_2 hover:bg-background-Card_2/80 text-text-basic font-bold rounded-2xl transition-all border border-[#ffffff1a] cursor-pointer active:scale-95'
                        onClick={() => prevBtn()}
                    >
                        Prev
                    </button>
                    <div className='flex gap-4'>
                        {handleSaveDraft && (
                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                className='w-full md:w-auto px-6 py-4 bg-background-Card_2 hover:bg-background-Card_2/80 text-text-basic font-bold rounded-2xl transition-all border border-[#ffffff1a] cursor-pointer active:scale-95 text-sm'
                            >
                                Save as Draft
                            </button>
                        )}
                        <button
                            className='w-full md:w-auto px-12 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer active:scale-95'
                            onClick={() => handleOptions()}
                        >
                            Next
                        </button>
                    </div>
                </div>

            <AnimatedPopup isOpen={deleteConfirm !== null} onClose={cancelDelete} zIndex={9999}>
                <div className="bg-white dark:bg-background-Card_1 w-full max-w-sm p-7 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl">
                    <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                        <MdDelete size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-text-basic text-center mb-2">
                        Delete Content?
                    </h3>
                    <p className="text-sm text-text-basic opacity-60 text-center mb-6">
                        This will permanently remove this lesson and its content.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={cancelDelete}
                            className="flex-1 py-3 rounded-xl border border-text-input/20 dark:border-white/20 text-text-basic hover:bg-background-Card_2/10 dark:hover:bg-white/10 transition-all text-sm font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={executeDelete}
                            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all"
                        >
                            Delete Content
                        </button>
                    </div>
                </div>
            </AnimatedPopup>
            </div>
        </div>
    )
}

export default CourseContent
