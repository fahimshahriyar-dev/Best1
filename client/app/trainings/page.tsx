"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import { useGetAllTrainingsQuery } from "../../redux/features/training/trainingApi";
import TrainingCard from "../pages/TrainingCard";
import Loader from "../components/Loader";

const Page = () => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");
    const { data, isLoading } = useGetAllTrainingsQuery({});

    const trainings = data?.trainings || [];

    return (
        <div className="min-h-screen flex flex-col">
            <Heading
                title="Trainings | Best1 Academy"
                description="Browse our training programs."
                keywords="training, professional development, LMS"
            />
            <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
            <div className="flex-grow bg-background-Theme">
                <div className="w-[95%] 800px:w-[85%] m-auto mt-10 py-16">
                    <h1 className="text-3xl font-Poppins font-[600] text-text-basic text-center mb-2">
                        Training Programs
                    </h1>
                    <p className="text-text-basic opacity-60 text-center mb-10 font-Poppins text-sm">
                        Upskill with our expert-led training programs
                    </p>

                    {isLoading ? (
                        <Loader />
                    ) : trainings.length === 0 ? (
                        <div className="text-center py-20 text-text-basic opacity-40">
                            <p className="text-lg">No training programs available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trainings.map((training: any) => (
                                <TrainingCard key={training._id} training={training} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;
