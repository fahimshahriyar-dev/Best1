import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";
import { translations } from "../utils/translations";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Props = {};

const FAQ = (props: Props) => {
    const { language } = useSelector((state: any) => state.language);
    const { data } = useGetHeroDataQuery("FAQ", {});
    const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        if (data?.layout?.faq) {
            setQuestions(data.layout.faq);
        }
    }, [data]);

    const toggleQuestion = (id: string) => {
        setActiveQuestion(activeQuestion === id ? null : id);
    };

    return (
        <div className="bg-background-Theme pb-[clamp(32px,5.56vw,80px)] pt-[clamp(20px,2.78vw,40px)]">
            <div className="w-[90%] 800px:w-[70%] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h1 className="text-2xl sm:text-3xl 800px:text-5xl font-bold font-Poppins tracking-tight">
                        {translations[language].common} <span className="text-gradient">{translations[language].faq_short}</span>
                    </h1>
                    <h2 className="title text-center">
                        <span aria-hidden="true" className="inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-2 align-middle" />
                        {translations[language].frequently_asked_questions}
                    </h2>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {questions.map((q, index) => (
                        <motion.div
                            key={q._id || index}
                            initial={false}
                            className={`bg-background-Card_1 rounded-2xl border border-[#ffffff1a] overflow-hidden transition-all duration-300 ${activeQuestion === q._id ? 'border-blue-500/50 shadow-lg shadow-blue-500/5' : ''}`}
                        >
                            <button
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                                onClick={() => toggleQuestion(q._id)}
                            >
                                <span className={`text-base sm:text-lg font-medium transition-colors duration-300 ${activeQuestion === q._id ? 'text-blue-500' : 'text-text-basic'}`}>
                                    {q.question}
                                </span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white transition-transform duration-500 ${activeQuestion === q._id ? "rotate-180" : ""}`}>
                                    <IoIosArrowDown className="text-xl" />
                                </div>
                            </button>

                            <AnimatePresence>
                                {activeQuestion === q._id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 pt-0 opacity-80 leading-relaxed text-sm sm:text-base text-text-basic font-Poppins border-t border-[#ffffff0a]">
                                            <div className="pt-4">
                                                {q.answer}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center opacity-60 text-sm">
                    <p>
                        {translations[language].faq_have_more}{" "}
                        <Link href="/faq" className="text-blue-500 cursor-pointer hover:underline">
                            {translations[language].faq_support_page}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
