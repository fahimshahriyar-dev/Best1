"use client";
import React, { FC } from "react";
import { useSelector } from "react-redux";

import EnrolledCourses from "../../pages/profile/EnrolledCourses";

type Props = {};

const EnrolledCoursesPage: FC<Props> = () => {
    const { user } = useSelector((state: any) => state.auth);

    return <EnrolledCourses user={user} />;
};

export default EnrolledCoursesPage;
