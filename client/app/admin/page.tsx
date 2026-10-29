'use client'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'

// pages

// components
import Heading from '../utils/Heading'
import AdminSidebar from '../pages/admin/AdminSidebar'
import Admin_ProtectedRoute from '../hooks/Admin_Protected Route'

// hooks
import AdminDashboard from '../pages/admin/AdminDashboard'

type Props = {}

const page: FC<Props> = () => {
    const { user } = useSelector((state: any) => state.auth);
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <div>
            <Admin_ProtectedRoute>
                <Heading
                    title="Best1 Academy - Admin"
                    description="Best1 Academy is a platform for students to learn and get help for teachers"
                    keywords="Programming, MERN, Redux"
                />

                <div className='flex h-screen overflow-hidden'>
                    <div className={`${isCollapsed ? "w-0 lg:w-[80px] xl:w-[90px] 2xl:w-[100px]" : "w-0 lg:w-[220px] xl:w-[250px] 2xl:w-[280px]"} transition-all duration-300`}>
                        <AdminSidebar 
                            user={user} 
                            isCollapsed={isCollapsed} 
                            setIsCollapsed={setIsCollapsed} 
                        />
                    </div>
                    <div className={`${isCollapsed ? "w-full lg:w-[calc(100%-80px)] xl:w-[calc(100%-90px)] 2xl:w-[calc(100%-100px)]" : "w-full lg:w-[calc(100%-220px)] xl:w-[calc(100%-250px)] 2xl:w-[calc(100%-280px)]"} transition-all duration-300 h-screen overflow-y-auto  h-screen overflow-y-auto`}>
                        <AdminDashboard isDashboard={true} />
                    </div>
                </div>
            </Admin_ProtectedRoute>
        </div>
    )
}

export default page;