"use client";
import React, { FC } from "react";
import { useSelector } from "react-redux";

import ProfileInfo from "../pages/profile/ProfileInfo";

type Props = {};

const ProfilePage: FC<Props> = () => {
    const { user } = useSelector((state: any) => state.auth);

    return <ProfileInfo avatar={null} user={user} />;
};

export default ProfilePage;
