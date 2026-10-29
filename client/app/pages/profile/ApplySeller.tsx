"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  useSubmitSellerApplicationMutation,
  useGetMySellerApplicationStatusQuery,
} from "../../../redux/features/sellerApplication/sellerApplicationApi";
import { FiExternalLink } from "react-icons/fi";
import {
  MdStorefront,
  MdCheckCircle,
  MdPending,
  MdCancel,
} from "react-icons/md";

type Props = {
  user: any;
};

const inputClass =
  "w-full bg-[#E6E6E6] dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-text-basic placeholder-gray-500 dark:placeholder-text-input outline-none focus:border-hover-text-1 transition-all text-sm";
const labelClass = "block text-sm font-medium text-text-basic mb-1.5";
const selectClass =
  "w-full bg-[#E6E6E6] dark:bg-background-Card_1 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-text-basic outline-none focus:border-hover-text-1 transition-all text-sm cursor-pointer";

const occupationOptions = [
  "Doctor",
  "Engineer",
  "Teacher",
  "Lawyer",
  "Nurse",
  "Business Owner",
  "Student",
  "Freelancer",
  "Content Creator",
  "Homemaker",
  "Retired",
  "Government Employee",
  "Private Employee",
  "Chef",
  "Artist",
  "Writer",
  "Photographer",
  "Others",
];

const productOptions = [
  "Certificate Course",
  "Academic",
  "Religious",
  "E-book",
];

const socialMediaOptions = [
  "Facebook",
  "Instagram",
  "YouTube",
  "Twitter/X",
  "TikTok",
  "LinkedIn",
  "Pinterest",
  "Snapchat",
  "Telegram",
  "WhatsApp",
];

const SectionTitle: React.FC<{ number: number; title: string }> = ({
  number,
  title,
}) => (
  <div className="flex items-center gap-3 mb-5 mt-8">
    <div className="w-8 h-8 rounded-full bg-hover-text-1 flex items-center justify-center text-white dark:text-black text-sm font-bold flex-shrink-0">
      {number}
    </div>
    <h3 className="text-lg font-semibold text-text-basic">{title}</h3>
  </div>
);

