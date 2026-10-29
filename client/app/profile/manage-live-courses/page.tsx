"use client";
import React, { FC } from "react";
import { useSelector } from "react-redux";

import ManageCourses from "../../pages/profile/ManageCourses";

type Props = {};

const ManageLiveCoursesPage: FC<Props> = () => {
    const { user } = useSelector((state: any) => state.auth);

    return <ManageCourses user={user} defaultSubCategory="Live" />;
};

export default ManageLiveCoursesPage;
