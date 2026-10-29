import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import React, { FC, useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CourseContentList from "../CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../payment/CheckOutForm";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";
import { FiClock, FiUsers, FiCalendar, FiMonitor, FiBookOpen, FiUserCheck } from "react-icons/fi";
import { HiOutlineClock } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useCreateOrderMutation } from "@/redux/features/orders/orderApi";
import toast from "react-hot-toast";
import AnimatedPopup from "../../components/AnimatedPopup";

type Props = {
    data: any;
    clientSecret: string;
    stripePromise: any;
    setRoute: any;
    setOpen: any;
};

const buildEnrollmentData = (user: any) => ({
    personalInfo: {
        fullName: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        dob: user?.dob || "",
        gender: user?.gender || ""
    },
    location: {
        country: user?.country || "Bangladesh",
        cityDistrict: user?.cityDistrict || "",
        postalCode: user?.postalCode || ""
    },
    education: {
        currentLevel: user?.currentLevel || "",
        institutionName: user?.institutionName || ""
    },
    experience: {
        takenOnlineCourseBefore: user?.takenOnlineCourseBefore || "",
        heardAboutClass: user?.heardAboutClass || "",
        goal: user?.goal || ""
    },
    agreements: {
        accurateInfo: true,
        confirmPayment: true,
        termsPolicy: true
    }
});

