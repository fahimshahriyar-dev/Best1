"use client";
import React, { FC } from "react";
import { useSelector } from "react-redux";

import ManageCourses from "../../pages/profile/ManageCourses";

type Props = {};

const ManageCoursesPage: FC<Props> = () => {
    const { user } = useSelector((state: any) => state.auth);

    return <ManageCourses user={user} />;
};

export default ManageCoursesPage;
