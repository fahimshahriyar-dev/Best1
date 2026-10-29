import React, { FC } from 'react'
import { IoIosCheckmarkCircle } from "react-icons/io";

type Props = {
    active: number;
    setActive: (active: number) => void;
    clickable?: boolean;
    horizontal?: boolean;
}

const CourseOptions: FC<Props> = ({ active, setActive, clickable = false, horizontal = false }) => {
    const options = [
        "Course Information",
        "Course Content",
        "Course Options",
        "Course Preview",
    ]

    if (horizontal) {
        return (
            <div className="w-full grid grid-cols-4 gap-1 py-1 px-1">
                {options.map((option: any, index: number) => (
                    <div
                        key={index}
                        className={`flex flex-col items-center justify-center text-center p-1 rounded-lg ${clickable ? "cursor-pointer" : ""}`}
                        onClick={() => clickable && setActive(index)}
                    >
                        <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 mb-1.5 ${
                                active > index
                                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                                    : active === index
                                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-500/20"
                                    : "bg-background-bar_2 text-text-basic/60"
                            }`}
                        >
                            {active > index ? (
                                <IoIosCheckmarkCircle className="text-[18px] sm:text-[20px]" />
                            ) : (
                                <span className="text-xs font-bold">{index + 1}</span>
                            )}
                        </div>
                        <span className={`text-[11px] sm:text-xs font-semibold leading-tight text-center ${
                            active >= index ? "text-text-basic" : "text-text-basic opacity-40"
                        }`}>
                            {option}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return (
        <div className="relative mt-4 px-2">
            {options.map((option: any, index: number) => (
                <div
                    key={index}
                    className={`relative flex items-start py-4 ${clickable ? "cursor-pointer" : ""}`}
                    onClick={() => clickable && setActive(index)}
                >
                    {index < options.length - 1 && (
                        <div
                            className={`absolute left-[19px] top-10 w-[2.5px] h-[calc(100%-8px)] transition-all duration-500 ${
                                active > index ? "bg-blue-500" : "bg-background-bar_2"
                            }`}
                        />
                    )}
                    <div
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                            active > index
                                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                                : active === index
                                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 ring-[3px] ring-blue-500/20"
                                : "bg-background-bar_2 text-text-basic/60"
                        }`}
                    >
                        {active > index ? (
                            <IoIosCheckmarkCircle className='text-[24px]'/>
                        ) : (
                            <span className='text-sm font-bold'>{index + 1}</span>
                        )}
                    </div>
                    <div className={`ml-4 pt-1.5 transition-all duration-300 ${active === index ? "translate-x-0.5" : ""}`}>
                        <h5 className={`text-sm font-semibold transition-all duration-300 ${
                            active >= index ? "text-text-basic" : "text-text-basic opacity-40"
                        }`}>
                            {option}
                        </h5>
                        <p className={`text-[11px] mt-0.5 transition-all duration-300 ${
                            active >= index ? "opacity-40" : "opacity-20"
                        }`}>
                            {active > index ? "Completed" : active === index ? "In Progress" : `Step ${index + 1}`}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CourseOptions
