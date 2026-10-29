"use client";
import React, { FC } from "react";
import { useSelector } from "react-redux";

import EnrolledEbooks from "../../pages/profile/EnrolledEbooks";

type Props = {};

const EnrolledEbooksPage: FC<Props> = () => {
    const { user } = useSelector((state: any) => state.auth);

    return <EnrolledEbooks user={user} />;
};

export default EnrolledEbooksPage;
