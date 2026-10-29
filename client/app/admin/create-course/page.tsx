'use client'
import React, { FC, useState } from 'react'
import { useSelector } from 'react-redux'

// pages

// components
import Heading from '../../utils/Heading'

// hooks
import DashboardHeader from '../../pages/admin/DashboardHeader'
import CreateCourse from '../../pages/course/CreateCourse'
import AdminSidebar from '../../pages/admin/AdminSidebar'

type Props = {}

const page: FC<Props> = (props) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const {user} = useSelector((state: any) => state.auth);

    return (
        <div>
                <Heading
                    title={`${user?.name}`}
                    description="Best1 Academy is a platform for students to learn and get help for teachers"
                    keywords="Programming, MERN, Redux"
                />

                <div className='flex h-screen overflow-hidden'>
                    <div className={`${isCollapsed ? "w-0 lg:w-[80px] xl:w-[90px] 2xl:w-[100px]" : "w-0 lg:w-[220px] xl:w-[250px] 2xl:w-[280px]"} transition-all duration-300`}>
                        <AdminSidebar 
                            isCollapsed={isCollapsed}
                            setIsCollapsed={setIsCollapsed}
                            user={user}
                        />
                    </div>
                    <div className={`${isCollapsed ? "w-full lg:w-[calc(100%-80px)] xl:w-[calc(100%-90px)] 2xl:w-[calc(100%-100px)]" : "w-full lg:w-[calc(100%-220px)] xl:w-[calc(100%-250px)] 2xl:w-[calc(100%-280px)]"} transition-all duration-300 h-screen overflow-y-auto`}>
                        <DashboardHeader/>
                        <CreateCourse/>
                    </div>
                </div>
        </div>
    )
}

export default page;