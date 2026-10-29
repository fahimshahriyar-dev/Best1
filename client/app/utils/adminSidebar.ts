export const ADMIN_SIDEBAR_TOGGLE_EVENT = "admin-sidebar-toggle";

export const toggleAdminSidebar = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(ADMIN_SIDEBAR_TOGGLE_EVENT));
    }
};
