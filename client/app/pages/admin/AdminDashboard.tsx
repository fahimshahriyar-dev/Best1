'use client'
import React, { FC, useState } from 'react'

// components
import DashboardHeader from './DashboardHeader';
import DashboardWidgets from '@/app/components/DashboardWidgets';

type Props = {
    isDashboard?: boolean;
};

const AdminDashboard: FC<Props> = ({ isDashboard }) => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <DashboardHeader open={open} setOpen={setOpen}/>
            {
                isDashboard && (
                    <DashboardWidgets open={open}/>
                )
            }
        </div>
    )
}

export default AdminDashboard