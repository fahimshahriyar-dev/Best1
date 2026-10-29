"use client";
import React, { useState } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { translations } from "../utils/translations";

const Consultancy = () => {
  const { language } = useSelector((state: any) => state.language);
  const t = translations[language];

  const industries = language === "bangla"
    ? ["আইটি", "ফিন্যান্স", "স্বাস্থ্যসেবা", "শিক্ষা", "রিয়েল এস্টেট", "খুচরা", "উৎপাদন", "অন্যান্য"]
    : ["IT", "Finance", "Healthcare", "Education", "Real Estate", "Retail", "Manufacturing", "Other"];
  const industriesValues = ["IT", "Finance", "Healthcare", "Education", "Real Estate", "Retail", "Manufacturing", "Other"];

  const consultancyTypes = language === "bangla"
    ? ["এককালীন", "চলমান", "প্রজেক্ট-ভিত্তিক"]
    : ["One-time", "Ongoing", "Project-based"];
  const consultancyValues = ["One-time", "Ongoing", "Project-based"];

  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    businessEmail: "",
    phoneNumber: "",
    companyWebsite: "",
    industry: "",
    subject: "",
    message: "",
    consultancyType: "",
    budgetRange: "",
    preferredTimeline: "",
    attachment: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, attachment: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contactPerson || !form.businessEmail || !form.phoneNumber || !form.subject || !form.message) {
      toast.error(language === "bangla" ? "অনুগ্রহ করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন।" : "Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        fullName: form.contactPerson,
        email: form.businessEmail,
        phoneNumber: form.phoneNumber,
        subject: form.subject,
        message: form.message,
        companyName: form.companyName,
        contactPerson: form.contactPerson,
        businessEmail: form.businessEmail,
        companyWebsite: form.companyWebsite,
        industry: form.industry,
        consultancyType: form.consultancyType,
        budgetRange: form.budgetRange,
        preferredTimeline: form.preferredTimeline,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}public-consultancy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setForm({
          companyName: "", contactPerson: "", businessEmail: "",
          phoneNumber: "", companyWebsite: "", industry: "", subject: "",
          message: "", consultancyType: "", budgetRange: "", preferredTimeline: "",
          attachment: null,
        });
      } else {
        toast.error(data.message || (language === "bangla" ? "অনুরোধ জমা দিতে ব্যর্থ হয়েছে।" : "Failed to submit inquiry."));
      }
    } catch (err: any) {
      toast.error(language === "bangla" ? "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।" : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[95%] 800px:w-[85%] m-auto mt-10 py-16">
      <h1 className="text-3xl font-Poppins font-[600] text-text-basic text-center mb-2">
        {t.consultancy_title}
      </h1>
      <p className="text-text-basic opacity-60 text-center mb-10 font-Poppins text-sm">
        {t.consultancy_subtitle}
      </p>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-Poppins text-text-basic mb-1">
              {t.consultancy_company_name} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-text-input/20 bg-transparent text-text-basic outline-none focus:border-hover-text-1 transition-colors font-Poppins text-sm"
              placeholder={t.consultancy_placeholder_company}
            />
          </div>
          <div>
            <label className="block text-sm font-Poppins text-text-basic mb-1">
              {t.consultancy_contact_person} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-text-input/20 bg-transparent text-text-basic outline-none focus:border-hover-text-1 transition-colors font-Poppins text-sm"
              placeholder={t.consultancy_placeholder_person}
            />
          </div>
          <div>
            <label className="block text-sm font-Poppins text-text-basic mb-1">
              {t.consultancy_business_email} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="businessEmail"
              value={form.businessEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-text-input/20 bg-transparent text-text-basic outline-none focus:border-hover-text-1 transition-colors font-Poppins text-sm"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-Poppins text-text-basic mb-1">
              {t.consultancy_phone} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-text-input/20 bg-transparent text-text-basic outline-none focus:border-hover-text-1 transition-colors font-Poppins text-sm"
              placeholder="+8801XXXXXXXXX"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-Poppins text-text-basic mb-1">
              {t.consultancy_website}
            </label>
            <input
              type="url"
              name="companyWebsite"
              value={form.companyWebsite}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-text-input/20 bg-transparent text-text-basic outline-none focus:border-hover-text-1 transition-colors font-Poppins text-sm"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-Poppins text-text-basic mb-1">
              {t.consultancy_industry}
            </label>
            <select
              name="industry"
              value={form.industry}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-text-input/20 bg-transparent text-text-basic outline-none focus:border-hover-text-1 transition-colors font-Poppins text-sm appearance-none"
            >
              <option value="" className="bg-background-Card_1">{t.consultancy_select_industry}</option>
              {industries.map((ind, idx) => (
                <option key={idx} value={industriesValues[idx]} className="bg-background-Card_1">{ind}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-Poppins text-text-basic mb-1">
            {t.consultancy_subject} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-text-input/20 bg-transparent text-text-basic outline-none focus:border-hover-text-1 transition-colors font-Poppins text-sm"
            placeholder={t.consultancy_placeholder_subject}
          />
        </div>

        <div>
          <label className="block text-sm font-Poppins text-text-basic mb-1">
            {t.consultancy_message} <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-text-input/20 bg-transparent text-text-basic outline-none focus:border-hover-text-1 transition-colors font-Poppins text-sm resize-none"
            placeholder={t.consultancy_placeholder_message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-Poppins text-text-basic mb-1">
              {t.consultancy_type}
            </label>
            <select
              name="consultancyType"
              value={form.consultancyType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-text-input/20 bg-transparent text-text-basic outline-none focus:border-hover-text-1 transition-colors font-Poppins text-sm appearance-none"
            >
              <option value="" className="bg-background-Card_1">{t.consultancy_select_type}</option>
              {consultancyTypes.map((type, idx) => (
                <option key={idx} value={consultancyValues[idx]} className="bg-background-Card_1">{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-Poppins text-text-basic mb-1">
              {t.consultancy_budget}
            </label>
            <input
              type="text"
              name="budgetRange"
              value={form.budgetRange}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-text-input/20 bg-transparent text-text-basic outline-none focus:border-hover-text-1 transition-colors font-Poppins text-sm"
              placeholder="e.g. $5,000 - $10,000"
            />
          </div>
          <div>
            <label className="block text-sm font-Poppins text-text-basic mb-1">
              {t.consultancy_timeline}
            </label>
            <input
              type="text"
              name="preferredTimeline"
              value={form.preferredTimeline}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-text-input/20 bg-transparent text-text-basic outline-none focus:border-hover-text-1 transition-colors font-Poppins text-sm"
              placeholder="e.g. Q3 2026, or 3 months"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-Poppins text-text-basic mb-1">
            {t.consultancy_attachment}
          </label>
          <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-text-input/20 bg-transparent text-text-basic cursor-pointer hover:border-hover-text-1 transition-colors">
            <FiPaperclip size={18} />
            <span className="font-Poppins text-sm">
              {form.attachment ? form.attachment.name : t.consultancy_upload}
            </span>
            <input type="file" className="hidden" onChange={handleFile} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-Poppins font-[600] hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSend size={18} />
          {loading ? t.consultancy_submitting : t.consultancy_submit}
        </button>
      </form>
    </div>
  );
};

export default Consultancy;
