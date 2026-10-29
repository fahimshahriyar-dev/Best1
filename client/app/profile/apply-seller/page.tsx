"use client";
import React, { FC } from "react";
import { useSelector } from "react-redux";

import ApplySeller from "../../pages/profile/ApplySeller";

type Props = {};

const ApplySellerPage: FC<Props> = () => {
    const { user } = useSelector((state: any) => state.auth);

    return <ApplySeller user={user} />;
};

export default ApplySellerPage;
