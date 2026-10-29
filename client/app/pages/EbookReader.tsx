import React, { useState, useEffect } from "react";
import { useGetEbookContentQuery, useAddEbookReviewMutation } from "../../redux/features/ebook/ebookApi";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "./Footer";
import { FiDownload } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { MdOutlineLibraryBooks } from "react-icons/md";
import toast from "react-hot-toast";
import ReviewCard from "../components/ReviewCard"; // Ensure this exists or we can build a review form here

type Props = {
    id: string;
};

const EbookReader = ({ id }: Props) => {
    const { data, isLoading, error } = useGetEbookContentQuery(id, { refetchOnMountOrArgChange: true });
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const { user } = useSelector((state: any) => state.auth);
    
    const ebook = data?.ebook;
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        if (ebook && user) {
            const userReview = ebook.reviews?.find(
                (rev: any) => (rev.user._id || rev.user).toString() === user._id.toString()
            );
            if (userReview) {
                setRating(userReview.rating);
                setReview(userReview.comment);
                setIsUpdate(true);
            }
        }
    }, [ebook, user]);
    
    // For review submission (can be extended)
    const [addReview, { isSuccess: reviewSuccess, error: reviewError, isLoading: reviewLoading }] = useAddEbookReviewMutation();

    useEffect(() => {
        if (reviewSuccess) {
            toast.success(isUpdate ? "Review updated successfully!" : "Review submitted successfully!");
        }
        if (reviewError) {
            const errorMsg = reviewError as any;
            toast.error(errorMsg?.data?.message || "Failed to submit review.");
        }
    }, [reviewSuccess, reviewError]);

    const handleReviewSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating.");
            return;
        }
        if (review.trim() === "") {
            toast.error("Please enter a review comment.");
            return;
        }
        await addReview({ review, rating, ebookId: id });
    };

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-Theme">
                <h1 className="text-2xl text-red-500 font-Poppins">
                    You do not have access to this E-Book.
                </h1>
            </div>
        );
    }

    // const ebook = data?.ebook; (moved up)

    return (
        <div className="min-h-screen flex flex-col bg-background-Theme">
            <Heading
                title={`${ebook?.name} - Reader`}
                description="Read your purchased E-Book online."
                keywords="ebook, reader, pdf"
            />
            <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} />

            <div className="flex-grow w-[95%] 800px:w-[85%] mx-auto py-20 mt-5">
                <div className="flex flex-col 800px:flex-row justify-between items-start 800px:items-center mb-8 gap-5 border-b border-gray-200 dark:border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                        <MdOutlineLibraryBooks size={40} className="text-blue-500" />
                        <div>
                            <h1 className="text-3xl font-bold text-text-basic font-Poppins">
                                {ebook?.name}
                            </h1>
                            <p className="text-text-basic opacity-70 mt-1">Enjoy reading your e-book!</p>
                        </div>
                    </div>
                    
                    <a 
                        href={ebook?.pdfFile?.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg"
                        download
                    >
                        <FiDownload size={20} />
                        Download PDF
                    </a>
                </div>

                <div className="flex gap-x-10">
                    {/* PDF Viewer Container */}
                    <div className="w-full bg-background-Card_1 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden mb-12" style={{ height: "75vh" }}>
                        <iframe
                            src={`${ebook?.pdfFile?.url}#toolbar=0`}
                            width="100%"
                            height="100%"
                            className="border-0"
                            title={ebook?.name}
                        >
                            <p>Your browser does not support PDFs. <a href={ebook?.pdfFile?.url}>Download the PDF</a>.</p>
                        </iframe>
                    </div>

                    {/* Review Form */}
                    <div className="w-[600px] h-fit bg-background-Card_1 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 p-8 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-text-basic mb-6 font-Poppins">
                            {isUpdate ? "Update Your Review" : "Leave a Review"}
                        </h2>
                        
                        <div className="flex items-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                    key={star} 
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    {rating >= star ? (
                                        <AiFillStar size={35} className="text-yellow-500" />
                                    ) : (
                                        <AiOutlineStar size={35} className="text-gray-400" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <textarea
                            className="w-full bg-transparent border border-gray-300 dark:border-white/10 rounded-xl p-4 text-text-basic focus:border-blue-500 outline-none min-h-[150px] mb-4"
                            placeholder="Write your thoughts about this e-book..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        ></textarea>

                        <button
                            onClick={handleReviewSubmit}
                            disabled={reviewLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg disabled:opacity-50"
                        >
                            {reviewLoading ? "Submitting..." : isUpdate ? "Update Review" : "Submit Review"}
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default EbookReader;
