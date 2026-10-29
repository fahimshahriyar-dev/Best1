import React from "react";
import { FaGlobe } from "react-icons/fa";
import { PiChalkboardTeacherFill, PiStudentFill } from "react-icons/pi";
import { RiLiveFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { translations } from "../utils/translations";

type Props = {};

const About = (props: Props) => {
  const { language } = useSelector((state: any) => state.language);
  const t = translations[language];

  const steps = [
    { num: "1", titleKey: "about_step1_title", descKey: "about_step1_desc" },
    { num: "2", titleKey: "about_step2_title", descKey: "about_step2_desc" },
    { num: "3", titleKey: "about_step3_title", descKey: "about_step3_desc" },
    { num: "4", titleKey: "about_step4_title", descKey: "about_step4_desc" },
  ];

  return (
    <div className="text-text-basic bg-background-Theme py-20 pt-32 min-h-screen">
      <div className="w-[95%] 800px:max-w-[85%] mx-auto">
        {/* Intro Section */}
        <div className="space-y-6 mb-16">
          <h1 className="text-4xl 800px:text-5xl font-bold leading-tight">
            {t.about_hero_title?.split("quality education").length > 1 ? (
              <>
                {t.about_hero_title?.split("quality education")[0]}
                <span className="text-gradient">quality education</span>
                {t.about_hero_title?.split("quality education")[1]}
              </>
            ) : (
              t.about_hero_title
            )}
          </h1>
          <div className="max-w-3xl">
            <p className="text-lg 800px:text-xl leading-relaxed opacity-90">
              {t.about_hero_desc1}
            </p>
            <p className="text-lg 800px:text-xl leading-relaxed mt-4 opacity-90">
              {t.about_hero_desc2}
            </p>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 relative inline-block">
            {t.about_what_we_offer}
            <div className="absolute bottom-[-10px] left-0 w-2/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a] hover:border-blue-500 transition-all duration-300 group shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                <RiLiveFill className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.about_live_courses}</h3>
              <p className="opacity-80">{t.about_live_courses_desc}</p>
            </div>

            <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a] hover:border-blue-500 transition-all duration-300 group shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                <PiStudentFill className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.about_online_courses}</h3>
              <p className="opacity-80">{t.about_online_courses_desc}</p>
            </div>

            <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a] hover:border-blue-500 transition-all duration-300 group shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                <PiChalkboardTeacherFill className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.about_expert_instructors}</h3>
              <p className="opacity-80">{t.about_expert_instructors_desc}</p>
            </div>

            <div className="bg-background-Card_1 p-8 rounded-2xl border border-[#ffffff1a] hover:border-blue-500 transition-all duration-300 group shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                <FaGlobe className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.about_accessible_learning}</h3>
              <p className="opacity-80">{t.about_accessible_learning_desc}</p>
            </div>
          </div>
        </div>

        {/* Enrollment Process Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 relative inline-block">
            {t.about_how_to_enroll}
            <div className="absolute bottom-[-10px] left-0 w-2/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </h2>
          <div>
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-6 p-6 rounded-xl hover:bg-background-Card_1 transition-colors border border-transparent hover:border-[#ffffff1a]">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{t[step.titleKey]}</h3>
                  <p className="opacity-80">{t[step.descKey]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mentor CTA Section */}
        <div className="bg-gradient-to-br from-background-Card_1 to-background-Card_2 p-10 rounded-3xl border border-[#ffffff1a] mb-20 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-blue-500 opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">{t.about_become_mentor}</h2>
            <div className="max-w-3xl space-y-4 mb-8">
              <p className="text-lg opacity-90">{t.about_mentor_desc1}</p>
              <p className="text-lg opacity-90">{t.about_mentor_desc2}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
                {t.about_apply_mentor}
              </div>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{t.about_applications_open}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[45px] font-bold mb-8 text-gradient inline-block">{t.about_our_mission}</h2>
          <p className="text-xl leading-relaxed opacity-90 italic">
            {t.about_mission_quote}
          </p>
          <p className="text-lg mt-6 opacity-80">
            {t.about_mission_closing}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
