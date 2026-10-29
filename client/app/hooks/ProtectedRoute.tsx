import React from "react";
import { redirect } from "next/navigation";
import UserAuth from "./UserAuth";

interface ProtectedProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({children}: ProtectedProps) {
    const inAuthenticated = UserAuth();
    return inAuthenticated ? children : redirect("/");
}