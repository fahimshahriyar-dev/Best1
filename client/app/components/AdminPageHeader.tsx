"use client";
import React from "react";

type Props = {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
};

const AdminPageHeader: React.FC<Props> = ({ icon, title, subtitle }) => {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-background-Card_1 border border-text-basic/10 flex items-center justify-center text-text-basic flex-shrink-0 shadow-sm">
                {icon}
            </div>
            <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-basic leading-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xs sm:text-sm text-text-basic opacity-50 mt-0.5">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AdminPageHeader;
