"use client";
import React, { FC } from "react";
import { useSelector } from "react-redux";

import EnrolledClasses from "../../pages/profile/EnrolledClasses";

type Props = {};

const EnrolledLiveCoursesPage: FC<Props> = () => {
    const { user } = useSelector((state: any) => state.auth);

    return <EnrolledClasses user={user} />;
};

export default EnrolledLiveCoursesPage;
