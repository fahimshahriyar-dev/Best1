import Image from "next/image";
import React from "react";
import Ratings from "../utils/Ratings";

type Props = {
    item: any;
};

const ReviewCard = (props: Props) => {
    return (
        <div className="w-full pb-4 bg-background-Card_1 rounded-lg p-4 shadow-xl">
            <div className="flex w-full items-center justify-between">
                {" "}
                {/* Adjusted flex properties */}
                <div className="flex items-center">
                    <Image
                        src={props.item.avatar}
                        alt="avatar"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                    />
                    <div className="pl-3">
                        <h5 className="text-[16px] font-semibold text-text-basic">
                            {props.item.name}
                        </h5>
                        <h6 className="text-[14px] text-text-secondary">
                            {props.item.profession}
                        </h6>
                    </div>
                </div>
                {/* Assuming your Ratings component can accept size and color props */}
                <Ratings rating={5} size={16} color="#FFC107" />
            </div>
            <p className="pt-3 px-2 font-Poppins text-text-basic text-sm leading-relaxed">
                {props.item.comment}
            </p>
        </div>
    );
};

export default ReviewCard;
