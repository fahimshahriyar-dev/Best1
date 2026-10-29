"use client";
import React from "react";
import AdminSidebar from "../../pages/admin/AdminSidebar";
import Heading from "../../utils/Heading";
import DashboardHeader from "../../pages/admin/DashboardHeader";
import SellerApplications from "../../pages/admin/SellerApplications";
import { useSelector } from "react-redux";

type Props = {};

const Page = (props: Props) => {
    const { user } = useSelector((state: any) => state.auth);
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <div>
            <Heading
                title="Seller Applications - Best1 Academy"
                description="Best1 Academy is a platform for students to learn and get help from teachers"
                keywords="Programming,MERN,Redux,Machine Learning"
            />
            <div className="flex h-screen overflow-hidden">
                <div className={`${isCollapsed ? "w-0 lg:w-[80px] xl:w-[90px] 2xl:w-[100px]" : "w-0 lg:w-[220px] xl:w-[250px] 2xl:w-[280px]"} transition-all duration-300`}>
                    <AdminSidebar 
                        user={user}
                        isCollapsed={isCollapsed}
                        setIsCollapsed={setIsCollapsed}
                    />
                </div>
                <div className={`${isCollapsed ? "w-full lg:w-[calc(100%-80px)] xl:w-[calc(100%-90px)] 2xl:w-[calc(100%-100px)]" : "w-full lg:w-[calc(100%-220px)] xl:w-[calc(100%-250px)] 2xl:w-[calc(100%-280px)]"} transition-all duration-300 h-screen overflow-y-auto bg-background-Theme`}>
                    <DashboardHeader />
                    <div className="pt-20 sm:pt-24 px-4 sm:px-8 pb-10">
                        <SellerApplications />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
