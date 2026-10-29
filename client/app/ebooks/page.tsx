"use client";
import React, { useState } from 'react'
import Heading from '../utils/Heading'
import Header from '../components/Header'
import Ebooks from '../pages/Ebooks'

const Page = () => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");

    return (
        <div className="min-h-screen flex flex-col">
            <Heading
                title="E-Books | Best1 Academy"
                description="Browse and purchase our comprehensive collection of E-Books."
                keywords="ebooks, programming, learn, coding, store"
            />
            <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
            <div className="flex-grow">
                <Ebooks />
            </div>
        </div>
    )
}

export default Page
