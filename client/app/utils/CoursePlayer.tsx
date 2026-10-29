import React, { FC } from 'react';

type Props = {
    videoUrl: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
    const getYouTubeVideoId = (url: string) => {
        if (!url) {
            return null;
        }
        const patterns = [
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i, // Standard YouTube link
            /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?\s]+)/i, // Short YouTube link
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?\s]+)/i // Embed link
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    };

    const videoId = getYouTubeVideoId(videoUrl);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

    return (
        <div className="pt-[56.25%] relative overflow-hidden">
            {videoId ? (
                <iframe
                    src={embedUrl}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full absolute top-0 left-0 border-none"
                ></iframe>
            ) : (
                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center bg-gray-100 text-gray-500">
                    {videoUrl ? "Invalid YouTube URL" : "No Demo URL provided"}
                </div>
            )}
        </div>
    );
};

export default CoursePlayer;

// import React, { FC } from "react";

// interface CoursePlayerProps {
//     videoUrl: string | undefined;
//     title?: string;
// }

// const CoursePlayer: FC<CoursePlayerProps> = ({ videoUrl, title }) => {
//     return (
//         <div className="w-full aspect-video bg-black flex items-center justify-center overflow-hidden rounded-md">
//             {videoUrl && videoUrl !== "" ? (
//                 <video
//                     src={videoUrl}
//                     controls
//                     className="w-full h-full object-cover"
//                     title={title}
//                     onError={(e) => {
//                         console.error("Error loading video:", e);
//                         // Optionally display an error message to the user
//                     }}
//                 >
//                     Your browser does not support the video tag.
//                 </video>
//             ) : (
//                 <div className="text-gray-400">No video URL provided</div>
//             )}
//         </div>
//     );
// };

// export default CoursePlayer;
