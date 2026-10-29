"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetTeachersQuery } from "@/redux/features/user/userApi";
import Image from "next/image";
import avatarIcon from "../../public/assests/avatar.png";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { translations } from "../utils/translations";

const Instructors = () => {
  const { data } = useGetTeachersQuery(undefined, {});
  const { language } = useSelector((state: any) => state.language);
  const teachers = data?.teachers || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const length = teachers.length;

  const colors = [
    "from-blue-600 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-pink-500",
    "from-cyan-500 to-blue-600",
    "from-rose-500 to-red-600",
    "from-violet-500 to-indigo-600",
  ];

  // Circular navigation — always wraps, never disabled.
  const goPrev = () => setActiveIndex((i) => (i - 1 + length) % length);
  const goNext = () => setActiveIndex((i) => (i + 1) % length);

  // Circular offset: shortest signed distance from idx to activeIndex around the loop.
  // e.g. length=6, activeIndex=5, idx=0 -> raw diff = -5, wrapped to +1 (wraps forward, not backward).
  const getCircularOffset = (idx: number) => {
    let diff = idx - activeIndex;
    if (diff > length / 2) diff -= length;
    if (diff < -length / 2) diff += length;
    return diff;
  };

  const MAX_VISIBLE_OFFSET = 2;
  const SPACING = 190;

  return (
    <div className="bg-background-Theme pt-[clamp(48px,7.78vw,112px)] pb-[clamp(48px,7.78vw,112px)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="w-[90%] 800px:w-[85%] mx-auto relative z-10">
        <div className="text-center pb-[50px]">
          <h1 className="font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl text-text-basic 800px:!leading-[60px] font-bold tracking-tight">
            {translations[language]?.meet_our || "Meet Our"}{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              {translations[language]?.instructors || "Instructors"}
            </span>
          </h1>
          <h2 className="title text-center">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-2 align-middle" />
            {translations[language]?.instructors_subtitle || "learn from industry experts and passionate mentors"}
          </h2>
        </div>

        {teachers.length > 0 ? (
          <div className="relative group/container">
            <div className="relative h-[440px] flex items-center justify-center overflow-hidden">
              {teachers.map((teacher: any, idx: number) => {
                const gradient = colors[idx % colors.length];
                const offset = getCircularOffset(idx);
                const absOffset = Math.abs(offset);

                if (absOffset > MAX_VISIBLE_OFFSET) return null;

                const isActive = offset === 0;
                const scale = isActive ? 1 : absOffset === 1 ? 0.82 : 0.68;
                const opacity = isActive ? 1 : absOffset === 1 ? 0.55 : 0.25;
                const translateX = offset * SPACING;
                const zIndex = 50 - absOffset;

                return (
                  <div
                    key={teacher._id}
                    onClick={() => setActiveIndex(idx)}
                    style={{
                      transform: `translateX(${translateX}px) scale(${scale})`,
                      opacity,
                      zIndex,
                    }}
                    className={`absolute w-[280px] bg-background-Card_1 rounded-3xl border p-7 text-center shrink-0 overflow-hidden transition-all duration-500 ease-out cursor-pointer ${
                      isActive
                        ? "border-[#ffffff30] shadow-2xl shadow-blue-500/10"
                        : "border-[#ffffff12] hover:opacity-80"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-b ${gradient} ${
                        isActive ? "opacity-[0.06]" : "opacity-[0.03]"
                      } transition-opacity duration-500`}
                    />

                    <div className="relative z-10">
                      <div className="relative w-24 h-24 mx-auto mb-5">
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} p-[2px]`}>
                          <div className="w-full h-full rounded-full bg-background-Card_1" />
                        </div>
                        {(() => {
                          const avatarSrc =
                            (typeof teacher.avatar === "string" ? teacher.avatar : teacher.avatar?.url) ||
                            teacher.picture ||
                            avatarIcon;
                          return (
                            <Image
                              src={avatarSrc}
                              alt={teacher.name || "Instructor"}
                              width={92}
                              height={92}
                              unoptimized={typeof avatarSrc === "string"}
                              className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full object-cover border-2 border-background-Card_1"
                            />
                          );
                        })()}
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-[3px] border-background-Card_1 flex items-center justify-center">
                          <HiOutlineAcademicCap size={14} className="text-white" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-text-basic capitalize tracking-tight">
                        {teacher.name}
                      </h3>
                      {teacher.email && (
                        <p className="text-sm text-text-basic/40 mt-1.5 truncate max-w-[200px] mx-auto">
                          {teacher.email}
                        </p>
                      )}

                      <div className="mt-5 flex items-center justify-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
                        <span
                          className={`text-xs font-bold uppercase tracking-[0.15em] bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                        >
                          Instructor
                        </span>
                        <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prev / Next — always active if multiple teachers exist */}
            {length > 1 && (
              <>
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={goPrev}
                    className="w-12 h-12 rounded-xl bg-background-Card_1 border border-[#ffffff1a] flex items-center justify-center text-text-basic shadow-2xl transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:text-blue-400"
                  >
                    <IoIosArrowBack size={22} />
                  </button>

                  <button
                    onClick={goNext}
                    className="w-12 h-12 rounded-xl bg-background-Card_1 border border-[#ffffff1a] flex items-center justify-center text-text-basic shadow-2xl transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:text-blue-400"
                  >
                    <IoIosArrowForward size={22} />
                  </button>
                </div>

                <div className="flex justify-center gap-2 mt-6">
                  {teachers.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === activeIndex
                          ? "w-8 bg-blue-500"
                          : "w-2 bg-text-basic/20 hover:bg-text-basic/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-background-Card_1 border border-[#ffffff1a] flex items-center justify-center">
              <HiOutlineAcademicCap size={28} className="opacity-40" />
            </div>
            <p className="text-lg text-text-basic/40 font-medium">
              {translations[language]?.no_instructors || "No instructors available at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructors;