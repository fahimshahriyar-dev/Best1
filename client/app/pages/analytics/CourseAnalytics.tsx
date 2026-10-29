import React from 'react'
import Loader from '@/app/components/Loader'
import { useGetCourseAnalyticsQuery } from '@/redux/features/analytics/analyticsApi'
import { BarChart, Bar, ResponsiveContainer, XAxis, Label, YAxis, LabelList } from "recharts";

type Props = {}

import { useTheme } from "next-themes";

const CourseAnalytics = (props: Props) => {
    const { data, isLoading } = useGetCourseAnalyticsQuery({})
    const { theme } = useTheme();

    const analyticsData = data?.courses?.last12Months?.map((item: any) => ({
        name: item.month,
        uv: item.count
    })) || [];

    const minValue = 0;

    // Detect if we are in light mode for chart colors
    const isLightMode = theme === "light";
    const textColor = "rgba(255,255,255,0.8)"; // Keep text white as requested
    const labelColor = "rgba(255,255,255,0.8)";
    const cardBg = isLightMode ? "bg-[#0a0a0a]" : "bg-background-Card_1";

    return (
        <div className="w-full">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="max-w-[1200px] mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 bg-background-Card_1 p-4 sm:p-6 rounded-2xl border dark:border-[#ffffff1a] border-[#0000001a] shadow-xl">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl sm:text-3xl font-bold text-text-basic">
                                    Course Analytics
                                </h1>
                                <span className="bg-blue-600/10 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold border border-blue-600/20 dark:border-blue-600/30">
                                    Total Courses: {data?.totalCourses}
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm dark:opacity-60 opacity-80 text-text-basic mt-1 font-medium">
                                Review your course enrollment performance over the last 12 months
                            </p>
                        </div>
                    </div>

                    {/* Chart Card */}
                    <div className={`${cardBg} p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#ffffff1a] shadow-2xl overflow-hidden`}>
                        <div className="w-full h-[60vh] min-h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis 
                                        dataKey="name" 
                                        stroke={textColor} 
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        domain={[minValue, "auto"]} 
                                        stroke={textColor} 
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Bar 
                                        dataKey="uv" 
                                        fill="#3b82f6" 
                                        radius={[8, 8, 0, 0]}
                                        barSize={40}
                                    >
                                        <LabelList 
                                            dataKey="uv" 
                                            position="top" 
                                            fill={labelColor} 
                                            fontSize={12}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseAnalytics