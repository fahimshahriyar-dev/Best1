import React, { FC, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSubmitSurveyMutation } from "@/redux/features/user/userApi";
import toast from "react-hot-toast";
import AnimatedPopup from "./AnimatedPopup";

type Props = {
  user: any;
};

const SurveyPopup: FC<Props> = ({ user }) => {
  const [page, setPage] = useState(1);
  const [showSurvey, setShowSurvey] = useState(false);
  const [submitSurvey, { isSuccess, error }] = useSubmitSurveyMutation();

  const [surveyData, setSurveyData] = useState({
    description: "",
    ageGroup: "",
    reason: [] as string[],
    referral: "",
  });

  const [otherDescription, setOtherDescription] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [otherReferral, setOtherReferral] = useState("");

  useEffect(() => {
    if (user && !user.isSurveyCompleted) {
      setShowSurvey(true);
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Thank you for your feedback!");
      setShowSurvey(false);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  const validatePage = () => {
    if (page === 1) {
      if (!surveyData.description) return false;
      if (surveyData.description === "Other" && !otherDescription.trim()) return false;
    }
    if (page === 2) {
      if (!surveyData.ageGroup) return false;
    }
    if (page === 3) {
      if (surveyData.reason.length === 0) return false;
      if (surveyData.reason.includes("Something else — My reason is not listed here") && !otherReason.trim()) return false;
    }
    if (page === 4) {
      if (!surveyData.referral) return false;
      if (surveyData.referral === "Other" && !otherReferral.trim()) return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validatePage()) {
      if (page < 4) setPage(page + 1);
    } else {
      toast.error("Please select an option before proceeding.");
    }
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleReasonChange = (reason: string) => {
    const updatedReason = [...surveyData.reason];
    if (updatedReason.includes(reason)) {
      setSurveyData({
        ...surveyData,
        reason: updatedReason.filter((r) => r !== reason),
      });
    } else {
      setSurveyData({ ...surveyData, reason: [...updatedReason, reason] });
    }
  };

  const handleSubmit = async () => {
    if (!validatePage()) {
      toast.error("Please provide your answer before clicking Done.");
      return;
    }
    const finalData = {
      ...surveyData,
      description:
        surveyData.description === "Other"
          ? `Other: ${otherDescription}`
          : surveyData.description,
      reason: surveyData.reason.map((r) =>
        r === "Something else — My reason is not listed here"
          ? `Other: ${otherReason}`
          : r
      ),
      referral:
        surveyData.referral === "Other"
          ? `Other: ${otherReferral}`
          : surveyData.referral,
    };
    await submitSurvey(finalData);
  };

  if (!showSurvey) return null;

  return (
    <AnimatedPopup isOpen={showSurvey} zIndex={9999}>
      <div className="bg-background-Card_1 border border-[#ffffff1d] rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-8">
          <div
            className="bg-hover-text-1 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(page / 4) * 100}%` }}
          ></div>
        </div>

        {/* Page 1: Description */}
        {page === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-text-basic mb-6">
              Which of the following best describes you?
              <span className="block text-sm font-normal opacity-60 mt-1">(Select one)</span>
            </h2>
            <div className="space-y-3">
              {[
                "Student",
                "Working professional",
                "Teacher / Educator",
                "Freelancer",
                "Job seeker",
                "Homemaker",
                "Entrepreneur",
                "Other",
              ].map((item) => (
                <div key={item}>
                  <label className="flex items-center space-x-3 p-3 rounded-xl border border-text-input/20 cursor-pointer hover:bg-hover-text-1/10 transition-all">
                    <input
                      type="radio"
                      name="description"
                      value={item}
                      checked={surveyData.description === item}
                      onChange={(e) => setSurveyData({ ...surveyData, description: e.target.value })}
                      className="w-5 h-5 accent-hover-text-1"
                    />
                    <span className="text-text-basic">{item}</span>
                  </label>
                  {item === "Other" && surveyData.description === "Other" && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      value={otherDescription}
                      onChange={(e) => setOtherDescription(e.target.value)}
                      className="w-full mt-2 p-3 rounded-xl bg-transparent border border-hover-text-1 outline-none text-text-basic animate-slide-down"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page 2: Age Group */}
        {page === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-text-basic mb-6">
              What is your age group?
              <span className="block text-sm font-normal opacity-60 mt-1">(Select one)</span>
            </h2>
            <div className="space-y-3">
              {[
                "Under 15",
                "15 – 18",
                "19 – 24",
                "25 – 34",
                "35 – 44",
                "45 or above",
                "Prefer not to say",
              ].map((item) => (
                <label key={item} className="flex items-center space-x-3 p-3 rounded-xl border border-text-input/20 cursor-pointer hover:bg-hover-text-1/10 transition-all">
                  <input
                    type="radio"
                    name="ageGroup"
                    value={item}
                    checked={surveyData.ageGroup === item}
                    onChange={(e) => setSurveyData({ ...surveyData, ageGroup: e.target.value })}
                    className="w-5 h-5 accent-hover-text-1"
                  />
                  <span className="text-text-basic">{item}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Page 3: Reason */}
        {page === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-text-basic mb-6">
              What brings you to Best1 Academy?
              <span className="block text-sm font-normal opacity-60 mt-1">(Select all that apply)</span>
            </h2>
            <div className="space-y-3">
              {[
                { id: "live", label: "Join a live course — I want to attend real-time classes with an instructor" },
                { id: "course", label: "Buy a course — I want to purchase and learn from a recorded course" },
                { id: "ebook", label: "Browse e-books — I want to access reading materials and study resources" },
                { id: "teacher", label: "Become a teacher — I want to apply as a mentor or instructor" },
                { id: "mod", label: "Become a moderator — I want to help manage and support the community" },
                { id: "explore", label: "Just exploring — I want to see what Best1 Academy has to offer" },
                { id: "other", label: "Something else — My reason is not listed here" },
              ].map((item) => (
                <div key={item.id}>
                  <label className="flex items-start space-x-3 p-3 rounded-xl border border-text-input/20 cursor-pointer hover:bg-hover-text-1/10 transition-all">
                    <input
                      type="checkbox"
                      checked={surveyData.reason.includes(item.label)}
                      onChange={() => handleReasonChange(item.label)}
                      className="w-5 h-5 mt-1 accent-hover-text-1"
                    />
                    <span className="text-text-basic text-sm">{item.label}</span>
                  </label>
                  {item.id === "other" && surveyData.reason.includes(item.label) && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      className="w-full mt-2 p-3 rounded-xl bg-transparent border border-hover-text-1 outline-none text-text-basic animate-slide-down"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page 4: Referral */}
        {page === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-text-basic mb-6">
              How did you hear about us?
              <span className="block text-sm font-normal opacity-60 mt-1">(Select one)</span>
            </h2>
            <div className="space-y-3">
              {[
                "Facebook",
                "YouTube",
                "Instagram",
                "From a friend or family member",
                "Google search",
                "Other",
              ].map((item) => (
                <div key={item}>
                  <label className="flex items-center space-x-3 p-3 rounded-xl border border-text-input/20 cursor-pointer hover:bg-hover-text-1/10 transition-all">
                    <input
                      type="radio"
                      name="referral"
                      value={item}
                      checked={surveyData.referral === item}
                      onChange={(e) => setSurveyData({ ...surveyData, referral: e.target.value })}
                      className="w-5 h-5 accent-hover-text-1"
                    />
                    <span className="text-text-basic">{item}</span>
                  </label>
                  {item === "Other" && surveyData.referral === "Other" && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      value={otherReferral}
                      onChange={(e) => setOtherReferral(e.target.value)}
                      className="w-full mt-2 p-3 rounded-xl bg-transparent border border-hover-text-1 outline-none text-text-basic animate-slide-down"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex justify-between mt-10">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              page === 1
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
                : "bg-gray-200 dark:bg-gray-700 text-text-basic hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Previous
          </button>
          {page < 4 ? (
            <button
              onClick={handleNext}
              disabled={!validatePage()}
              className={`px-8 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                !validatePage()
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
                  : "bg-hover-text-1 text-white hover:bg-opacity-90"
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!validatePage()}
              className={`px-8 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                !validatePage()
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              Done
            </button>
          )}
        </div>
      </div>
    </AnimatedPopup>
  );
};

export default SurveyPopup;
