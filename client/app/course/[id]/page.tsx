"use client";
import CourseDetails from "../../../app/pages/CourseDetails";
import React from "react";

const page = ({ params }: any) => {
    const resolvedParams = React.use(params);
    return (
        <div>
            <CourseDetails id={resolvedParams.id} />
        </div>
    );
};

export default page;