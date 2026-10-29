"use client";
import React from "react";
import Heading from "../../../utils/Heading";
import AdminSidebar from "../../../pages/admin/AdminSidebar";
import { useSelector } from "react-redux";
import DashboardHeader from "../../../pages/admin/DashboardHeader";
import EditCourse from "../../../../app/pages/course/EditCourse";

// hooks
import Admin_ProtectedRoute from "../../../hooks/Admin_Protected Route";

type Props = {};

const page = ({ params }: any) => {
  const { id } = React.use(params);
  const { user } = useSelector((state: any) => state.auth);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  return (
    <div>
      <Admin_ProtectedRoute>
        <Heading
          title={`${user?.name}`}
          description="Best1 Academy is a platform for students to learn and get help for teachers"
          keywords="Programming, MERN, Redux"
        />

        <div className="flex h-screen overflow-hidden">
          <div className={`${isCollapsed ? "w-0 lg:w-[80px] xl:w-[90px] 2xl:w-[100px]" : "w-0 lg:w-[220px] xl:w-[250px] 2xl:w-[280px]"} transition-all duration-300`}>
            <AdminSidebar 
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              user={user} 
            />
          </div>
          <div className={`${isCollapsed ? "w-full lg:w-[calc(100%-80px)] xl:w-[calc(100%-90px)] 2xl:w-[calc(100%-100px)]" : "w-full lg:w-[calc(100%-220px)] xl:w-[calc(100%-250px)] 2xl:w-[calc(100%-280px)]"} transition-all duration-300 h-screen overflow-y-auto`}>
            <DashboardHeader />
            <EditCourse id={id} />
          </div>
        </div>
      </Admin_ProtectedRoute>
    </div>
  );
};

export default page;
