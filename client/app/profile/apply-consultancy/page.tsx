"use client";
import React, { FC } from "react";
import { useSelector } from "react-redux";

import ApplyConsultancy from "../../pages/profile/ApplyConsultancy";

type Props = {};

const ApplyConsultancyPage: FC<Props> = () => {
    const { user } = useSelector((state: any) => state.auth);

    return <ApplyConsultancy user={user} />;
};

export default ApplyConsultancyPage;
