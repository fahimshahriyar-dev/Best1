import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

type Props = {
  data: any;
  user: any;
  setOpen: (open: boolean) => void;
  onProceed: (enrollmentData: any) => void;
  type?: "Live Course" | "Recorded Course";
};

const StudentEnrollmentForm = ({
  data,
  user,
  setOpen,
  onProceed,
  type = "Live Course",
}: Props) => {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      dob: "",
      gender: "",
    },
    location: {
      country: "Bangladesh",
      cityDistrict: "",
      postalCode: "",
    },
    education: {
      currentLevel: "",
      institutionName: "",
    },
    experience: {
      takenOnlineCourseBefore: "",
      heardAboutClass: "",
      goal: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      number: "",
    },
    agreements: {
      accurateInfo: false,
      confirmPayment: false,
      termsPolicy: false,
    },
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      const { personalInfo, location, education, experience, agreements } =
        formData;

      const isPersonalInfoValid =
        personalInfo.fullName.trim() !== "" &&
        personalInfo.email.trim() !== "" &&
        personalInfo.phone.trim() !== "";

      const isLocationValid =
        location.country.trim() !== "" && location.cityDistrict.trim() !== "";

      const isEducationValid = education.currentLevel.trim() !== "";

      const isExperienceValid =
        experience.takenOnlineCourseBefore.trim() !== "" &&
        experience.heardAboutClass.trim() !== "" &&
        experience.goal.trim().length >= 20;

      const isAgreementsValid =
        agreements.accurateInfo &&
        agreements.confirmPayment &&
        agreements.termsPolicy;

      setIsFormValid(
        isPersonalInfoValid &&
          isLocationValid &&
          isEducationValid &&
          isExperienceValid &&
          isAgreementsValid,
      );
    };

    validateForm();
  }, [formData]);

  const handleChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleProceed = () => {
    if (isFormValid) {
      onProceed(formData);
    }
  };

  const inputClass =
    "w-full bg-[#E6E6E6] dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-text-basic placeholder-gray-500 dark:placeholder-text-input outline-none focus:border-hover-text-1 transition-all text-sm";
  const labelClass = "block text-sm font-medium text-text-basic mb-1.5";
  const selectClass =
    "w-full bg-[#E6E6E6] dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-text-basic outline-none focus:border-hover-text-1 transition-all text-sm cursor-pointer";

  return (
    <div className="w-full max-w-3xl bg-background-Card_1 rounded-3xl border border-[#ffffff1a] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#ffffff1a] flex justify-between items-center bg-background-Card_2/10">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-text-basic">
            Student Enrollment Form
          </h2>
        </div>
        <IoCloseOutline
          size={30}
          className="text-gray-400 hover:text-white cursor-pointer transition-colors"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* Form Body */}
      <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
        <p className="text-sm text-text-basic opacity-50 mb-8">
          Please fill out the form below to enroll in the {type}. Fields marked
          with <span className="text-red-400">*</span> are required.
        </p>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className={inputClass}
                value={formData.personalInfo.fullName}
                onChange={(e) =>
                  handleChange("personalInfo", "fullName", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelClass}>
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className={inputClass}
                value={formData.personalInfo.email}
                onChange={(e) =>
                  handleChange("personalInfo", "email", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelClass}>
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="+880 1XXXXXXXXX"
                className={inputClass}
                value={formData.personalInfo.phone}
                onChange={(e) =>
                  handleChange("personalInfo", "phone", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                className={inputClass}
                value={formData.personalInfo.dob}
                onChange={(e) =>
                  handleChange("personalInfo", "dob", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select
                className={selectClass}
                value={formData.personalInfo.gender}
                onChange={(e) =>
                  handleChange("personalInfo", "gender", e.target.value)
                }
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <hr className="border-white/5 my-2" />

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>
                Country <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                className={inputClass}
                value={formData.location.country}
                onChange={(e) =>
                  handleChange("location", "country", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelClass}>
                City / District <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dhaka"
                className={inputClass}
                value={formData.location.cityDistrict}
                onChange={(e) =>
                  handleChange("location", "cityDistrict", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelClass}>Postal Code</label>
              <input
                type="text"
                placeholder="e.g. 1207"
                className={inputClass}
                value={formData.location.postalCode}
                onChange={(e) =>
                  handleChange("location", "postalCode", e.target.value)
                }
              />
            </div>
          </div>

          <hr className="border-white/5 my-2" />

          {/* Education */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>
                Current Education Level <span className="text-red-400">*</span>
              </label>
              <select
                className={selectClass}
                value={formData.education.currentLevel}
                onChange={(e) =>
                  handleChange("education", "currentLevel", e.target.value)
                }
              >
                <option value="">Select level</option>
                <option value="Currently in school (SSC level)">
                  Currently in school (SSC level)
                </option>
                <option value="Currently in college (HSC level)">
                  Currently in college (HSC level)
                </option>
                <option value="Undergraduate student">
                  Undergraduate student
                </option>
                <option value="Postgraduate student">
                  Postgraduate student
                </option>
                <option value="Completed education">Completed education</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Institution Name</label>
              <input
                type="text"
                placeholder="e.g. University Name"
                className={inputClass}
                value={formData.education.institutionName}
                onChange={(e) =>
                  handleChange("education", "institutionName", e.target.value)
                }
              />
            </div>
          </div>

          <hr className="border-white/5 my-2" />

          {/* Experience */}
          <div className="space-y-5">
            <div>
              <label className={labelClass}>
                Taken online courses before?{" "}
                <span className="text-red-400">*</span>
              </label>
              <select
                className={selectClass}
                value={formData.experience.takenOnlineCourseBefore}
                onChange={(e) =>
                  handleChange(
                    "experience",
                    "takenOnlineCourseBefore",
                    e.target.value,
                  )
                }
              >
                <option value="">Select option</option>
                <option value="Yes — I have taken online courses before">
                  Yes — I have taken online courses before
                </option>
                <option value="No — This is my first online course">
                  No — This is my first online course
                </option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                How did you hear about us?{" "}
                <span className="text-red-400">*</span>
              </label>
              <select
                className={selectClass}
                value={formData.experience.heardAboutClass}
                onChange={(e) =>
                  handleChange("experience", "heardAboutClass", e.target.value)
                }
              >
                <option value="">Select option</option>
                <option value="Facebook">Facebook</option>
                <option value="YouTube">YouTube</option>
                <option value="Instagram">Instagram</option>
                <option value="From a friend or family member">
                  From a friend or family member
                </option>
                <option value="Google search">Google search</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                Learning Goals <span className="text-red-400">*</span>
              </label>
              <textarea
                placeholder="What do you hope to achieve?"
                className={`${inputClass} min-h-[100px] resize-none`}
                value={formData.experience.goal}
                onChange={(e) =>
                  handleChange("experience", "goal", e.target.value)
                }
              />
              <p
                className={`text-[10px] mt-1 ${formData.experience.goal.length < 20 ? "text-red-500" : "text-green-500"}`}
              >
                Minimum: 20 characters (Current:{" "}
                {formData.experience.goal.length})
              </p>
            </div>
          </div>

          <hr className="border-white/5 my-2" />

          {/* Emergency */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-3">
              <label className="text-sm font-bold text-hover-text-1 uppercase tracking-wider mb-2 block">
                Emergency Contact (Optional)
              </label>
            </div>
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                placeholder="Contact name"
                className={inputClass}
                value={formData.emergencyContact.name}
                onChange={(e) =>
                  handleChange("emergencyContact", "name", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelClass}>Relationship</label>
              <select
                className={selectClass}
                value={formData.emergencyContact.relationship}
                onChange={(e) =>
                  handleChange(
                    "emergencyContact",
                    "relationship",
                    e.target.value,
                  )
                }
              >
                <option value="">Select relation</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Spouse">Spouse</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Number</label>
              <input
                type="text"
                placeholder="Contact number"
                className={inputClass}
                value={formData.emergencyContact.number}
                onChange={(e) =>
                  handleChange("emergencyContact", "number", e.target.value)
                }
              />
            </div>
          </div>

          <hr className="border-white/5 my-2" />

          {/* Agreements */}
          <div className="space-y-4">
            {[
              {
                key: "accurateInfo",
                label:
                  "I confirm that all the information I have provided is accurate and truthful.",
              },
              {
                key: "confirmPayment",
                label:
                  "I understand that my enrollment is only confirmed after successful payment.",
              },
              {
                key: "termsPolicy",
                label:
                  "I agree to the Terms & Conditions and Privacy Policy of Best1 Academy.",
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <div
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.agreements[item.key as keyof typeof formData.agreements] ? "bg-hover-text-1 border-hover-text-1" : "border-gray-400 dark:border-white/20 group-hover:border-hover-text-1"}`}
                  onClick={() =>
                    handleChange(
                      "agreements",
                      item.key,
                      !formData.agreements[
                        item.key as keyof typeof formData.agreements
                      ],
                    )
                  }
                >
                  {formData.agreements[
                    item.key as keyof typeof formData.agreements
                  ] && (
                    <svg
                      className="w-3 h-3 text-white dark:text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-text-basic opacity-80">
                  {item.label} <span className="text-red-400">*</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-8 border-t border-[#ffffff1a] bg-background-Card_2/20 flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 text-sm">
          <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest mb-1">
            Enrolling in
          </p>
          <p className="font-bold text-text-basic text-lg">{data.name}</p>
          <p className="text-hover-text-1 font-bold">
            Total: ৳{data.coursePrice || data.price}
          </p>
        </div>
        <button
          onClick={handleProceed}
          disabled={!isFormValid}
          className={`md:w-[250px] w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${
            isFormValid
              ? "bg-hover-text-1 text-white dark:text-black shadow-lg shadow-hover-text-1/20 hover:opacity-90"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isFormValid ? "Submit & Proceed" : "Fill Required Fields"}
        </button>
      </div>
    </div>
  );
};

export default StudentEnrollmentForm;
