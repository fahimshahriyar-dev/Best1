"use client";
import React, { FC, useState } from "react";
import { useSelector } from "react-redux";

import ProfileSidebar from "../components/ProfileSidebar";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import ProtectedRoute from "../hooks/ProtectedRoute";

type Props = {
    children: React.ReactNode;
};

const ProfileLayout: FC<Props> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("SignIn");
    const { user } = useSelector((state: any) => state.auth);

    return (
        <ProtectedRoute>
            <Heading
                title={`${user?.name}`}
                description="Best1 Academy is a platform for students to learn and get help for teachers"
                keywords="Programming, MERN, Redux"
            />
            <Header
                open={open}
                setOpen={setOpen}
                route={route}
                setRoute={setRoute}
            />
            <div className="bg-background-Theme min-h-screen">
                <div className="container flex lg:gap-6 pt-[100px] pb-10">
                    <ProfileSidebar user={user} />
                    <div className="flex-1 min-w-0 pt-14 lg:pt-0">
                        {children}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default ProfileLayout;
