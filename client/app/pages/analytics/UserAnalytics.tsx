import React, { FC } from 'react'
import Loader from '../../../app/components/Loader'
import { useGetUserAnalyticsQuery } from '../../../redux/features/analytics/analyticsApi'
import { ResponsiveContainer, XAxis, YAxis, AreaChart, Area, Tooltip } from "recharts";

type Props = {
    isDashboard?: boolean;
}

import { useTheme } from "next-themes";

const UserAnalytics: FC<Props> = ({ isDashboard }) => {
    const { data, isLoading } = useGetUserAnalyticsQuery({})
    const { theme } = useTheme();

    const analyticsData = (data?.users?.last12Months || []).map((item: any) => ({
        name: item.month,
        count: item.count
    }));

    // Detect if we are in light mode for chart colors
    const isLightMode = theme === "light";
    const textColor = "rgba(255,255,255,0.8)"; // Keep text white as requested
    const tooltipBg = "#1a1a1a";
    const tooltipColor = "#fff";
    const gridColor = "rgba(255,255,255,0.1)";
    const cardBg = isLightMode ? "bg-[#0a0a0a]" : "bg-background-Card_1";

    return (
        <div className="w-full">
            {isLoading ? (
                <Loader />
            ) : (
                <div className={`${!isDashboard ? "max-w-[1200px] mx-auto" : ""}`}>
                    {/* Header Section (Only for full page) */}
                    {!isDashboard && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 bg-background-Card_1 p-4 sm:p-6 rounded-2xl border dark:border-[#ffffff1a] border-[#0000001a] shadow-xl">
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-text-basic">
                                        User Analytics
                                    </h1>
                                    <span className="bg-blue-600/10 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold border border-blue-600/20 dark:border-blue-600/30">
                                        Total Users: {data?.totalUsers}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm dark:opacity-60 opacity-80 text-text-basic mt-1 font-medium">
                                    Track your platform's user growth over the last 12 months
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Chart Card */}
                    <div className={`${isDashboard ? "" : `${cardBg} p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#ffffff1a] shadow-2xl overflow-hidden`}`}>
                        {isDashboard && (
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-text-basic">User Analytics</h2>
                            </div>
                        )}
                        <div className={`w-full ${isDashboard ? "h-[300px]" : "h-[60vh] min-h-[400px]"}`}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart margin={{ top: 20, right: 30, left: 0, bottom: 0 }} data={analyticsData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="name" 
                                        stroke={textColor} 
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        stroke={textColor} 
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: tooltipBg, 
                                            border: `1px solid ${gridColor}`, 
                                            borderRadius: '12px', 
                                            color: tooltipColor 
                                        }}
                                        itemStyle={{ color: tooltipColor }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke='#3b82f6'
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAnalytics