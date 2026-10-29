"use client";
import EbookDetails from "@/app/pages/EbookDetails";
import React from "react";

const Page = ({ params }: any) => {
    const resolvedParams = React.use(params);
    return (
        <div>
            <EbookDetails id={resolvedParams.id} />
        </div>
    );
};

export default Page;
