import toast from "react-hot-toast";
import {
    useEditLayoutMutation,
    useGetHeroDataQuery,
} from "../../../redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";

// icons
import { HiMiniPlusCircle } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import Loader from "@/app/components/Loader";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

type Props = {};

const EditFaq = (props: Props) => {
    const { data, isLoading, refetch } = useGetHeroDataQuery("FAQ", {
        refetchOnMountOrArgChange: true,
    });
    const [editLayout, { isSuccess: layoutSuccess, error }] =
        useEditLayoutMutation();
    const [questions, setQuestions] = useState<any[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (data?.layout?.faq) {
            setQuestions(
                data.layout.faq.map((item: any) => ({
                    ...item,
                    active: item.active === undefined ? false : item.active,
                }))
            );
            setHasChanges(false);
        }

        if (layoutSuccess) {
            refetch();
            toast.success("FAQ updated successfully!");
            setHasChanges(false);
        }

        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData?.data?.message);
            }
        }
    }, [data, layoutSuccess, error]);

    // ✅ toggle question
    const toggleQuestion = (id: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q._id === id ? { ...q, active: !q.active } : q
            )
        );
        setHasChanges(true);
    };

    // ✅ change question text
    const handleQuestionChange = (id: string, value: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q._id === id ? { ...q, question: value } : q
            )
        );
        setHasChanges(true);
    };

    // ✅ change answer text
    const handleAnswerChange = (id: string, value: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q._id === id ? { ...q, answer: value } : q
            )
        );
        setHasChanges(true);
    };

    // ✅ add new FAQ with custom unique ID (no uuid)
    const newFaqHandler = () => {
        const newFaq = {
            _id: "temp-" + Date.now() + "-" + Math.floor(Math.random() * 1000), // unique temporary ID
            question: "",
            answer: "",
            active: true,
        };
        setQuestions((prev) => [...prev, newFaq]);
        setHasChanges(true);
    };

    // ✅ check if any question/answer is empty
    const isAnyQuestionEmpty = (currentQuestions: any[]) => {
        return currentQuestions.some(
            (q) => q.question.trim() === "" || q.answer.trim() === ""
        );
    };

    // ✅ edit/save FAQ
    const handleEdit = async () => {
        if (hasChanges && !isAnyQuestionEmpty(questions)) {
            // Filter out temporary _id before sending
            const formattedFaq = questions.map(({ _id, ...rest }) => {
                return _id?.startsWith("temp-") ? rest : { _id, ...rest };
            });
    
            await editLayout({
                type: "FAQ",
                faq: formattedFaq,
            });
        }
    };

    // ✅ enable save button only when needed
    const isSaveButtonEnabled = () => {
        return hasChanges && !isAnyQuestionEmpty(questions);
    };

    return (
        <div className="w-full flex-1 flex flex-col h-full min-h-0">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full flex-1 flex flex-col h-full min-h-0">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 bg-background-Card_1 p-5 rounded-xl border border-text-basic/10 shadow-sm shrink-0">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-text-basic tracking-tight">
                                Edit FAQ
                            </h1>
                            <p className="text-xs sm:text-sm opacity-60 mt-0.5">
                                Customize the frequently asked questions for your platform
                            </p>
                        </div>
                        <button 
                            onClick={newFaqHandler}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm flex items-center gap-2 active:scale-95 shrink-0"
                        >
                            <HiMiniPlusCircle size={18} />
                            Add Question
                        </button>
                    </div>

                    {/* Scrollable Questions Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-2 min-h-0">
                        <div className="space-y-4">
                            {questions.map((q: any) => (
                                <div
                                    key={q._id}
                                    className={`bg-background-Card_1 rounded-xl border transition-all duration-200 shadow-sm ${
                                        q.active 
                                            ? 'border-blue-500/40 ring-1 ring-blue-500/20' 
                                            : 'border-text-basic/10 hover:border-text-basic/20'
                                    }`}
                                >
                                    <div className="p-4 sm:p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <input
                                                    placeholder="Enter question..."
                                                    value={q.question}
                                                    className="w-full bg-transparent text-base sm:text-lg font-semibold text-text-basic outline-none placeholder:opacity-40"
                                                    onChange={(e: any) =>
                                                        handleQuestionChange(q._id, e.target.value)
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <button
                                                    onClick={() => toggleQuestion(q._id)}
                                                    className={`p-2 rounded-lg transition-all ${q.active ? 'bg-blue-500/10 text-blue-500' : 'bg-black/5 dark:bg-white/5 text-text-basic opacity-70 hover:opacity-100'}`}
                                                >
                                                    {q.active ? <IoIosArrowUp size={18} /> : <IoIosArrowDown size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setQuestions((prev) => prev.filter((item) => item._id !== q._id));
                                                        setHasChanges(true);
                                                    }}
                                                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                    title="Delete"
                                                >
                                                    <MdDelete size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className={`overflow-hidden transition-all duration-300 ${q.active ? 'max-h-[500px] mt-4 pt-4 border-t border-text-basic/10' : 'max-h-0'}`}>
                                            <textarea
                                                placeholder="Enter answer..."
                                                value={q.answer}
                                                rows={3}
                                                className="w-full bg-background-bar_2/50 dark:bg-white/5 p-3 rounded-lg border border-text-basic/10 text-text-basic text-sm outline-none focus:border-blue-500 transition-all resize-none placeholder:opacity-40"
                                                onChange={(e: any) =>
                                                    handleAnswerChange(q._id, e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {questions.length === 0 && (
                            <div className="text-center py-16 bg-background-Card_1 rounded-xl border border-dashed border-text-basic/20">
                                <p className="text-sm opacity-50 italic">No FAQ items yet. Click &quot;Add Question&quot; to get started.</p>
                            </div>
                        )}
                    </div>

                    {/* Bottom Save Bar (Docked at bottom, data cannot overlap or cross it) */}
                    <div className="pt-3 pb-2 flex justify-end shrink-0 z-10 border-t border-text-basic/5">
                        <button
                            onClick={isSaveButtonEnabled() ? handleEdit : () => null}
                            disabled={!isSaveButtonEnabled()}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center gap-2 ${
                                isSaveButtonEnabled() 
                                ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer hover:scale-105 active:scale-95 shadow-blue-500/30' 
                                : 'bg-black/10 dark:bg-white/5 text-text-basic/30 cursor-not-allowed'
                            }`}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditFaq;
