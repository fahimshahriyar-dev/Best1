import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import { translations } from "../utils/translations";
import ReviewCard from "../components/ReviewCard";

type Props = {};

export const reviews = [
    {
        name: "Gene Bates",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        profession: "Student | Cambridge University",
        comment:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,",
    },
    {
        name: "Verna Santos",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        profession: "Full stack developer | Quarter ltd",
        comment:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula,",
    },
    {
        name: "Jay Gibbs",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        profession: "CSE student | Zimbabwe",
        comment:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
    },
    {
        name: "Mina Davidson",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        profession: "Junior web developer | Indonesia",
        comment:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel,",
    },
    {
        name: "Rosemary Smith",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        profession: "Full stack developer | Algeria",
        comment:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem",
    },
    {
        name: "Gene Bates",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        profession: "Full stack developer | Canada",
        comment:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
    },
];

const Reviews = (props: Props) => {
    const { language } = useSelector((state: any) => state.language);
    
    return (
        <div className="bg-background-Theme pt-40 pb-20">
            <div className="w-[90%] 800px:w-[85%] flex flex-col container">
                <div className="text-center pb-[50px]">
                    <h1 className="font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl text-text-basic 800px:!leading-[60px] font-bold tracking-tight">
                        {translations[language].students} <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">{translations[language].review}</span>
                    </h1>
                    <h2 className="title flex-center gap-2">
                        <span className="text-[50px] bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                            •
                        </span>{" "}
                        {translations[language].students_reaction}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6 mb-12 items-stretch">
                    {reviews.map((i, index) => (
                        <div key={index} className="flex h-full">
                            <ReviewCard item={i} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reviews;
