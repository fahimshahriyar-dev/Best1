"use client";
import React, { FC } from "react";
import { useSelector } from "react-redux";

import ApplyTeacher from "../../pages/profile/ApplyTeacher";

type Props = {};

const ApplyTeacherPage: FC<Props> = () => {
    const { user } = useSelector((state: any) => state.auth);

    return <ApplyTeacher user={user} />;
};

export default ApplyTeacherPage;
