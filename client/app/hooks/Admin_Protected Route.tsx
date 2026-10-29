import React from "react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

interface ProtectedProps {
    children: React.ReactNode;
    isTeacherAllowed?: boolean;
}

export default function Admin_ProtectedRoute({children, isTeacherAllowed}: ProtectedProps) {
    const { user } = useSelector((state: any) => state.auth);
    if(user) {
        const isAllowed = user?.role === "superadmin" || user?.role === "admin" || user?.role === "moderator" || (isTeacherAllowed && user?.role === "teacher");
        return isAllowed ? children : redirect("/");
    }
}