import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react'
import Ratings from '../utils/Ratings';
import { useSelector } from 'react-redux';
import { FiBookOpen } from 'react-icons/fi';

type Props = {
    item: any;
    isProfile?: boolean;
}

const EbookCard: FC<Props> = ({ item, isProfile }) => {
    const { user } = useSelector((state: any) => state.auth);
    const isPurchased = user && user?.ebooks?.some((ebook: any) => ebook.ebookId === item._id.toString());

    return (
        <Link href={!isProfile ? `/ebook/${item._id}` : `/ebook-reader/${item._id}`}>
            <div className='w-full min-h-[35vh] rounded-xl p-4 shadow-xl !bg-background-Card_1 border border-[#ffffff12] hover:border-[#ffffff30] transition-all duration-300 flex flex-col'>
                {/* Thumbnail */}
                <div className='relative'>
                    <Image src={item.thumbnail.url} width={500} height={280} objectFit='contain' className='rounded-lg w-full' alt=''/>
                </div>

                <div className='flex-1 flex flex-col mt-4'>
                    <h1 className='font-Poppins font-semibold text-[16px] text-text-basic leading-snug line-clamp-2'>
                        {item.name}
                    </h1>
                    <p className='text-xs text-text-basic opacity-60 mt-0.5'>
                        By {item.author}
                    </p>

                    {/* Rating & Sales */}
                    <div className='flex items-center justify-between mt-3'>
                        <Ratings rating={item.ratings}/>
                        <span className='text-xs text-text-basic/60'>
                            {item.purchased || 0} Sales
                        </span>
                    </div>

                    {/* Divider */}
                    <div className='border-t border-[#ffffff12] my-3' />

                    {/* Bottom row */}
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-1.5 text-xs text-text-basic/60'>
                            <FiBookOpen size={13} />
                            <span>E-Book</span>
                        </div>
                        <h3 className='text-base font-bold text-text-basic'>
                            {isPurchased ? "Purchased" : "৳" + item.price}
                        </h3>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default EbookCard
