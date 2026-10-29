"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCreateTrainingMutation } from "../../../redux/features/training/trainingApi";
import { FiPlus, FiTrash2, FiSave } from "react-icons/fi";
import AdminPageHeader from "../../components/AdminPageHeader";
import { MdSchool } from "react-icons/md";

const inputClass =
  "w-full bg-[#E6E6E6] dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-text-basic placeholder-gray-500 dark:placeholder-text-input outline-none focus:border-hover-text-1 transition-all text-sm";
const labelClass = "block text-sm font-medium text-text-basic mb-1.5";
const selectClass =
  "w-full bg-[#E6E6E6] dark:bg-background-Card_1 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-text-basic outline-none focus:border-hover-text-1 transition-all text-sm cursor-pointer";
const textareaClass =
  "w-full bg-[#E6E6E6] dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-text-basic placeholder-gray-500 dark:placeholder-text-input outline-none focus:border-hover-text-1 transition-all text-sm resize-none";

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h3 className="text-lg font-semibold text-text-basic mt-8 mb-4 pb-2 border-b border-[#ffffff1a]">
    {title}
  </h3>
);

const CreateTraining: React.FC = () => {
  const router = useRouter();
  const [createTraining, { isLoading }] = useCreateTrainingMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    thumbnailPreview: "",
    previewVideo: "",
    startDate: "",
    endDate: "",
    duration: "",
    schedule: "",
    mode: "Online" as "Online" | "Offline",
    meetingLink: "",
    venue: "",
    seatsTotal: 0,
    trainerName: "",
    trainerDesignation: "",
    trainerBio: "",
    trainerPhoto: "",
    trainerPhotoPreview: "",
    trainerExperience: "",
    trainerLinkedin: "",
    price: 0,
    isFree: false,
  });

  const [outcomes, setOutcomes] = useState([{ title: "" }]);
  const [eligibility, setEligibility] = useState([{ title: "" }]);
  const [modules, setModules] = useState([
    { moduleTitle: "", topics: [{ title: "" }] },
  ]);
  const [inclusions, setInclusions] = useState([{ title: "" }]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target;
    const value =
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const [thumbDragging, setThumbDragging] = useState(false);
  const [photoDragging, setPhotoDragging] = useState(false);

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "thumbnail" | "trainerPhoto",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        [field]: reader.result as string,
        [`${field}Preview`]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDropImage = (
    file: File | undefined,
    field: "thumbnail" | "trainerPhoto",
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        [field]: reader.result as string,
        [`${field}Preview`]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleListChange = (
    list: any[],
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    index: number,
    field: string,
    value: string,
  ) => {
    setter((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleAddItem = (
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    empty: any,
  ) => {
    setter((prev) => [...prev, { ...empty }]);
  };

  const handleRemoveItem = (
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    index: number,
  ) => {
    setter((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
    );
  };

  const handleTopicChange = (
    moduleIndex: number,
    topicIndex: number,
    value: string,
  ) => {
    setModules((prev) =>
      prev.map((mod, mi) =>
        mi === moduleIndex
          ? {
              ...mod,
              topics: mod.topics.map((t, ti) =>
                ti === topicIndex ? { ...t, title: value } : t,
              ),
            }
          : mod,
      ),
    );
  };

  const handleAddTopic = (moduleIndex: number) => {
    setModules((prev) =>
      prev.map((mod, mi) =>
        mi === moduleIndex
          ? { ...mod, topics: [...mod.topics, { title: "" }] }
          : mod,
      ),
    );
  };

  const handleRemoveTopic = (moduleIndex: number, topicIndex: number) => {
    setModules((prev) =>
      prev.map((mod, mi) =>
        mi === moduleIndex
          ? { ...mod, topics: mod.topics.filter((_, ti) => ti !== topicIndex) }
          : mod,
      ),
    );
  };

  const validate = () => {
    const required = [
      "title",
      "description",
      "startDate",
      "duration",
      "schedule",
      "trainerName",
      "trainerDesignation",
      "trainerBio",
      "trainerExperience",
    ];
    for (const field of required) {
      if (!form[field as keyof typeof form]) {
        toast.error(`Please fill in all required fields.`);
        return false;
      }
    }
    if (!form.isFree && !form.price) {
      toast.error("Please set a price or mark as free.");
      return false;
    }
    if (!form.seatsTotal) {
      toast.error("Please set the total number of seats.");
      return false;
    }
    if (form.mode === "Online" && !form.meetingLink) {
      toast.error("Please provide a meeting link for online training.");
      return false;
    }
    if (form.mode === "Offline" && !form.venue) {
      toast.error("Please provide a venue for offline training.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      status: "active",
      outcomes: outcomes.filter((o) => o.title.trim()),
      eligibility: eligibility.filter((e) => e.title.trim()),
      modules: modules
        .filter((m) => m.moduleTitle.trim())
        .map((m) => ({
          ...m,
          topics: m.topics.filter((t) => t.title.trim()),
        })),
      inclusions: inclusions.filter((i) => i.title.trim()),
      startDate: new Date(form.startDate).toISOString(),
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
    };

    try {
      await createTraining(payload).unwrap();
      toast.success("Training created successfully!");
      router.push("/admin/trainings");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create training.");
    }
  };

  const handleSaveDraft = async () => {
    if (!form.title.trim()) {
      toast.error("Please enter at least a title.");
      return;
    }

    const payload = {
      ...form,
      status: "pending",
      outcomes: outcomes.filter((o) => o.title.trim()),
      eligibility: eligibility.filter((e) => e.title.trim()),
      modules: modules
        .filter((m) => m.moduleTitle.trim())
        .map((m) => ({
          ...m,
          topics: m.topics.filter((t) => t.title.trim()),
        })),
      inclusions: inclusions.filter((i) => i.title.trim()),
      startDate: form.startDate
        ? new Date(form.startDate).toISOString()
        : undefined,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
    };

    try {
      await createTraining(payload).unwrap();
      toast.success("Training saved as draft!");
      router.push("/admin/trainings");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save draft.");
    }
  };

  return (
    <div className="w-full mx-auto pb-16">
      <AdminPageHeader
        icon={<MdSchool size={20} />}
        title="Add Training"
        subtitle="Create and configure a new training program"
      />
      <div className="bg-background-Card_1 rounded-3xl border border-[#ffffff1a] shadow-2xl p-8 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Basic Info */}
          <SectionTitle title="Basic Info" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>
                Title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Training title"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the training program"
                className={textareaClass}
              />
            </div>
            <div>
              <label className={labelClass}>Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                id="training-thumbnail"
                className="hidden"
                onChange={(e) => handleImage(e, "thumbnail")}
              />
              <label
                htmlFor="training-thumbnail"
                className={`w-full min-h-[160px] border-2 border-dashed border-gray-300 dark:border-white/40 hover:border-gray-400 dark:hover:border-white/60 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  thumbDragging
                    ? "bg-blue-500/10 border-blue-500"
                    : "bg-[#E5E5E5] dark:bg-white/5 hover:bg-[#dedede] dark:hover:bg-white/10"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setThumbDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setThumbDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setThumbDragging(false);
                  handleDropImage(e.dataTransfer.files?.[0], "thumbnail");
                }}
              >
                {form.thumbnailPreview ? (
                  <img
                    src={form.thumbnailPreview}
                    alt="Preview"
                    className="w-36 h-24 object-cover rounded-xl shadow-md"
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-text-basic font-medium text-sm">
                      Drop your thumbnail here
                    </p>
                    <p className="text-xs opacity-40 mt-1">
                      or click to browse from files
                    </p>
                  </div>
                )}
              </label>
            </div>
            <div>
              <label className={labelClass}>Preview Video (YouTube URL)</label>
              <input
                name="previewVideo"
                value={form.previewVideo}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                className={inputClass}
              />
            </div>
          </div>

          {/* What You'll Learn */}
          <SectionTitle title="What You'll Learn" />
          {outcomes.map((item, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <input
                value={item.title}
                onChange={(e) =>
                  handleListChange(
                    outcomes,
                    setOutcomes,
                    i,
                    "title",
                    e.target.value,
                  )
                }
                placeholder={`Outcome ${i + 1}`}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(setOutcomes, i)}
                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddItem(setOutcomes, { title: "" })}
            className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 font-semibold"
          >
            <FiPlus size={16} /> Add Outcome
          </button>

          {/* Eligibility */}
          <SectionTitle title="Eligibility" />
          {eligibility.map((item, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <input
                value={item.title}
                onChange={(e) =>
                  handleListChange(
                    eligibility,
                    setEligibility,
                    i,
                    "title",
                    e.target.value,
                  )
                }
                placeholder={`Eligibility ${i + 1}`}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(setEligibility, i)}
                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddItem(setEligibility, { title: "" })}
            className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 font-semibold"
          >
            <FiPlus size={16} /> Add Eligibility
          </button>

          {/* Batch / Schedule */}
          <SectionTitle title="Batch / Schedule" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Start Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Date (optional)</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Duration <span className="text-red-400">*</span>
              </label>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="e.g. 4 Weeks"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Schedule <span className="text-red-400">*</span>
              </label>
              <input
                name="schedule"
                value={form.schedule}
                onChange={handleChange}
                placeholder="e.g. Mon, Wed, Fri – 7PM to 9PM"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Mode <span className="text-red-400">*</span>
              </label>
              <select
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            {form.mode === "Online" && (
              <div>
                <label className={labelClass}>
                  Meeting Link <span className="text-red-400">*</span>
                </label>
                <input
                  name="meetingLink"
                  value={form.meetingLink}
                  onChange={handleChange}
                  placeholder="https://zoom.us/..."
                  className={inputClass}
                />
              </div>
            )}
            {form.mode === "Offline" && (
              <div>
                <label className={labelClass}>
                  Venue <span className="text-red-400">*</span>
                </label>
                <input
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  placeholder="Full address"
                  className={inputClass}
                />
              </div>
            )}
          </div>

          {/* Modules */}
          <SectionTitle title="Modules" />
          {modules.map((mod, mi) => (
            <div
              key={mi}
              className="bg-white/5 dark:bg-white/[0.02] rounded-2xl p-5 border border-[#ffffff0a] mb-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-text-basic opacity-60">
                  Module #{mi + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(setModules, mi)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              <input
                value={mod.moduleTitle}
                onChange={(e) =>
                  handleListChange(
                    modules,
                    setModules,
                    mi,
                    "moduleTitle",
                    e.target.value,
                  )
                }
                placeholder="Module title"
                className={inputClass + " mb-3"}
              />
              <p className="text-xs text-text-basic opacity-40 mb-2">Topics</p>
              {mod.topics.map((topic, ti) => (
                <div key={ti} className="flex items-center gap-3 mb-2 ml-4">
                  <input
                    value={topic.title}
                    onChange={(e) => handleTopicChange(mi, ti, e.target.value)}
                    placeholder={`Topic ${ti + 1}`}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(mi, ti)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddTopic(mi)}
                className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 font-semibold mt-2 ml-4"
              >
                <FiPlus size={16} /> Add Topic
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              handleAddItem(setModules, {
                moduleTitle: "",
                topics: [{ title: "" }],
              })
            }
            className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 font-semibold"
          >
            <FiPlus size={16} /> Add Module
          </button>

          {/* Seats */}
          <SectionTitle title="Seats" />
          <div className="max-w-xs">
            <label className={labelClass}>
              Total Seats <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="seatsTotal"
              value={form.seatsTotal}
              onChange={handleChange}
              placeholder="e.g. 30"
              className={inputClass}
              min={1}
            />
          </div>

          {/* Trainer Info */}
          <SectionTitle title="Trainer Info" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Trainer Name <span className="text-red-400">*</span>
              </label>
              <input
                name="trainerName"
                value={form.trainerName}
                onChange={handleChange}
                placeholder="Trainer's full name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Designation <span className="text-red-400">*</span>
              </label>
              <input
                name="trainerDesignation"
                value={form.trainerDesignation}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>
                Bio <span className="text-red-400">*</span>
              </label>
              <textarea
                name="trainerBio"
                value={form.trainerBio}
                onChange={handleChange}
                rows={3}
                placeholder="Short bio about the trainer"
                className={textareaClass}
              />
            </div>
            <div>
              <label className={labelClass}>Photo</label>
              <input
                type="file"
                accept="image/*"
                id="trainer-photo"
                className="hidden"
                onChange={(e) => handleImage(e, "trainerPhoto")}
              />
              <label
                htmlFor="trainer-photo"
                className={`w-full min-h-[160px] border-2 border-dashed border-gray-300 dark:border-white/40 hover:border-gray-400 dark:hover:border-white/60 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  photoDragging
                    ? "bg-blue-500/10 border-blue-500"
                    : "bg-[#E5E5E5] dark:bg-white/5 hover:bg-[#dedede] dark:hover:bg-white/10"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setPhotoDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setPhotoDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setPhotoDragging(false);
                  handleDropImage(e.dataTransfer.files?.[0], "trainerPhoto");
                }}
              >
                {form.trainerPhotoPreview ? (
                  <img
                    src={form.trainerPhotoPreview}
                    alt="Trainer"
                    className="w-20 h-20 object-cover rounded-full shadow-md"
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-text-basic font-medium text-sm">
                      Drop trainer photo here
                    </p>
                    <p className="text-xs opacity-40 mt-1">
                      or click to browse from files
                    </p>
                  </div>
                )}
              </label>
            </div>
            <div>
              <label className={labelClass}>
                Experience <span className="text-red-400">*</span>
              </label>
              <input
                name="trainerExperience"
                value={form.trainerExperience}
                onChange={handleChange}
                placeholder="e.g. 8+ Years"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>LinkedIn URL</label>
              <input
                name="trainerLinkedin"
                value={form.trainerLinkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Pricing */}
          <SectionTitle title="Pricing" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFree"
                  checked={form.isFree}
                  onChange={handleChange}
                  className="w-4 h-4 accent-hover-text-1"
                />
                <span className="text-sm text-text-basic">Free Training</span>
              </label>
            </div>
            {!form.isFree && (
              <div>
                <label className={labelClass}>
                  Price (৳) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  className={inputClass}
                  min={0}
                />
              </div>
            )}
          </div>

          {/* Inclusions */}
          <SectionTitle title="Inclusions" />
          {inclusions.map((item, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <input
                value={item.title}
                onChange={(e) =>
                  handleListChange(
                    inclusions,
                    setInclusions,
                    i,
                    "title",
                    e.target.value,
                  )
                }
                placeholder={`Inclusion ${i + 1}`}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(setInclusions, i)}
                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddItem(setInclusions, { title: "" })}
            className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 font-semibold"
          >
            <FiPlus size={16} /> Add Inclusion
          </button>

          {/* Submit */}
          <div className="pt-8 flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-10 py-4 rounded-xl bg-hover-text-1 hover:opacity-90 text-white dark:text-black font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              <FiSave size={18} />
              {isLoading ? "Creating..." : "Publish Training"}
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-10 py-4 rounded-xl border border-[#ffffff1a] text-text-basic hover:bg-white/5 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              <FiSave size={18} />
              {isLoading ? "Saving..." : "Save as Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTraining;
