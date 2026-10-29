import React from "react";

const Loader = () => {
    return (
        <div className="flex-center fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm">
            <div className="w-16 h-16 border-4 border-black/10 dark:border-white/20 border-t-blue-500 dark:border-t-white rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;