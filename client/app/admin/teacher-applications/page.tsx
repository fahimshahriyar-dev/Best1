'use client'
import React from 'react'
import Heading from '../../../app/utils/Heading'
import AdminSidebar from '../../../app/pages/admin/AdminSidebar'
import { useSelector } from 'react-redux'
import DashboardHeader from '../../../app/pages/admin/DashboardHeader'
import TeacherApplications from '../../../app/pages/admin/TeacherApplications'
import Admin_ProtectedRoute from '../../../app/hooks/Admin_Protected Route'

const page = () => {
    const { user } = useSelector((state: any) => state.auth);
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <div>
            <Admin_ProtectedRoute>
                <Heading
                    title="Teacher Applications - Admin"
                    description="Review and manage teacher applications submitted by users."
                    keywords="teacher applications, admin, LMS"
                />
                <div className='flex h-screen overflow-hidden'>
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
                            <TeacherApplications />
                        </div>
                    </div>
                </div>
            </Admin_ProtectedRoute>
        </div>
    )
}

export default page
