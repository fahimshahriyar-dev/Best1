import React, { FC, useEffect, useState } from "react";
import { ThemeSwitcher } from "../../utils/ThemeSwitcher";
import {
    useGetAllNotificationsQuery,
    useUpdateNotificationStatusMutation,
} from "@/redux/features/notifications/notificationsApi";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";

const socket = socketIO(ENDPOINT, { transports: ["websocket"] }); 

// icons
import { IoMdNotifications } from "react-icons/io";
import { HiOutlineBars3 } from "react-icons/hi2";
import { format } from "timeago.js";
import { toggleAdminSidebar } from "../../utils/adminSidebar";

type Props = {
    open?: boolean;
    setOpen?: any;
};

const DashboardHeader: FC<Props> = ({ open: propOpen, setOpen: propSetOpen }) => {
    // Internal state if props not provided
    const [internalOpen, setInternalOpen] = useState(false);
    const open = propOpen !== undefined ? propOpen : internalOpen;
    const setOpen = propSetOpen !== undefined ? propSetOpen : setInternalOpen;

    const { data, refetch } = useGetAllNotificationsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [updateNotificationStatus, { isSuccess }] =
        useUpdateNotificationStatusMutation();
    const [notifications, setNotifications] = useState<any>([]);

    const [notificationAudio] = useState(
        typeof Audio !== "undefined"
            ? new Audio(
                "https://res.cloudinary.com/damk25wo5/video/upload/v1693465789/notification_vcetjn.mp3"
            )
            : null
    );

    const playNotificationSound = () => {
        if (notificationAudio) {
            notificationAudio.play().catch((e) => console.error("Error playing audio:", e));
        }
    };

    useEffect(() => {
        if (data) {
            setNotifications(data.notifications);
        }
        if (isSuccess) {
            refetch();
        }
    }, [data, isSuccess, refetch]);

    const unreadNotifications = notifications.filter((item: any) => item.status === "unread");

    useEffect(() => {
        if (!ENDPOINT) return;

        socket.on("newNotification", (data) => {
            refetch();
            playNotificationSound();
        });

        return () => {
            socket.off("newNotification");
        };
    }, [refetch]);

    const handleNotificationStatusChange = async (id: string) => {
        await updateNotificationStatus(id);
    };

    return (
        <div className="w-full flex items-center justify-end p-3 sm:p-6 fixed top-0 right-0 z-30 bg-[#F8F9FA]/90 dark:bg-background-Theme/80 backdrop-blur-md border-b border-black/5 dark:border-[#ffffff1a]">
            <div className="flex items-center gap-2 sm:gap-4">
                <ThemeSwitcher />
                <div
                    className="relative cursor-pointer m-1 sm:m-2"
                    onClick={() => setOpen(!open)}
                >
                    <IoMdNotifications className="text-[26px] sm:text-[28px] text-text-basic hover:text-blue-500 transition-colors" />
                    {unreadNotifications && unreadNotifications.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white font-bold animate-pulse shadow-lg">
                            {unreadNotifications.length}
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={toggleAdminSidebar}
                    aria-label="Toggle admin sidebar"
                    className="lg:hidden p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all text-text-basic flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                    <HiOutlineBars3 className="text-[26px] sm:text-[28px]" />
                </button>
            </div>

            {open && (
                <div className="w-[calc(100vw-2rem)] max-w-[380px] max-h-[60vh] bg-background-Card_1 shadow-2xl absolute top-16 sm:top-20 right-4 sm:right-6 z-40 rounded-2xl border border-[#ffffff1a] overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-[#ffffff1a] bg-background-Card_1 flex justify-between items-center">
                        <div>
                            <h5 className="text-lg font-semibold text-text-basic">
                                Notifications
                            </h5>
                            <p className="text-[10px] opacity-50">History saved to database</p>
                        </div>
                        <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md font-medium">
                            {unreadNotifications.length} New
                        </span>
                    </div>
                    
                    <div className="overflow-y-auto custom-scrollbar flex-1">
                        {notifications && notifications.length > 0 ? (
                            [...notifications].reverse().map((item: any) => (
                                <div 
                                    key={item._id || item.id} 
                                    className={`p-4 border-b border-[#ffffff0a] hover:bg-[#ffffff05] transition-colors group ${item.status !== "unread" ? "opacity-60" : ""}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            {item.status === "unread" && (
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            )}
                                            <h6 className="text-sm font-bold text-text-basic line-clamp-1">
                                                {item.title}
                                            </h6>
                                        </div>
                                        {item.status === "unread" && (
                                            <button
                                                onClick={() => handleNotificationStatusChange(item._id)}
                                                className="text-[10px] text-blue-500 hover:underline font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-text-basic opacity-70 mb-2 leading-relaxed">
                                        {item.message}
                                    </p>
                                    <span className="text-[10px] text-text-basic opacity-40 italic">
                                        {format(item.createdAt)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center p-10 text-center opacity-50">
                                <IoMdNotifications className="text-4xl mb-2" />
                                <p className="text-sm">No notifications found</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-3 text-center bg-background-Card_1 border-t border-[#ffffff1a]">
                        <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold">
                            Viewing full notification history
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHeader;