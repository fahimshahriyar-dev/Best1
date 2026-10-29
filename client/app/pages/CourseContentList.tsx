import React, { FC, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";

type Props = {
    data: any[];
    activeVideo?: number;
    setActiveVideo?: any;
    isDemo?: boolean;
};

const formatDuration = (minutes: number): string => {
    if (minutes === 0) return "0m";
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
};

const CourseContentList: FC<Props> = ({ data, activeVideo, setActiveVideo, isDemo }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            {data.map((item: any, index: number) => {
                const isOpen = expandedIndex === index;
                const itemMinutes = Number(item.videoLength || 0);

                return (
                    <div key={item._id || index} className="border-b border-[#ffffff1a] last:border-b-0">
                        <button
                            className="w-full flex items-center justify-between py-3.5 px-4 hover:bg-white/5 transition-colors cursor-pointer text-left"
                            onClick={() => toggleItem(index)}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`}>
                                    <BsChevronDown size={16} className="text-text-basic/60" />
                                </span>
                                <h3 className="text-[16px] font-semibold text-text-basic">Lesson {index + 1}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-text-basic/50">{formatDuration(itemMinutes)}</span>
                            </div>
                        </button>

                        {isOpen && (
                            <div className="pb-4 px-4 pl-12">
                                <div className={`flex items-center gap-3 ${isDemo ? "" : "cursor-pointer"}`}
                                    onClick={() => isDemo ? null : setActiveVideo(index)}
                                >
                                    <MdOutlineOndemandVideo size={24} className="text-[#1cdada] shrink-0" />
                                    <span className="text-[17px] text-text-basic">{item.videoSec || item.videoTitle || item.title}</span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CourseContentList;
