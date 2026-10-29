import React, { FC, useEffect, useState } from 'react'
import UserAnalytics from '../pages/analytics/UserAnalytics';
import OrderAnalytics from '../pages/analytics/OrderAnalytics';
import Invoices from '../pages/order/Invoices';
import { BiBorderLeft } from 'react-icons/bi';
import { PiUsersFourLight } from 'react-icons/pi';
import { Box, CircularProgress } from '@mui/material';
import { useGetOrderAnalyticsQuery, useGetUserAnalyticsQuery } from '@/redux/features/analytics/analyticsApi';

type Props = {
    open?: boolean;
    value?: number;
}

const CircularProgramWithLabel: FC<Props> = ({ open, value }) => {
    return (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
                variant='determinate'
                value={value}
                size={45}
                color={value && value > 50 ? "info" : "error"}
                thickness={4}
                style={{ zIndex: open ? -1 : 1 }}
            />
            <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="text-[10px] font-bold">{value}%</span>
            </Box>
        </Box>
    )
}

const DashboardWidgets: FC<Props> = ({ open }) => {
    const { data: userData, isLoading: userLoading } = useGetUserAnalyticsQuery({});
    const { data: orderData, isLoading: orderLoading } = useGetOrderAnalyticsQuery({});

    const [userComparePercentage, setUserComparePercentage] = useState(0);
    const [orderComparePercentage, setOrderComparePercentage] = useState(0);

    useEffect(() => {
        if (userData?.users?.last12Months) {
            const lastTwoMonths = userData.users.last12Months.slice(-2);
            if (lastTwoMonths.length === 2) {
                const prev = lastTwoMonths[0].count;
                const curr = lastTwoMonths[1].count;
                const percent = prev === 0 ? curr * 100 : ((curr - prev) / prev) * 100;
                setUserComparePercentage(Math.round(percent));
            }
        }
        if (orderData?.orders?.last12Months) {
            const lastTwoMonths = orderData.orders.last12Months.slice(-2);
            if (lastTwoMonths.length === 2) {
                const prev = lastTwoMonths[0].count;
                const curr = lastTwoMonths[1].count;
                const percent = prev === 0 ? curr * 100 : ((curr - prev) / prev) * 100;
                setOrderComparePercentage(Math.round(percent));
            }
        }
    }, [userData, orderData]);

    const totalUsers = userData?.users?.last12Months?.reduce((acc: number, item: any) => acc + item.count, 0) || 0;
    const totalOrders = orderData?.orders?.last12Months?.reduce((acc: number, item: any) => acc + item.count, 0) || 0;

    const scrollRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [userData, orderData]);

    return (
        <div className='bg-background-Theme min-h-screen pt-20 sm:pt-24 px-4 sm:px-8 pb-8'>
            <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
                {/* Left Column - Charts */}
                <div className="w-full xl:w-[75%] flex flex-col gap-6">
                    <div className="bg-background-Card_1 rounded-xl border border-[#ffffff1a] p-2 sm:p-4 shadow-lg overflow-hidden">
                        <UserAnalytics isDashboard={true} />
                    </div>
                    <div className="bg-background-Card_1 rounded-xl border border-[#ffffff1a] p-2 sm:p-4 shadow-lg overflow-hidden">
                        <OrderAnalytics isDashboard={true} />
                    </div>
                </div>

                {/* Right Column - Stats & Transactions */}
                <div className="w-full xl:w-[25%] flex flex-col gap-6">
                    {/* Stat Card 1 */}
                    <div className="h-[140px] bg-background-Card_1 p-6 rounded-xl border border-[#ffffff1a] shadow-lg flex items-center justify-between group hover:border-blue-500 transition-all duration-300">
                        <div className="flex flex-col justify-between h-full">
                            <BiBorderLeft size={28} className="text-blue-500" />
                            <div>
                                <h5 className="text-2xl font-bold text-text-basic">{totalOrders}</h5>
                                <h5 className="text-sm opacity-60">Sales Obtained</h5>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-y-2">
                            <CircularProgramWithLabel value={orderComparePercentage > 0 ? (orderComparePercentage > 100 ? 100 : orderComparePercentage) : 0} open={open} />
                            <h5 className={`text-sm font-bold ${orderComparePercentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {orderComparePercentage >= 0 ? "+" : ""}{orderComparePercentage}%
                            </h5>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="h-[140px] bg-background-Card_1 p-6 rounded-xl border border-[#ffffff1a] shadow-lg flex items-center justify-between group hover:border-purple-500 transition-all duration-300">
                        <div className="flex flex-col justify-between h-full">
                            <PiUsersFourLight size={28} className="text-purple-500" />
                            <div>
                                <h5 className="text-2xl font-bold text-text-basic">{totalUsers}</h5>
                                <h5 className="text-sm opacity-60">New Users</h5>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-y-2">
                            <CircularProgramWithLabel value={userComparePercentage > 0 ? (userComparePercentage > 100 ? 100 : userComparePercentage) : 0} open={open} />
                            <h5 className={`text-sm font-bold ${userComparePercentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {userComparePercentage >= 0 ? "+" : ""}{userComparePercentage}%
                            </h5>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-background-Card_1 rounded-xl border border-[#ffffff1a] shadow-lg overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-[#ffffff1a] bg-background-Card_1 sticky top-0 z-10">
                            <h5 className="text-lg font-bold text-text-basic">Recent Transactions</h5>
                        </div>
                        <div ref={scrollRef} className="overflow-y-auto p-2 custom-scrollbar max-h-[400px]">
                            <Invoices isDashboard={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardWidgets