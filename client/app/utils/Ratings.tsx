import React, { FC } from 'react'

// icons
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

type Props = {
    rating: number;
}

const Ratings: FC<Props> = ({ rating }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if(i <= rating) {
            stars.push(
                <FaStar 
                    key={i}
                    size={20}
                    className='mr-2 cursor-pointer text-[#f6b100]'
                />
            );
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars.push(
                <FaStarHalfAlt 
                    key={i}
                    size={20}
                    className='mr-2 cursor-pointer text-[#f6b100]'
                />
            )
        } else {
            stars.push(
                <FaRegStar 
                    key={i}
                    size={20}
                    className='mr-2 cursor-pointer text-[#f6b100]'
                />
            )
        }
    }
    return (
        <div className='flex mt-1 ml-2 800px:mt-0 800px:ml-0'>{stars}</div>
    )
}

export default Ratings