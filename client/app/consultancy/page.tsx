"use client";
import React, { useState } from 'react'
import Heading from '../utils/Heading'
import Header from '../components/Header'
import Consultancy from '../pages/Consultancy'

const Page = () => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");

    return (
        <div className="min-h-screen flex flex-col">
            <Heading
                title="Consultancy | Best1 Academy"
                description="Get expert consultancy services for your business."
                keywords="consultancy, business consulting, IT consulting"
            />
            <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
            <div className="flex-grow">
                <Consultancy />
            </div>
        </div>
    )
}

export default Page