const ApplySeller: React.FC<Props> = ({ user }) => {
  const { data: statusData, refetch } = useGetMySellerApplicationStatusQuery(
    undefined,
    { refetchOnMountOrArgChange: true },
  );
  const [submitApplication, { isLoading }] =
    useSubmitSellerApplicationMutation();

  const existingApplication = statusData?.application;

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    occupation: "",
    occupationOther: "",
    country: "",
    city: "",
    postalCode: "",
    address: "",
    productCategory: [] as string[],
    productCategoryAll: false,
    productType: "Both",
    shopName: "",
    shopCategory: "",
    shopAddressType: "",
    shopAddressOffline: "",
    shopAddressOnline: [] as string[],
    shopAddressOther: "",
    onlinePresenceType: "personal",
    shopLinkedinUrl: "",
    shopFacebookUrl: "",
    shopYoutubeUrl: "",
    shopPortfolioUrl: "",
    personalLinkedinUrl: "",
    personalFacebookUrl: "",
    personalYoutubeUrl: "",
    personalPortfolioUrl: "",
    whyJoin: "",
    additionalInfo: "",
    confirmAccuracy: false,
    agreeTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleProductCategoryToggle = (option: string) => {
    setForm((prev) => {
      const isSelected = prev.productCategory.includes(option);
      return {
        ...prev,
        productCategory: isSelected
          ? prev.productCategory.filter((p) => p !== option)
          : [...prev.productCategory, option],
        productCategoryAll: false,
      };
    });
  };

  const handleSelectAllProducts = () => {
    setForm((prev) => {
      const allSelected = prev.productCategoryAll;
      return {
        ...prev,
        productCategory: allSelected ? [] : [...productOptions],
        productCategoryAll: !allSelected,
      };
    });
  };

  const handleSocialMediaToggle = (app: string) => {
    setForm((prev) => ({
      ...prev,
      shopAddressOnline: prev.shopAddressOnline.includes(app)
        ? prev.shopAddressOnline.filter((a) => a !== app)
        : [...prev.shopAddressOnline, app],
    }));
  };

  const validate = () => {
    const required = [
      "fullName",
      "email",
      "phoneNumber",
      "occupation",
      "country",
      "city",
    ];
    for (const field of required) {
      if (!form[field as keyof typeof form]) {
        toast.error(`Please fill in all required fields.`);
        return false;
      }
    }
    if (form.productCategory.length === 0) {
      toast.error("Please select at least one product category.");
      return false;
    }
    if (form.occupation === "Others" && !form.occupationOther) {
      toast.error("Please specify your occupation.");
      return false;
    }
    if (form.whyJoin && form.whyJoin.length > 100) {
      toast.error(
        "'Why do you want to become a seller?' must be under 100 characters.",
      );
      return false;
    }
    if (!form.confirmAccuracy) {
      toast.error("Please confirm that all information is accurate.");
      return false;
    }
    if (!form.agreeTerms) {
      toast.error("Please agree to the Terms & Conditions and Privacy Policy.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const { confirmAccuracy, agreeTerms, ...payload } = form;
      await submitApplication(payload).unwrap();
      toast.success("Application submitted successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit application.");
    }
  };

  if (existingApplication) {
    const statusConfig = {
      pending: {
        icon: <MdPending size={40} className="text-blue-600" />,
        color: "text-blue-700",
        bg: "bg-blue-100 border-blue-300 dark:bg-blue-500/10 dark:border-blue-500/30",
        label: "Under Review",
        desc: "Your application is currently being reviewed by our team. We'll get back to you soon.",
      },
      approved: {
        icon: (
          <MdCheckCircle
            size={40}
            className="text-[#0D8043] dark:text-green-400"
          />
        ),
        color: "text-[#0D8043] dark:text-green-400",
        bg: "bg-green-100 border-green-400 dark:bg-green-600/20 dark:border-green-500/40",
        label: "Approved!",
        desc: "Congratulations! Your seller application has been approved.",
      },
      rejected: {
        icon: <MdCancel size={40} className="text-red-400" />,
        color: "text-red-400",
        bg: "bg-red-400/10 border-red-400/20",
        label: "Not Approved",
        desc: "Unfortunately, your application was not approved at this time.",
      },
    };
    const cfg =
      statusConfig[existingApplication.status as keyof typeof statusConfig];
    return (
      <div className="w-full max-w-2xl mx-auto px-6 py-10">
        <div className={`rounded-2xl border p-8 text-center ${cfg.bg}`}>
          <div className="flex justify-center mb-4">{cfg.icon}</div>
          <h2 className={`text-2xl font-bold mb-2 ${cfg.color}`}>
            Application {cfg.label}
          </h2>
          <p className="text-text-basic opacity-70 mb-4">{cfg.desc}</p>
          {existingApplication.adminNote && (
            <div className="mt-4 p-4 bg-background-Card_2/10 dark:bg-white/5 rounded-xl text-sm text-text-basic text-left">
              <span className="font-semibold">Admin note: </span>
              {existingApplication.adminNote}
            </div>
          )}
          <p className="text-xs text-text-basic opacity-40 mt-4">
            Submitted on{" "}
            {new Date(existingApplication.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-background-Card_1 rounded-3xl border border-[#ffffff1a] shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-2">
          <MdStorefront size={32} className="text-hover-text-1" />
          <h2 className="text-2xl font-bold text-text-basic">
            Apply to Become a Seller
          </h2>
        </div>
        <p className="text-sm text-text-basic opacity-50 mb-8">
          Fill out the form below to apply as a seller at Best1 Academy. Fields
          marked with <span className="text-red-400">*</span> are required.
        </p>

        <form onSubmit={handleSubmit} className="space-y-2">
          <SectionTitle number={1} title="Personal Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+880 1XXXXXXXXX"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Occupation <span className="text-red-400">*</span>
              </label>
              <select
                name="occupation"
                value={form.occupation}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">Select occupation</option>
                {occupationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {form.occupation === "Others" && (
              <div>
                <label className={labelClass}>
                  Please specify your occupation{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  name="occupationOther"
                  value={form.occupationOther}
                  onChange={handleChange}
                  placeholder="Enter your occupation"
                  className={inputClass}
                />
              </div>
            )}
          </div>

          <SectionTitle number={2} title="Location" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Country <span className="text-red-400">*</span>
              </label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="e.g. Bangladesh"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                City / District <span className="text-red-400">*</span>
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Dhaka"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Postal Code</label>
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="e.g. 1207"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Street, area"
                className={inputClass}
              />
            </div>
          </div>

          <SectionTitle number={3} title="What Product You Want To Sell" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>
                Product Categories <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-[#E6E6E6] dark:bg-white/5 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-text-basic font-semibold">
                  <input
                    type="checkbox"
                    checked={form.productCategoryAll}
                    onChange={handleSelectAllProducts}
                    className="accent-hover-text-1"
                  />
                  All
                </label>
                {productOptions.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 cursor-pointer text-sm text-text-basic"
                  >
                    <input
                      type="checkbox"
                      checked={form.productCategory.includes(opt)}
                      onChange={() => handleProductCategoryToggle(opt)}
                      className="accent-hover-text-1"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select
                name="productType"
                value={form.productType}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="Both">Both</option>
                <option value="Live">Live</option>
                <option value="Recorded">Recorded</option>
              </select>
            </div>
          </div>

          <SectionTitle number={4} title="Shop Details (Optional)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Shop Name</label>
              <input
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                placeholder="Your shop name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Shop Category</label>
              <input
                name="shopCategory"
                value={form.shopCategory}
                onChange={handleChange}
                placeholder="e.g. E-books, Templates"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Address</label>
              <select
                name="shopAddressType"
                value={form.shopAddressType}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">Select type</option>
                <option value="offline">Offline</option>
                <option value="online">Online</option>
              </select>
            </div>
            {form.shopAddressType === "offline" && (
              <div className="md:col-span-2">
                <label className={labelClass}>Shop Address</label>
                <input
                  name="shopAddressOffline"
                  value={form.shopAddressOffline}
                  onChange={handleChange}
                  placeholder="Street, area, city"
                  className={inputClass}
                />
              </div>
            )}
            {form.shopAddressType === "online" && (
              <div className="md:col-span-2">
                <label className={labelClass}>Social Media Platforms</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-[#E6E6E6] dark:bg-white/5 rounded-xl">
                  {socialMediaOptions.map((app) => (
                    <label
                      key={app}
                      className="flex items-center gap-2 cursor-pointer text-sm text-text-basic"
                    >
                      <input
                        type="checkbox"
                        checked={form.shopAddressOnline.includes(app)}
                        onChange={() => handleSocialMediaToggle(app)}
                        className="accent-hover-text-1"
                      />
                      {app}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {form.shopAddressType === "online" && (
              <div className="md:col-span-2">
                <label className={labelClass}>Other Platform</label>
                <input
                  name="shopAddressOther"
                  value={form.shopAddressOther}
                  onChange={handleChange}
                  placeholder="Specify other platform"
                  className={inputClass}
                />
              </div>
            )}
          </div>

          <SectionTitle number={5} title="Online Presence" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Presence Type</label>
              <select
                name="onlinePresenceType"
                value={form.onlinePresenceType}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="personal">Personal</option>
                <option value="shop">Shop</option>
              </select>
            </div>
            {(form.onlinePresenceType === "shop"
              ? [
                  {
                    name: "shopLinkedinUrl",
                    placeholder: "https://linkedin.com/in/yourprofile",
                    label: "LinkedIn Profile URL",
                  },
                  {
                    name: "shopFacebookUrl",
                    placeholder: "https://facebook.com/yourprofile",
                    label: "Facebook Page URL",
                  },
                  {
                    name: "shopYoutubeUrl",
                    placeholder: "https://youtube.com/@yourchannel",
                    label: "YouTube Channel URL",
                  },
                  {
                    name: "shopPortfolioUrl",
                    placeholder: "https://yourwebsite.com",
                    label: "Website / Portfolio",
                  },
                ]
              : [
                  {
                    name: "personalLinkedinUrl",
                    placeholder: "https://linkedin.com/in/yourprofile",
                    label: "LinkedIn Profile URL",
                  },
                  {
                    name: "personalFacebookUrl",
                    placeholder: "https://facebook.com/yourprofile",
                    label: "Facebook Page URL",
                  },
                  {
                    name: "personalYoutubeUrl",
                    placeholder: "https://youtube.com/@yourchannel",
                    label: "YouTube Channel URL",
                  },
                  {
                    name: "personalPortfolioUrl",
                    placeholder: "https://yourwebsite.com",
                    label: "Website / Portfolio",
                  },
                ]
            ).map((field) => (
              <div key={field.name}>
                <label className={labelClass}>{field.label}</label>
                <div className="relative">
                  <input
                    name={field.name}
                    value={form[field.name as keyof typeof form] as string}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`${inputClass} pr-10`}
                  />
                  <FiExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" />
                </div>
              </div>
            ))}
          </div>

          <SectionTitle number={6} title="Additional Information" />
          <div className="space-y-4">
            <div>
              <label className={labelClass}>
                Why do you want to become a seller?
                <span className="text-xs ml-2 opacity-50">
                  (optional, max 100 characters)
                </span>
              </label>
              <textarea
                name="whyJoin"
                value={form.whyJoin}
                onChange={handleChange}
                rows={4}
                className={`${inputClass} resize-none`}
              />
              {form.whyJoin.length > 100 && (
                <p className="text-xs text-red-400 mt-1">
                  {form.whyJoin.length}/100 characters
                </p>
              )}
            </div>
          </div>

          <SectionTitle number={7} title="Agreement" />
          <div className="space-y-4 mb-6">
            {[
              {
                name: "confirmAccuracy",
                label: "I confirm that all information is accurate.",
              },
              {
                name: "agreeTerms",
                label: "I agree to the Terms & Conditions.",
              },
            ].map((checkbox) => (
              <label
                key={checkbox.name}
                className="flex items-start gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={checkbox.name}
                  checked={form[checkbox.name as keyof typeof form] as boolean}
                  onChange={handleChange}
                  className="mt-1"
                />
                <span className="text-sm text-text-basic opacity-80">
                  {checkbox.label}
                </span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-hover-text-1 text-white dark:text-black font-bold rounded-xl transition-all shadow-lg disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplySeller;
