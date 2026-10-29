"use client";
import React, { useState } from "react";
import Heading from "../../../app/utils/Heading";
import Header from "../../../app/components/Header";
import { useGetSingleTrainingQuery } from "../../../redux/features/training/trainingApi";
import { useParams } from "next/navigation";
import {
    MdAccessTime, MdPeople, MdDateRange, MdVideocam, MdLocationOn,
    MdCheckCircle, MdStar, MdSchool, MdMenuBook, MdPriceCheck
} from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import Loader from "../../components/Loader";

const Page = () => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");
    const { id } = useParams();

    const { data, isLoading } = useGetSingleTrainingQuery(id);

    const training = data?.training;

    if (isLoading) return <Loader />;
    if (!training) return <div className="text-center py-20 text-text-basic">Training not found.</div>;

    const statusBadge = () => {
        const cfg: Record<string, string> = {
            upcoming: "bg-blue-500/15 text-blue-600 border-blue-500/40",
            ongoing: "bg-green-600/20 text-[#0D8043] border-green-600/40",
            completed: "bg-gray-500/15 text-gray-600 border-gray-500/40",
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${cfg[training.status] || ""}`}>
                {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
            </span>
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Heading title={`${training.title} | Best1 Academy`} description={training.description} keywords="training" />
            <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
            <div className="flex-grow bg-background-Theme">
                <div className="w-[95%] 800px:w-[85%] m-auto mt-10 py-16">
                    {/* Hero */}
                    <div className="bg-background-Card_1 rounded-3xl border border-[#ffffff1a] shadow-2xl overflow-hidden mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="h-64 lg:h-auto bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                                {training.thumbnail?.url ? (
                                    <img src={training.thumbnail.url} alt={training.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-6xl font-bold text-hover-text-1/30">{training.title?.charAt(0)}</span>
                                )}
                            </div>
                            <div className="p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-3">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-text-basic">{training.title}</h1>
                                    {statusBadge()}
                                </div>
                                <p className="text-text-basic opacity-70 mb-6">{training.description}</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-text-basic opacity-70"><MdDateRange size={18} /> Starts: {new Date(training.startDate).toLocaleDateString()}</div>
                                    {training.endDate && <div className="flex items-center gap-2 text-text-basic opacity-70"><MdDateRange size={18} /> Ends: {new Date(training.endDate).toLocaleDateString()}</div>}
                                    <div className="flex items-center gap-2 text-text-basic opacity-70"><MdAccessTime size={18} /> {training.duration}</div>
                                    <div className="flex items-center gap-2 text-text-basic opacity-70"><MdAccessTime size={18} /> {training.schedule}</div>
                                    <div className="flex items-center gap-2 text-text-basic opacity-70">{training.mode === "Online" ? <MdVideocam size={18} /> : <MdLocationOn size={18} />} {training.mode}</div>
                                    <div className="flex items-center gap-2 text-text-basic opacity-70"><MdPeople size={18} /> {training.seatsTotal} seats</div>
                                </div>
                                {training.mode === "Online" && training.meetingLink && (
                                    <a href={training.meetingLink} target="_blank" className="mt-4 text-sm text-blue-500 hover:underline">Join Meeting Link</a>
                                )}
                                {training.mode === "Offline" && training.venue && (
                                    <p className="mt-4 text-sm text-text-basic opacity-70"><MdLocationOn size={16} className="inline" /> {training.venue}</p>
                                )}
                                <div className="mt-6">
                                    <span className="text-3xl font-bold text-hover-text-1">{training.isFree ? "Free" : `৳${training.price}`}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Outcomes */}
                            {training.outcomes?.length > 0 && (
                                <div className="bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl p-6">
                                    <h2 className="text-xl font-bold text-text-basic mb-4 flex items-center gap-2"><MdStar className="text-hover-text-1" /> What You'll Learn</h2>
                                    <ul className="space-y-3">
                                        {training.outcomes.map((item: any, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-text-basic">
                                                <MdCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                                                <span>{item.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Eligibility */}
                            {training.eligibility?.length > 0 && (
                                <div className="bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl p-6">
                                    <h2 className="text-xl font-bold text-text-basic mb-4 flex items-center gap-2"><MdSchool className="text-hover-text-1" /> Eligibility</h2>
                                    <ul className="space-y-3">
                                        {training.eligibility.map((item: any, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-text-basic">
                                                <MdCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
                                                <span>{item.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Modules */}
                            {training.modules?.length > 0 && (
                                <div className="bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl p-6">
                                    <h2 className="text-xl font-bold text-text-basic mb-4 flex items-center gap-2"><MdMenuBook className="text-hover-text-1" /> Modules</h2>
                                    <div className="space-y-4">
                                        {training.modules.map((mod: any, i: number) => (
                                            <div key={i} className="bg-black/5 dark:bg-white/5 rounded-xl p-4">
                                                <h3 className="font-semibold text-text-basic mb-2">Module {i + 1}: {mod.moduleTitle}</h3>
                                                {mod.topics?.length > 0 && (
                                                    <ul className="space-y-1 ml-4">
                                                        {mod.topics.map((topic: any, ti: number) => (
                                                            <li key={ti} className="text-sm text-text-basic opacity-70 flex items-start gap-2">
                                                                <span className="text-hover-text-1 mt-1">•</span>
                                                                {topic.title}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Inclusions */}
                            {training.inclusions?.length > 0 && (
                                <div className="bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl p-6">
                                    <h2 className="text-xl font-bold text-text-basic mb-4 flex items-center gap-2"><MdCheckCircle className="text-hover-text-1" /> Inclusions</h2>
                                    <ul className="space-y-3">
                                        {training.inclusions.map((item: any, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-text-basic">
                                                <MdCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                                                <span>{item.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Trainer Info */}
                        <div className="space-y-6">
                            <div className="bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl p-6">
                                <h2 className="text-xl font-bold text-text-basic mb-4">Trainer</h2>
                                <div className="flex flex-col items-center text-center">
                                    {training.trainerPhoto?.url ? (
                                        <img src={training.trainerPhoto.url} alt={training.trainerName} className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-hover-text-1/30" />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-hover-text-1/20 flex items-center justify-center text-3xl font-bold text-hover-text-1 mb-4">
                                            {training.trainerName?.charAt(0)}
                                        </div>
                                    )}
                                    <h3 className="text-lg font-semibold text-text-basic">{training.trainerName}</h3>
                                    <p className="text-sm text-text-basic opacity-60">{training.trainerDesignation}</p>
                                    <p className="text-xs text-text-basic opacity-40 mt-1">{training.trainerExperience} experience</p>
                                    {training.trainerBio && (
                                        <p className="text-sm text-text-basic opacity-70 mt-3">{training.trainerBio}</p>
                                    )}
                                    {training.trainerLinkedin && (
                                        <a href={training.trainerLinkedin} target="_blank" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 text-blue-500 text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all">
                                            <FaLinkedin size={16} /> LinkedIn
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl p-6">
                                <h2 className="text-xl font-bold text-text-basic mb-4 flex items-center gap-2"><MdPriceCheck className="text-hover-text-1" /> Pricing</h2>
                                <div className="text-center">
                                    <span className="text-3xl font-bold text-hover-text-1">{training.isFree ? "Free" : `৳${training.price}`}</span>
                                    <p className="text-sm text-text-basic opacity-50 mt-1">{training.seatsTotal} seats available</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