const AboutCourse = ({ data, stripePromise, clientSecret, setRoute, setOpen: openAuthModal }: Props) => {
    const { user } = useSelector((state: any) => state.auth)

    const [open, setOpen] = useState(false);
    const [createOrder, { isLoading: orderLoading }] = useCreateOrderMutation();

    const discountPercentenge = data?.estimatedPrice
        ? ((data?.estimatedPrice - data.price) / data?.estimatedPrice) * 100
        : 0;

    const discountPercentengePrice = discountPercentenge.toFixed(0);

    const isPurchased =
        user && user?.courses?.find((item: any) => (item.courseId || item._id).toString() === data._id.toString());

    const isLive = data?.subCategory === "Live";

    const handleOrder = async (e: any) => {
        if (user) {
            if (data.price === 0) {
                try {
                    const enrollmentData = buildEnrollmentData(user);
                    const res: any = await createOrder({
                        courseId: data._id,
                        enrollmentData
                    }).unwrap();
                    if (res) {
                        toast.success("Successfully enrolled in the course!");
                        window.location.reload();
                    }
                } catch (error: any) {
                    toast.error(error.data?.message || "Something went wrong");
                }
            } else {
                setOpen(true);
            }
        } else {
            setRoute("Login");
            openAuthModal(true);
        }
    };

    return (
        <div className="bg-background-Theme pt-24">
            <div className="w-[90%] 800px:w-[90%] flex m-auto py-5">
                <div className="w-full flex flex-col 800px:flex-row">
                    <div className="w-full 800px:w-[65%] 800px:pr-5">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <h1 className="text-[28px] font-Poppins font-[700] text-text-basic">
                                {data.name}
                            </h1>
                        </div>
                        <div className="flex items-center justify-between pt-2 mb-6">
                            <div className="flex items-center gap-3">
                                <Ratings rating={data.ratings} />
                                <span className="text-sm text-text-basic/60">
                                    ({data.reviews?.length}) Reviews
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-text-basic/60">
                                <FiUsers size={15} />
                                <span>{data.purchased} Students</span>
                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                                    isLive
                                        ? "bg-orange-500/20 text-orange-400"
                                        : "bg-blue-500/20 text-blue-400"
                                }`}>
                                    {isLive ? "LIVE" : "RECORDED"}
                                </span>
                            </div>
                        </div>

                        {/* Benefits */}
                        {data.benefits?.length > 0 && (
                        <>
                        <h2 className="text-[22px] font-Poppins font-[600] text-text-basic mb-4">
                            What you will learn from this course?
                        </h2>
                        <div className="space-y-3 mb-8">
                            {data.benefits?.map((item: any, index: number) => (
                                <div className="flex items-start gap-3" key={index}>
                                    <IoCheckmarkDoneOutline size={18} className="text-green-400 mt-0.5 shrink-0" />
                                    <span className="text-sm text-text-basic">{item.title}</span>
                                </div>
                            ))}
                        </div>
                        </>
                        )}

                        {/* Prerequisites */}
                        {data.prerequisites?.length > 0 && (
                        <>
                        <h2 className="text-[22px] font-Poppins font-[600] text-text-basic mb-4">
                            Prerequisites
                        </h2>
                        <div className="space-y-3 mb-8">
                            {data.prerequisites?.map((item: any, index: number) => (
                                <div className="flex items-start gap-3" key={index}>
                                    <IoCheckmarkDoneOutline size={18} className="text-blue-400 mt-0.5 shrink-0" />
                                    <span className="text-sm text-text-basic">{item.title}</span>
                                </div>
                            ))}
                        </div>
                        </>
                        )}

                        {/* Course Overview (Live) */}
                        {isLive && (
                        <div className="mb-8">
                            <h2 className="text-[22px] font-Poppins font-[600] text-text-basic mb-4">
                                Course Overview
                            </h2>
                            <div className="space-y-3">
                                {data?.daysOfWeek?.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <FiClock size={18} className="text-orange-400 mt-0.5 shrink-0" />
                                        <span className="text-sm text-text-basic">
                                            Schedule: {data.daysOfWeek.join(", ")} ({data.daysPerWeek}x/week)
                                        </span>
                                    </div>
                                )}
                                {data?.teachers?.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <FiUserCheck size={18} className="text-blue-400 mt-0.5 shrink-0" />
                                        <span className="text-sm text-text-basic">
                                            {data.teachers.length} Teacher{data.teachers.length > 1 ? "s" : ""} Assigned
                                        </span>
                                    </div>
                                )}
                                {data?.courseData?.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <FiCalendar size={18} className="text-green-400 mt-0.5 shrink-0" />
                                        <span className="text-sm text-text-basic">
                                            {data.courseData.length} Sessions
                                        </span>
                                    </div>
                                )}
                                {data?.maxStudents && (
                                    <div className="flex items-start gap-3">
                                        <FiUsers size={18} className="text-purple-400 mt-0.5 shrink-0" />
                                        <span className="text-sm text-text-basic">
                                            Max {data.maxStudents} Students
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        )}

                        {/* Course Overview */}
                        {!isLive && data?.courseData?.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-[22px] font-Poppins font-[600] text-text-basic">
                                    Course Overview
                                </h2>
                                <div className="flex items-center gap-1.5 text-sm text-text-basic/60">
                                    <HiOutlineClock size={16} />
                                    <span>
                                        {(() => {
                                            const totalMins = data.courseData.reduce((t: number, i: any) => t + Number(i.videoLength || 0), 0);
                                            const h = Math.floor(totalMins / 60);
                                            const m = Math.round(totalMins % 60);
                                            return h > 0 ? `${h}h ${m}m total` : `${m}m total`;
                                        })()}
                                    </span>
                                </div>
                            </div>
                            <CourseContentList
                                data={data?.courseData}
                                isDemo={true}
                            />
                        </div>
                        )}

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-[22px] font-Poppins font-[600] text-text-basic mb-4">
                                Course Details
                            </h2>
                            <p className="text-[15px] leading-relaxed text-text-basic/80 whitespace-pre-line">
                                {data.description}
                            </p>
                        </div>

                        {/* Reviews */}
                        <div className="w-full mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Ratings rating={data?.ratings} />
                                <span className="text-[18px] font-Poppins text-text-basic">
                                    {Number.isInteger(data?.ratings)
                                        ? data?.ratings.toFixed(1)
                                        : data?.ratings.toFixed(2)}{" "}
                                    • {data?.reviews?.length} Reviews
                                </span>
                            </div>
                            {data?.reviews &&
                                [...data.reviews].reverse().map((item: any, index: number) => (
                                    <div className="w-full pb-4" key={index}>
                                        <div className="flex">
                                            <div className="w-[50px] h-[50px]">
                                                <Image
                                                    src={item.user.avatar ? item.user.avatar.url : "/assests/avatar.png"}
                                                    width={50} height={50} alt=""
                                                    className="w-[50px] h-[50px] rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="pl-3">
                                                <div className="flex items-center gap-2">
                                                    <h5 className="text-[16px] font-semibold text-text-basic">{item.user.name}</h5>
                                                    <Ratings rating={item.rating} />
                                                </div>
                                                <p className="text-sm text-text-basic/80 mt-1">{item.comment}</p>
                                                <small className="text-xs text-text-basic/40">{format(item.createdAt)}</small>
                                            </div>
                                        </div>
                                        {item.commentReplies?.map((i: any, idx: number) => (
                                            <div key={idx} className="flex ml-16 mt-4">
                                                <div className="w-[40px] h-[40px]">
                                                    <Image
                                                        src={i.user.avatar ? i.user.avatar.url : "/assests/avatar.png"}
                                                        width={40} height={40} alt=""
                                                        className="w-[40px] h-[40px] rounded-full object-cover"
                                                    />
                                                </div>
                                                <div className="pl-3">
                                                    <div className="flex items-center gap-1">
                                                        <h5 className="text-[15px] font-semibold text-text-basic">{i.user.name}</h5>
                                                        <VscVerifiedFilled className="text-[#0095f6]" />
                                                    </div>
                                                    <p className="text-sm text-text-basic/80">{i.comment}</p>
                                                    <small className="text-xs text-text-basic/40">{format(i.createdAt)}</small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full 800px:w-[35%] relative">
                        <div className="sticky top-[100px] left-0 z-10 w-full">
                            <>
                                <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />
                                <div className="flex items-center gap-2 mt-4">
                                    <h1 className="text-[25px] text-text-basic font-bold">
                                        {data.price === 0 ? "Free" : "৳" + data.price}
                                    </h1>
                                    {data.estimatedPrice && (
                                        <>
                                            <h5 className="text-lg mt-1 line-through opacity-50 text-text-basic">৳{data.estimatedPrice}</h5>
                                            <h4 className="text-sm text-green-400 font-semibold">{discountPercentengePrice}% Off</h4>
                                        </>
                                    )}
                                </div>
                                {isPurchased ? (
                                    <Link
                                        href={`/course-access/${data._id}`}
                                        className="w-full py-3.5 rounded-2xl font-bold text-white bg-green-600 hover:bg-green-700 flex items-center justify-center transition-all mt-4"
                                    >
                                        Purchased
                                    </Link>
                                ) : (
                                    <div
                                        className="w-full py-3.5 rounded-2xl font-bold text-white bg-blue-500 hover:bg-blue-600 flex items-center justify-center cursor-pointer transition-all mt-4"
                                        onClick={handleOrder}
                                    >
                                        {isLive ? "Enroll Now ৳" + data.price : "Buy Now ৳" + data.price}
                                    </div>
                                )}
                                <div className="mt-5 pt-5 border-t border-[#ffffff12] space-y-2">
                                    {isLive ? (
                                        <>
                                            <p className="text-sm text-text-basic/70 flex items-center gap-2"><IoCheckmarkDoneOutline className="text-green-400" /> Live interactive sessions with teachers</p>
                                            <p className="text-sm text-text-basic/70 flex items-center gap-2"><IoCheckmarkDoneOutline className="text-green-400" /> Real-time Q&A and discussions</p>
                                            <p className="text-sm text-text-basic/70 flex items-center gap-2"><IoCheckmarkDoneOutline className="text-green-400" /> Chat-based course communication</p>
                                            <p className="text-sm text-text-basic/70 flex items-center gap-2"><IoCheckmarkDoneOutline className="text-green-400" /> Session recordings included</p>
                                            <p className="text-sm text-text-basic/70 flex items-center gap-2"><IoCheckmarkDoneOutline className="text-green-400" /> Certificate of completion</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm text-text-basic/70 flex items-center gap-2"><IoCheckmarkDoneOutline className="text-green-400" /> Source code included</p>
                                            <p className="text-sm text-text-basic/70 flex items-center gap-2"><IoCheckmarkDoneOutline className="text-green-400" /> Full lifetime access</p>
                                            <p className="text-sm text-text-basic/70 flex items-center gap-2"><IoCheckmarkDoneOutline className="text-green-400" /> Certificate of completion</p>
                                            <p className="text-sm text-text-basic/70 flex items-center gap-2"><IoCheckmarkDoneOutline className="text-green-400" /> Premium Support</p>
                                        </>
                                    )}
                                </div>
                            </>
                        </div>
                    </div>
                </div>
            </div>

            <>
                <AnimatedPopup isOpen={open} zIndex={999}>
                    <div className="w-full max-w-[500px] bg-white rounded-xl shadow-2xl p-6 relative">
                        <div className="w-full flex justify-end mb-4">
                            <IoCloseOutline
                                size={30}
                                className="text-gray-500 hover:text-black cursor-pointer transition-colors"
                                onClick={() => setOpen(false)}
                            />
                        </div>
                        <div className="w-full">
                            {stripePromise && clientSecret && (
                                <Elements stripe={stripePromise} options={{ clientSecret }}>
                                    <CheckoutForm
                                        setOpen={setOpen}
                                        data={data}
                                        user={user}
                                        enrollmentData={buildEnrollmentData(user)}
                                    />
                                </Elements>
                            )}
                            {orderLoading && (
                                <div className="flex justify-center items-center py-10">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </AnimatedPopup>
            </>
        </div>
    );
};

export default AboutCourse;
