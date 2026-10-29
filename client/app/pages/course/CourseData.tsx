import React, { FC } from 'react'
import toast from 'react-hot-toast';

// icons
import { IoIosAddCircle } from "react-icons/io";

type Props = {
    benefits: { title: string }[];
    setBenefits: (benefits: { title: string }[]) => void;
    prerequisites: { title: string }[];
    setPrerequisites: (prerequisites: { title: string }[]) => void;
    active: number;
    setActive: (active: number) => void;
    handleSaveDraft?: () => void;
    handleSubmit?: () => void;
}

const inputClass = "w-full p-4 rounded-xl bg-background-bar_2 border border-[#ffffff1a] outline-none focus:border-blue-500 transition-all text-text-basic";
const labelClass = "block text-sm font-medium opacity-60 mb-2 text-text-basic";

const CourseData: FC<Props> = ({ benefits, setBenefits, prerequisites, setPrerequisites, active, setActive, handleSaveDraft, handleSubmit: handleCourseSubmit }) => {
    // benefits
    const handleBenefitChange = (index: number, value: any) => {
        const updatedBenefits = [...benefits];
        updatedBenefits[index].title = value;
        setBenefits(updatedBenefits);
    }
    

    // add benefits
    const handleAddBenefit = () => {
        setBenefits([...benefits, {title: ""}])
    }

    // prerequisites
    const handlePrerequisiteChange = (index: number, value: any) => {
        const updatedPrerequisites = [...prerequisites];
        updatedPrerequisites[index].title = value;
        setPrerequisites(updatedPrerequisites);
    }

    // add prerequisites
    const handleAddPrerequisite = () => {
        setPrerequisites([...prerequisites, {title: ""}])
    }

    // previous button
    const prevBtn = () => {
        setActive(active - 1);
    }

    // next button
    const handleOptions = () => {
        if (benefits[benefits.length - 1]?.title !== "" && prerequisites[prerequisites.length - 1]?.title !== "") {
            if (handleCourseSubmit) handleCourseSubmit();
            setActive(active + 1);
        } else {
            toast.error("All fields are required")
        }
    }

    return (
        <div className='w-full mx-auto pt-6 pb-20'>
            <div className="bg-background-Card_1 p-10 rounded-3xl border border-[#ffffff1a] shadow-2xl space-y-8">
                <div>
                    <label className={labelClass}>What are the benefits of students in this course?</label>
                    <div className="space-y-3">
                        {benefits.map((benefit: any, index: number) => (
                            <input 
                                type="text"
                                key={index}
                                name='Benefits'
                                placeholder='You will be able to build a full stack LMS Platform'
                                required
                                value={benefit.title}
                                className={inputClass}
                                onChange={(e) => handleBenefitChange(index, e.target.value)}
                            />
                        ))}
                    </div>
                    <IoIosAddCircle 
                        className='mt-3 cursor-pointer text-[30px] text-blue-400 hover:text-blue-300 transition-colors'
                        onClick={handleAddBenefit}
                    />
                </div>

                <div>
                    <label className={labelClass}>What are the prerequisites for starting this course?</label>
                    <div className="space-y-3">
                        {prerequisites.map((prerequisite: any, index: number) => (
                            <input 
                                type="text"
                                key={index}
                                name='Prerequisites'
                                placeholder='You need basic knowledge of MERN stack'
                                required
                                value={prerequisite.title}
                                className={inputClass}
                                onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                            />
                        ))}
                    </div>
                    <IoIosAddCircle 
                        className='mt-3 cursor-pointer text-[30px] text-blue-400 hover:text-blue-300 transition-colors'
                        onClick={handleAddPrerequisite}
                    />
                </div>

                <div className='flex justify-between gap-4 pt-4'>
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
            </div>
        </div>
    )
}

export default CourseData
