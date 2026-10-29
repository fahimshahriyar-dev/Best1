import EbookCard from "@/app/components/EbookCard";
import { useGetAllEbooksQuery } from "@/redux/features/ebook/ebookApi";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { translations } from "../../utils/translations";

type Props = {
    user: any;
};

const EnrolledEbooks: FC<Props> = ({ user }) => {
    const { language } = useSelector((state: any) => state.language);
    const [enrolledEbooks, setEnrolledEbooks] = useState([]);
    const { data: allEbooksData, isLoading, isError } = useGetAllEbooksQuery(undefined, {});

    useEffect(() => {
        if (allEbooksData?.ebooks) {
            const isStaff = user?.role === "superadmin" || user?.role === "admin" || user?.role === "moderator" || user?.role === "teacher";
            
            if (isStaff) {
                setEnrolledEbooks(allEbooksData.ebooks);
            } else if (user?.ebooks) {
                const filteredEbooks = user.ebooks
                    .map((userEbook: any) =>
                        allEbooksData.ebooks.find((ebook: any) => ebook._id === userEbook.ebookId)
                    )
                    .filter((ebook: any) => ebook !== undefined);
                setEnrolledEbooks(filteredEbooks);
            }
        }
    }, [allEbooksData, user?.ebooks, user?.role]);

    if (isLoading) {
        return <div className="w-full h-[300px] flex items-center justify-center text-text-basic">Loading enrolled ebooks...</div>;
    }

    if (isError) {
        return <div className="w-full h-[300px] flex items-center justify-center text-red-500">Error loading ebooks. Please try again.</div>;
    }

    return (
        <div className="w-full">
            {enrolledEbooks.length > 0 ? (
                <div className="grid grid-cols-1 gap-[15px] md:grid-cols-2 md:gap-[20px] lg:grid-cols-3 lg:gap-[20px] 1500px:grid-cols-4 1500px:gap-[25px] border-0 mt-5">
                    {enrolledEbooks.map((item: any, index: number) => (
                        <div key={index}>
                            <EbookCard
                                item={item}
                                isProfile={true}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full h-[300px] flex items-center justify-center">
                    <h1 className="text-center text-[18px] font-Poppins text-gray-600">
                        {translations[language].no_enrolled_ebooks ?? "You have not enrolled in any e-books yet."}
                    </h1>
                </div>
            )}
        </div>
    );
};

export default EnrolledEbooks;
