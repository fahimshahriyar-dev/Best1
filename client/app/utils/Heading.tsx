"use client";
import React, { FC, useEffect } from 'react'

interface HeadProps {
    title: string;
    description: string;
    keywords: string;
}

const Heading:FC <HeadProps> = ({ title, description, keywords }) => {
    const [origin, setOrigin] = React.useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    useEffect(() => {
        document.title = title;
    }, [title]);

    const imageUrl = origin ? `${origin}/assests/post.jpg` : "";
    const pageUrl = origin ? window.location.href : "";

    return (
        <>
            <title>{title}</title>
            <meta name='viewport' content="width=device-width, initial-scale=1"/>
            <meta name='description' content={description}/>
            <meta name='keywords' content={keywords}/>
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={pageUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
        </>
    )
}

export default Heading;