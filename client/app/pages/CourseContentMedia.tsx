import React, { FC, useEffect, useRef, useState } from "react";
import CoursePlayer from "../utils/CoursePlayer";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Image from "next/image";
import { FaRegStar, FaStar } from "react-icons/fa";
import {
    useAddAnswerMutation,
    useAddNewQuestionMutation,
    useAddReviewMutation,
    useAddReviewReplyMutation,
    useGetCourseDetailsQuery,
    useEditQuestionMutation,
    useDeleteQuestionMutation,
    useEditAnswerMutation,
    useDeleteAnswerMutation,
} from "../../redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { format } from "timeago.js";
import { BiMessage, BiSolidBadgeCheck } from "react-icons/bi";
import { FiMoreVertical } from "react-icons/fi";
import Ratings from "../utils/Ratings";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";

const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
    data: any;
    id: string;
    activeVideo: number;
    setActiveVideo: (activeVideo: number) => void;
    user: any;
    refetch: any;
};

const CourseContentMedia: FC<Props> = ({
    data,
    id,
    activeVideo,
    setActiveVideo,
    user,
    refetch,
}) => {
    const [activeBar, setactiveBar] = useState(0);
    const [rating, setRating] = useState(1);
    const [question, setQuestion] = useState("");
    const [review, setReview] = useState("");
    const [reviewId, setReviewId] = useState("");
    const [answer, setAnswer] = useState("");
    const [questionId, setQuestionId] = useState("");
    const [reply, setReply] = useState("");
    const [isReviewReply, setIsReviewReply] = useState(false);
    const [qaFilter, setQaFilter] = useState("all");
    const { data: courseData, refetch: courseRefetch } =
        useGetCourseDetailsQuery(id, { refetchOnMountOrArgChange: true });
    const course = courseData?.course;
    const isReviewExists = course?.reviews?.find(
        (item: any) => item.user._id === user._id
    );
    const [addNewQuestion, { isSuccess, isLoading: qsLoading, error }] =
        useAddNewQuestionMutation();
    const [
        addAnswer,
        { isSuccess: ansSuccess, isLoading: ansLoading, error: ansError },
    ] = useAddAnswerMutation();
    const [
        addReview,
        {
            isSuccess: reviewSuccess,
            isLoading: reviewLoading,
            error: reviewError,
        },
    ] = useAddReviewMutation();
    const [
        addReviewReply,
        {
            isSuccess: reviewReplySuccess,
            isLoading: reviewReplyLoading,
            error: reviewReplyError,
        },
    ] = useAddReviewReplyMutation();

    // qustion submit
    const handleQuestion = () => {
        if (question.length === 0) {
            toast.error("Question can't be empty");
        } else {
            console.log({
                question,
                courseId: id,
                contentId: data[activeVideo]?._id,
            });
            addNewQuestion({
                question,
                courseId: id,
                contentId: data[activeVideo]?._id,
            });
        }
    };

    // answer submit
    const handleAnswerSubmit = () => {
        addAnswer({
            answer,
            courseId: id,
            contentId: data[activeVideo]?._id,
            questionId: questionId,
        });
    };

    // review submit
    const handleReviewSubmit = async () => {
        if (review.length === 0) {
            toast.error("Review can't be empty");
        } else {
            addReview({ review, rating, courseId: id });
        }
    };

    // review reply submit
    const handleReviewReplySubmit = () => {
        if (!reviewReplyLoading) {
            if (reply === "") {
                toast.error("Reply cannot be empty.");
            } else {
                addReviewReply({ comment: reply, courseId: id, reviewId });
            }
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setQuestion("");
            refetch();
            toast.success("Question added successfully");
            socketId.emit("notification", {
                title: "New Question Recieved",
                message: `You have a new question in ${data[activeVideo].title}`,
                userId: user._id
            })
        }
        if (ansSuccess) {
            setAnswer("");
            refetch();
            toast.success("Answer added successfully");
            if(user.role !== "admin" && user.role !== "moderator" && user.role !== "teacher") {
                socketId.emit("notification", {
                    title: "New Question Reply Recieved",
                    message: `You have a new question reply in ${data[activeVideo].title}`,
                    userId: user._id
                })
            }
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
        if (ansError) {
            if ("data" in ansError) {
                const errorMessage = ansError as any;
                toast.error(errorMessage.data.message);
            }
        }
        if (reviewSuccess) {
            setReview("");
            setRating(1);
            courseRefetch();
            toast.success("Review added successfully");
            socketId.emit("notification", {
                title: "New Review Recieved",
                message: `You have a new review in ${data[activeVideo].title}`,
                userId: user._id
            })
        }
        if (reviewError) {
            if ("data" in reviewError) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
        if (reviewReplySuccess) {
            setReply("");
            courseRefetch();
            toast.success("Reply added successfully");
        }
        if (reviewReplyError) {
            if ("data" in reviewReplyError) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [
        isSuccess,
        error,
        ansSuccess,
        ansError,
        reviewSuccess,
        reviewError,
        reviewReplySuccess,
        reviewReplyError,
    ]);

    return (
        <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
            <CoursePlayer
                title={data[activeVideo]?.title}
                videoUrl={data[activeVideo]?.videoUrl}
            />
            <div className="w-full flex items-center justify-between my-3">
                {/* prev btn */}
                <div
                    className={`button !w-[unset] !min-h-[40px] !py-[unset] ${
                        activeVideo === 0 && "!cursor-no-drop opacity-[.8]"
                    }`}
                    onClick={() =>
                        setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
                    }
                >
                    <MdKeyboardArrowLeft className="mr-2" />
                    Prev Lesson
                </div>

                {/* next btn */}
                <div
                    className={`button !w-[unset] !min-h-[40px] !py-[unset] ${
                        data.length - 1 === activeVideo &&
                        "!cursor-no-drop opacity-[.8]"
                    }`}
                    onClick={() =>
                        setActiveVideo(
                            data && data.length - 1 === activeVideo
                                ? activeVideo
                                : activeVideo + 1
                        )
                    }
                >
                    Next Lesson
                    <MdKeyboardArrowRight className="ml-2" />
                </div>
            </div>

            <h1 className="pt-2 text-[25px] font-[600]">
                {data[activeVideo].title}
            </h1>

            <br />

            <div className="w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
                {["Overview", "Resources", "Q&A", "Reviews"].map(
                    (text, index) => (
                        <h5
                            key={index}
                            className={`800px:text-[20px] cursor-pointer ${
                                activeBar === index && "text-red-500"
                            }`}
                            onClick={() => setactiveBar(index)}
                        >
                            {text}
                        </h5>
                    )
                )}
            </div>

            <br />

            {activeBar === 0 && (
                <div>
                    <div className="mb-5">
                        <h3 className="text-[16px] font-semibold text-text-basic mb-2">Lesson Name</h3>
                        <p className="text-[15px] text-text-basic/80">{data[activeVideo]?.videoSec || data[activeVideo]?.title}</p>
                    </div>

                    {data[activeVideo]?.description && (
                        <div className="mb-5">
                            <h3 className="text-[16px] font-semibold text-text-basic mb-2">Description</h3>
                            <p className="text-[15px] text-text-basic/80 whitespace-pre-line">
                                {data[activeVideo].description}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {activeBar === 1 && (
                <div className="space-y-8">
                    {/* Global Source Links */}
                    {course?.sourceLinks?.length > 0 && (
                        <div>
                            <h3 className="text-[18px] font-semibold text-text-basic mb-3">Course Resources</h3>
                            <div className="space-y-3">
                                {course.sourceLinks.map((item: any, index: number) => (
                                    <div key={index} className="bg-background-Card_1/60 rounded-xl p-4 border border-[#ffffff12]">
                                        <h4 className="text-[15px] font-semibold text-text-basic mb-1">
                                            {item.title || "Resource"}
                                        </h4>
                                        <a
                                            className="text-[14px] text-blue-400 hover:text-blue-300 break-all transition-colors"
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.url}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Lesson-specific Links */}
                    <div>
                        <h3 className="text-[18px] font-semibold text-text-basic mb-3">Lesson Resources</h3>
                        {(data[activeVideo]?.links || []).length > 0 ? (
                            <div className="space-y-3">
                                {(data[activeVideo]?.links || []).map(
                                    (item: any, index: number) => (
                                        <div key={index} className="bg-background-Card_1/60 rounded-xl p-4 border border-[#ffffff12]">
                                            <h4 className="text-[15px] font-semibold text-text-basic mb-1">
                                                {item.title || "Resource"}
                                            </h4>
                                            <a
                                                className="text-[14px] text-blue-400 hover:text-blue-300 break-all transition-colors"
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {item.url}
                                            </a>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <p className="text-[15px] text-text-basic/50">No resources for this lesson.</p>
                        )}
                    </div>
                </div>
            )}

            {activeBar === 2 && (
                <>
                    <div className="flex w-full">
                        <Image
                            src={
                                user.avatar
                                    ? user.avatar.url
                                    : "/assests/avatar.png"
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                        <textarea
                            name=""
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            id=""
                            cols={40}
                            rows={5}
                            placeholder="Write your question..."
                            className="outline-none bg-transparent ml-3 border border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins"
                        ></textarea>
                    </div>

                    <div className="w-full flex justify-end">
                        <div
                            className={`button !w-[120px] !h-[40px] text-[18px] mt-5 ${
                                qsLoading && "cursor-not-allowed"
                            }`}
                            onClick={qsLoading ? () => {} : handleQuestion}
                        >
                            Submit
                        </div>
                    </div>

                    <br />
                    <br />

                    <div className="w-full flex items-center gap-2 my-4">
                        {["all", "first", "last", "my"].map((f) => (
                            <span
                                key={f}
                                className={`px-4 py-1 rounded-full cursor-pointer text-sm ${
                                    qaFilter === f ? "bg-button-btn_5" : "bg-background-option_2"
                                } text-white`}
                                onClick={() => setQaFilter(f)}
                            >
                                {f === "all" ? "All" : f === "first" ? "First Qs" : f === "last" ? "Last Qs" : "My Qs"}
                            </span>
                        ))}
                    </div>

                    <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
                    {/* question reply */}
                    <div>
                        <CommentReply
                            data={data}
                            activeVideo={activeVideo}
                            answer={answer}
                            setAnswer={setAnswer}
                            handleAnswerSubmit={handleAnswerSubmit}
                            user={user}
                            setQuestionId={setQuestionId}
                            ansLoading={ansLoading}
                            qaFilter={qaFilter}
                            courseId={id}
                            refetch={refetch}
                        />
                    </div>
                </>
            )}

            {activeBar === 3 && (
                <div>
                    <div className="w-full">
                        {!isReviewExists && (
                            <>
                                <div className="flex w-full">
                                    <Image
                                        src={
                                            user.avatar
                                                ? user.avatar.url
                                                : "/assests/avatar.png"
                                        }
                                        width={50}
                                        height={50}
                                        alt=""
                                        className="w-[50px] h-[50px] rounded-full object-cover"
                                    />
                                    <div className="w-full">
                                        <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black">
                                            Give a Rating{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </h5>
                                        <div className="flex w-full ml-2 pb-3">
                                            {[1, 2, 3, 4, 5].map((i) =>
                                                rating >= i ? (
                                                    <FaStar
                                                        key={i}
                                                        className="mr-1 cursor-pointer"
                                                        color="rgb(246,186,0)"
                                                        size={25}
                                                        onClick={() =>
                                                            setRating(i)
                                                        }
                                                    />
                                                ) : (
                                                    <FaRegStar
                                                        key={i}
                                                        className="mr-1 cursor-pointer"
                                                        color="rgb(246,186,0)"
                                                        size={25}
                                                        onClick={() =>
                                                            setRating(i)
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                        <textarea
                                            name=""
                                            value={review}
                                            onChange={(e) =>
                                                setReview(e.target.value)
                                            }
                                            id=""
                                            cols={40}
                                            rows={5}
                                            placeholder="Write your comment..."
                                            className="outline-none bg-transparent 800px:ml-3 border border-[#ffffff57] w-[95%] 800px:w-full p-2 rounded text-[18px] font-Poppins"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="w-full flex justify-end">
                                    <div
                                        className={`button !w-[120px] !h-[40px] text-[18px] mt-5 800px:mr-0 mr-2 ${
                                            reviewLoading &&
                                            "cursor-not-allowed"
                                        }`}
                                        onClick={
                                            reviewLoading
                                                ? () => {}
                                                : handleReviewSubmit
                                        }
                                    >
                                        Submit
                                    </div>
                                </div>
                            </>
                        )}

                        <br />

                        <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
                        <div className="w-full">
                            {(
                                course?.reviews && [...course.reviews].reverse()
                            )?.map((item: any, index: number) => (
                                <div key={index} className="w-full my-5 text-text-basic">
                                        <div className="w-full flex">
                                            <div>
                                                <Image
                                                    src={
                                                        item.user.avatar
                                                            ? item.user.avatar.url
                                                            : "/assests/avatar.png"
                                                    }
                                                    width={50}
                                                    height={50}
                                                    alt=""
                                                    className="w-[50px] h-[50px] rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="ml-2">
                                                <h1 className="text-[18px]">
                                                    {item?.user.name}
                                                </h1>
                                                <Ratings rating={item.rating} />
                                                <p>{item.comment}</p>
                                                <small className="text-[#ffffff83]">
                                                    {format(item.createdAt)}
                                                </small>
                                            </div>
                                        </div>
                                        {(user.role === "superadmin" || user.role === "admin" || user.role === "moderator" || user.role === "teacher") && (
                                            <span
                                                className="label !pl-5 cursor-pointer"
                                                onClick={() => {
                                                    setIsReviewReply(true);
                                                    setReviewId(item._id);
                                                }}
                                            >
                                                Add Reply
                                            </span>
                                        )}

                                        {isReviewReply && (
                                            <div className="w-full flex relative">
                                                <input
                                                    type="text"
                                                    placeholder="Enter your reply..."
                                                    value={reply}
                                                    className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-text-basic p-[5px] w-[95%]"
                                                    onChange={(e: any) =>
                                                        setReply(e.target.value)
                                                    }
                                                />
                                                <button
                                                    type="submit"
                                                    className="absolute right-0 bottom-1"
                                                    onClick={
                                                        handleReviewReplySubmit
                                                    }
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        )}

                                        {(item.commentReplies || []).map(
                                            (i: any, idx: number) => (
                                                <div key={idx} className="w-full flex 800px:ml-16 my-5">
                                                        <div className="w-[50px] h-[50px]">
                                                            <Image
                                                                src={
                                                                    i.user.avatar
                                                                        ? i.user.avatar.url
                                                                        : "/assests/avatar.png"
                                                                }
                                                                width={50}
                                                                height={50}
                                                                alt=""
                                                                className="w-[50px] h-[50px] rounded-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="pl-2">
                                                            <div className="flex items-center">
                                                                <h5 className="text-[20px]">
                                                                    {i.user.name}
                                                                </h5>
                                                                {(item.user.role === "superadmin" || item.user.role === "admin" || item.user.role === "moderator" || item.user.role === "teacher") && (
                                                                    <BiSolidBadgeCheck className="text-blue-500 ml-2 text-[20px]" />
                                                                )}
                                                            </div>
                                                            <p>
                                                                {i.comment}
                                                            </p>
                                                            <small className="text-[#ffffff83]">
                                                                {format(
                                                                    i.createdAt
                                                                )}
                                                            </small>
                                                            </div>
                                                        </div>
                                                )
                                            )}
                                    </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// comment reply
const CommentReply = ({
    data,
    activeVideo,
    answer,
    setAnswer,
    handleAnswerSubmit,
    setQuestionId,
    ansLoading,
    user,
    qaFilter,
    courseId,
    refetch,
}: any) => {
    let questions = data[activeVideo]?.questions || [];
    if (qaFilter === "my") {
        questions = questions.filter((q: any) => q?.user?._id === user?._id);
    }
    if (qaFilter === "first") {
        questions = [...questions].sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    if (qaFilter === "last") {
        questions = [...questions].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const contentId = data[activeVideo]?._id;
    return (
        <div className="w-full my-3">
            {questions.map((item: any, index: any) => (
                <CommentItem
                    key={index}
                    data={data}
                    activeVideo={activeVideo}
                    item={item}
                    index={index}
                    answer={answer}
                    setAnswer={setAnswer}
                    setQuestionId={setQuestionId}
                    handleAnswerSubmit={handleAnswerSubmit}
                    ansLoading={ansLoading}
                    user={user}
                    courseId={courseId}
                    contentId={contentId}
                    refetch={refetch}
                />
            ))}
        </div>
    );
};

// comment item
const CommentItem = ({
    setQuestionId,
    item,
    answer,
    setAnswer,
    handleAnswerSubmit,
    ansLoading,
    user,
    courseId,
    contentId,
    refetch,
}: any) => {
    const [replyActive, setReplyActive] = useState(false);
    const [qsMenuOpen, setQsMenuOpen] = useState(false);
    const [qsEditing, setQsEditing] = useState(false);
    const [qsEditValue, setQsEditValue] = useState(item?.question || item?.qustion || "");
    const [qsConfirmDelete, setQsConfirmDelete] = useState(false);
    const [replyMenuOpen, setReplyMenuOpen] = useState<number | null>(null);
    const [replyEditing, setReplyEditing] = useState<number | null>(null);
    const [replyEditValue, setReplyEditValue] = useState("");
    const [replyConfirmDelete, setReplyConfirmDelete] = useState<number | null>(null);

    const qsMenuRef = useRef<HTMLDivElement>(null);
    const replyMenuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    const [editQuestionMutation, { isLoading: editQsLoading }] = useEditQuestionMutation();
    const [deleteQuestionMutation, { isLoading: deleteQsLoading }] = useDeleteQuestionMutation();
    const [editAnswerMutation, { isLoading: editAnsLoading }] = useEditAnswerMutation();
    const [deleteAnswerMutation, { isLoading: deleteAnsLoading }] = useDeleteAnswerMutation();

    const isStaff = user && (user.role === "superadmin" || user.role === "admin" || user.role === "moderator" || user.role === "teacher");
    const isOwnQuestion = item?.user?._id === user?._id;
    const hasAdminReply = item.questionReplies?.some(
        (r: any) => r?.user?.role === "superadmin" || r?.user?.role === "admin" || r?.user?.role === "moderator" || r?.user?.role === "teacher"
    );
    const canReply = isStaff || (isOwnQuestion && hasAdminReply);
    const canModifyQuestion = isStaff || isOwnQuestion;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (qsMenuRef.current && !qsMenuRef.current.contains(e.target as Node)) {
                setQsMenuOpen(false);
            }
            Object.entries(replyMenuRefs.current).forEach(([idx, ref]) => {
                if (ref && !ref.contains(e.target as Node)) {
                    setReplyMenuOpen(null);
                }
            });
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEditQuestion = async () => {
        if (!qsEditValue.trim()) return toast.error("Question cannot be empty");
        try {
            await editQuestionMutation({ question: qsEditValue, courseId, contentId, questionId: item._id }).unwrap();
            toast.success("Question updated");
            setQsEditing(false);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update question");
        }
    };

    const handleDeleteQuestion = async () => {
        try {
            await deleteQuestionMutation({ courseId, contentId, questionId: item._id }).unwrap();
            toast.success("Question deleted");
            setQsConfirmDelete(false);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete question");
        }
    };

    const handleEditAnswer = async (replyItem: any) => {
        if (!replyEditValue.trim()) return toast.error("Reply cannot be empty");
        try {
            await editAnswerMutation({ answer: replyEditValue, courseId, contentId, questionId: item._id, answerId: replyItem._id }).unwrap();
            toast.success("Reply updated");
            setReplyEditing(null);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update reply");
        }
    };

    const handleDeleteAnswer = async (answerId: string) => {
        try {
            await deleteAnswerMutation({ courseId, contentId, questionId: item._id, answerId }).unwrap();
            toast.success("Reply deleted");
            setReplyConfirmDelete(null);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete reply");
        }
    };

    return (
        <div className="my-4">
            <div className="flex mb-2">
                <Image
                    src={
                        item?.user?.avatar
                            ? item.user.avatar.url
                            : "/assests/avatar.png"
                    }
                    width={50}
                    height={50}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full object-cover"
                />

                <div className="pl-3 flex-1">
                    <div className="flex items-center justify-between">
                        <h5 className="text-[20px]">{item?.user?.name}</h5>
                        {canModifyQuestion && (
                            <div className="relative" ref={qsMenuRef}>
                                <FiMoreVertical
                                    className="cursor-pointer text-text-basic"
                                    size={20}
                                    onClick={(e) => { e.stopPropagation(); setQsMenuOpen(!qsMenuOpen); }}
                                />
                                {qsMenuOpen && (
                                    <div className="absolute right-0 top-6 bg-background-Card_1 border border-gray-600 rounded shadow-lg z-50 w-32">
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-text-basic"
                                            onClick={() => { setQsEditing(true); setQsEditValue(item?.question || item?.qustion || ""); setQsMenuOpen(false); }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-red-400"
                                            onClick={() => { setQsConfirmDelete(true); setQsMenuOpen(false); }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {qsEditing ? (
                        <div className="mt-1">
                            <textarea
                                value={qsEditValue}
                                onChange={(e) => setQsEditValue(e.target.value)}
                                className="w-full outline-none bg-transparent border border-[#ffffff57] p-2 rounded text-[16px] font-Poppins"
                                rows={3}
                            />
                            <div className="flex gap-2 mt-1">
                                <button
                                    className="text-sm bg-button-btn_5 px-3 py-1 rounded text-white"
                                    onClick={handleEditQuestion}
                                    disabled={editQsLoading}
                                >
                                    {editQsLoading ? "Saving..." : "Save"}
                                </button>
                                <button
                                    className="text-sm bg-gray-600 px-3 py-1 rounded text-white"
                                    onClick={() => setQsEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>{item?.question || item?.qustion}</p>
                    )}
                    <small className="text-[#ffffff83]">
                        {!item.createdAt ? "" : format(item?.createdAt)}
                    </small>
                    {qsConfirmDelete && (
                        <div className="mt-2">
                            <span className="text-sm text-red-400 mr-2">Delete this question?</span>
                            <button
                                className="text-sm bg-red-600 px-2 py-1 rounded text-white mr-1"
                                onClick={handleDeleteQuestion}
                                disabled={deleteQsLoading}
                            >
                                {deleteQsLoading ? "..." : "Yes"}
                            </button>
                            <button
                                className="text-sm bg-gray-600 px-2 py-1 rounded text-white"
                                onClick={() => setQsConfirmDelete(false)}
                            >
                                No
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {(canReply || (item.questionReplies?.length || 0) > 0) && (
                <div className="w-full flex">
                    <span>
                        <span
                            className="800px:pl-16 text-[#000000b8] dark:text-[#ffffff83] cursor-pointer mr-2"
                            onClick={() => {
                                setReplyActive(!replyActive);
                                setQuestionId(item._id);
                            }}
                        >
                            {!replyActive
                                ? (item.questionReplies?.length || 0) !== 0
                                    ? "All Replies"
                                    : canReply
                                    ? "Add Reply"
                                    : ""
                                : "Hide Replies"}
                        </span>
                        <BiMessage
                            size={20}
                            className="dark:text-[#ffffff83] cursor-pointer text-[#000000b8]"
                        />
                        <span className="pl-1 mt-[-4px] cursor-pointer text-[#000000b8] dark:text-[#ffffff83]">
                            {item.questionReplies?.length || 0}
                        </span>
                    </span>
                </div>
            )}

            {replyActive && (
                <>
                    {(item.questionReplies || []).map((replyItem: any, rIndex: number) => {
                        const canModifyReply = isStaff || replyItem?.user?._id === user?._id;
                        return (
                            <div key={rIndex} className="w-full flex 800px:ml-16 my-5 text-black dark:text-white">
                                <div>
                                    <Image
                                        src={
                                            replyItem?.user?.avatar
                                                ? replyItem.user.avatar.url
                                                : "/assests/avatar.png"
                                        }
                                        width={50}
                                        height={50}
                                        alt=""
                                        className="w-[50px] h-[50px] rounded-full object-cover"
                                    />
                                </div>
                                <div className="pl-3 flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <h5 className="text-[20px]">{replyItem?.user?.name}</h5>
                                            {(replyItem?.user?.role === "superadmin" || replyItem?.user?.role === "admin" || replyItem?.user?.role === "moderator" || replyItem?.user?.role === "teacher") && (
                                                <BiSolidBadgeCheck className="text-blue-500 ml-2 text-[20px]" />
                                            )}
                                        </div>
                                        {canModifyReply && (
                                            <div className="relative" ref={(el) => { replyMenuRefs.current[rIndex] = el; }}>
                                                <FiMoreVertical
                                                    className="cursor-pointer text-text-basic"
                                                    size={20}
                                                    onClick={(e) => { e.stopPropagation(); setReplyMenuOpen(replyMenuOpen === rIndex ? null : rIndex); }}
                                                />
                                                {replyMenuOpen === rIndex && (
                                                    <div className="absolute right-0 top-6 bg-background-Card_1 border border-gray-600 rounded shadow-lg z-50 w-32">
                                                        <button
                                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-text-basic"
                                                            onClick={() => { setReplyEditing(rIndex); setReplyEditValue(replyItem.answer); setReplyMenuOpen(null); }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-red-400"
                                                            onClick={() => { setReplyConfirmDelete(rIndex); setReplyMenuOpen(null); }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {replyEditing === rIndex ? (
                                        <div className="mt-1">
                                            <textarea
                                                value={replyEditValue}
                                                onChange={(e) => setReplyEditValue(e.target.value)}
                                                className="w-full outline-none bg-transparent border border-[#ffffff57] p-2 rounded text-[14px] font-Poppins"
                                                rows={2}
                                            />
                                            <div className="flex gap-2 mt-1">
                                                <button
                                                    className="text-sm bg-button-btn_5 px-3 py-1 rounded text-white"
                                                    onClick={() => handleEditAnswer(replyItem)}
                                                    disabled={editAnsLoading}
                                                >
                                                    {editAnsLoading ? "Saving..." : "Save"}
                                                </button>
                                                <button
                                                    className="text-sm bg-gray-600 px-3 py-1 rounded text-white"
                                                    onClick={() => setReplyEditing(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>{replyItem.answer}</p>
                                    )}
                                    <small className="text-[#ffffff83]">
                                        {format(replyItem.createdAt)}
                                    </small>
                                    {replyConfirmDelete === rIndex && (
                                        <div className="mt-1">
                                            <span className="text-sm text-red-400 mr-2">Delete this reply?</span>
                                            <button
                                                className="text-sm bg-red-600 px-2 py-1 rounded text-white mr-1"
                                                onClick={() => handleDeleteAnswer(replyItem._id)}
                                                disabled={deleteAnsLoading}
                                            >
                                                {deleteAnsLoading ? "..." : "Yes"}
                                            </button>
                                            <button
                                                className="text-sm bg-gray-600 px-2 py-1 rounded text-white"
                                                onClick={() => setReplyConfirmDelete(null)}
                                            >
                                                No
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {canReply && (
                        <>
                            <div className="w-full flex relative">
                                <input
                                    type="text"
                                    placeholder="Enter your reply..."
                                    value={answer}
                                    onChange={(e: any) => setAnswer(e.target.value)}
                                    className={`block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#00000027] dark:text-white text-black dark:border-[#ffff] p-[5px] w-[95%] ${
                                        answer === "" ||
                                        (ansLoading && "cursor-not-allowed")
                                    }`}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 bottom-1"
                                    onClick={handleAnswerSubmit}
                                    disabled={answer === "" || ansLoading}
                                >
                                    Submit
                                </button>
                            </div>
                            <br />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default CourseContentMedia;
