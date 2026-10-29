"use client";
import EbookReader from "@/app/pages/EbookReader";
import React from "react";

const Page = ({ params }: any) => {
    const resolvedParams = React.use(params);
    return (
        <div>
            <EbookReader id={resolvedParams.id} />
        </div>
    );
};

export default Page;
