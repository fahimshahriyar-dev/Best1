"use client";
import React from "react";
import Link from "next/link";
import { MdAccessTime, MdPeople, MdDateRange, MdVideocam, MdLocationOn } from "react-icons/md";

type Props = {
    training: any;
};

const TrainingCard: React.FC<Props> = ({ training }) => {
    const statusBadge = () => {
        const cfg: Record<string, string> = {
            upcoming: "bg-blue-500/15 text-blue-600 border-blue-500/40",
            ongoing: "bg-green-600/20 text-[#0D8043] border-green-600/40",
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${cfg[training.status] || ""}`}>
                {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
            </span>
        );
    };

    return (
        <Link
            href={`/training/${training._id}`}
            className="block bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
        >
            <div className="relative h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 overflow-hidden">
                {training.thumbnail?.url ? (
                    <img src={training.thumbnail.url} alt={training.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-hover-text-1/30">{training.title?.charAt(0)}</span>
                    </div>
                )}
                <div className="absolute top-3 right-3">{statusBadge()}</div>
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold text-text-basic line-clamp-2 mb-3 group-hover:text-hover-text-1 transition-colors">
                    {training.title}
                </h3>
                <div className="space-y-2 text-sm text-text-basic opacity-70">
                    <div className="flex items-center gap-2">
                        <MdDateRange size={16} />
                        <span>Starts: {new Date(training.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MdAccessTime size={16} />
                        <span>{training.duration} | {training.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MdPeople size={16} />
                        <span>{training.seatsTotal} seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {training.mode === "Online" ? <MdVideocam size={16} /> : <MdLocationOn size={16} />}
                        <span>{training.mode}</span>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#ffffff1a] flex items-center justify-between">
                    <span className="text-sm text-text-basic opacity-50">{training.trainerName}</span>
                    <span className="text-lg font-bold text-hover-text-1">
                        {training.isFree ? "Free" : `৳${training.price}`}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default TrainingCard;
