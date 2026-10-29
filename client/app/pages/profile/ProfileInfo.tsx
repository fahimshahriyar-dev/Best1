import React, { FC, useEffect, useState } from "react";

import Image from "next/image";
import avatarIcon from "../../../public/assests/avatar.png";

import { FaCamera } from "react-icons/fa";

import {
    useUpdateAvatarMutation,
    useUpdateUserInfoMutation,
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";

import { useSelector } from "react-redux";
import { translations } from "../../utils/translations";
import { useGetAllLearningGoalTagsQuery } from "@/redux/features/tags/tagsApi";
import { IoClose } from "react-icons/io5";

type Props = {
    avatar: string | null;
    user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
    const { language } = useSelector((state: any) => state.language);
    const [loadUser, setLoadUser] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });

    const [updateAvatar, { isSuccess: isAvatarUpdateSuccess, error: avatarUpdateError }] = useUpdateAvatarMutation();

    const [updateUserInfo, { isLoading: isUserInfoUpdating, isSuccess: isUserInfoUpdateSuccess, error: userInfoUpdateError }] = useUpdateUserInfoMutation();

    const { data: tagsData } = useGetAllLearningGoalTagsQuery(undefined, {});
    const allTags = tagsData?.tags || [];

    const [form, setForm] = useState({
        name: "",
        phone: "",
        dob: "",
        gender: "",
        country: "",
        cityDistrict: "",
        postalCode: "",
        currentLevel: "",
        goal: "",
        goalTags: [] as string[],
    });

    const [tagSearch, setTagSearch] = useState("");

    const filteredTags = allTags.filter((tag: any) =>
        tag.title.toLowerCase().includes(tagSearch.toLowerCase())
    );

    const addTag = (tagTitle: string) => {
        if (form.goalTags.length >= 5) {
            toast.error("You can add up to 5 tags");
            return;
        }
        if (form.goalTags.includes(tagTitle)) {
            toast.error("Tag already added");
            return;
        }
        setForm(prev => ({ ...prev, goalTags: [...prev.goalTags, tagTitle] }));
        setTagSearch("");
    };

    const removeTag = (tagTitle: string) => {
        setForm(prev => ({
            ...prev,
            goalTags: prev.goalTags.filter(t => t !== tagTitle)
        }));
    };

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                phone: user.phone || "",
                dob: user.dob || "",
                gender: user.gender || "",
                country: user.country || "",
                cityDistrict: user.cityDistrict || "",
                postalCode: user.postalCode || "",
                currentLevel: user.currentLevel || "",
                goal: user.goal || "",
                goalTags: user.goalTags || [],
            });
        }
    }, [user]);

    const imageHandler = async (e: any) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Please select a valid image file (JPEG, PNG, WebP)");
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('avatar', file);
            await updateAvatar(formData);
        } catch (error) {
            toast.error("Failed to update profile picture");
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    useEffect(() => {
        if (avatarUpdateError) {
            const errorMessage = (avatarUpdateError as any)?.data?.message || "Failed to update profile picture";
            toast.error(errorMessage);
        }

        if (userInfoUpdateError) {
            const errorMessage = (userInfoUpdateError as any)?.data?.message || "Failed to update user information";
            toast.error(errorMessage);
        }

        if (isUserInfoUpdateSuccess) {
            toast.success("Profile updated successfully!");
            setLoadUser(true);
        }

        if (isAvatarUpdateSuccess) {
            toast.success("Profile picture updated successfully!");
            setLoadUser(true);
        }
    }, [isAvatarUpdateSuccess, avatarUpdateError, isUserInfoUpdateSuccess, userInfoUpdateError]);

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        await updateUserInfo({
            name: form.name.trim(),
            phone: form.phone,
            dob: form.dob,
            gender: form.gender,
            country: form.country,
            cityDistrict: form.cityDistrict,
            postalCode: form.postalCode,
            currentLevel: form.currentLevel,
            goal: form.goal,
            goalTags: form.goalTags,
        });
    };

    const inputClass = "input w-full border-b border-b-text-basic rounded-none";
    const selectClass = "input w-full border-b border-b-text-basic rounded-none cursor-pointer";
    const labelClass = "block pb-1.5 text-sm font-medium text-text-basic";

    return (
        <div className="w-full">
            {/* Avatar Card */}
            <div className="bg-background-Card_1 bg-opacity-90 border border-[#ffffff1d] rounded-2xl p-8 mb-6">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <Image
                            src={user?.avatar?.url || avatar || avatarIcon}
                            alt="User avatar"
                            width={120}
                            height={120}
                            className="rounded-full border-[3px] border-[#37a39a] object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = avatarIcon.src;
                            }}
                        />
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            className="hidden"
                            onChange={imageHandler}
                            accept="image/png,image/jpg,image/jpeg,image/webp"
                            disabled={isUploading}
                        />
                        <label htmlFor="avatar">
                            <div className={`w-[30px] h-[30px] bg-background-option_2 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
                                {isUploading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                    <FaCamera size={20} className="text-white p-[2px]" />
                                )}
                            </div>
                        </label>
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-text-basic">{form.name || user?.name}</h2>
                    <p className="text-sm text-text-basic opacity-60">{user?.email}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-background-Card_1 bg-opacity-90 border border-[#ffffff1d] rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-hover-text-1 mb-4 pb-2 border-b border-[#ffffff1d]">
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <label className={labelClass}>{translations[language].full_name}</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>{translations[language].email_address}</label>
                            <input
                                type="text"
                                required
                                readOnly
                                value={user?.email}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Phone Number</label>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className={inputClass}
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Date of Birth</label>
                            <input
                                type="text"
                                value={form.dob}
                                onChange={(e) => handleChange("dob", e.target.value)}
                                className={inputClass}
                                placeholder="DD/MM/YYYY"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Gender</label>
                            <select
                                value={form.gender}
                                onChange={(e) => handleChange("gender", e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Location & Education */}
                <div className="bg-background-Card_1 bg-opacity-90 border border-[#ffffff1d] rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-hover-text-1 mb-4 pb-2 border-b border-[#ffffff1d]">
                        Location & Education
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <label className={labelClass}>Country</label>
                            <input
                                type="text"
                                value={form.country}
                                onChange={(e) => handleChange("country", e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>City / District</label>
                            <input
                                type="text"
                                value={form.cityDistrict}
                                onChange={(e) => handleChange("cityDistrict", e.target.value)}
                                className={inputClass}
                                placeholder="e.g. Dhaka"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Postal Code</label>
                            <input
                                type="text"
                                value={form.postalCode}
                                onChange={(e) => handleChange("postalCode", e.target.value)}
                                className={inputClass}
                                placeholder="e.g. 1207"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Current Education Level</label>
                            <select
                                value={form.currentLevel}
                                onChange={(e) => handleChange("currentLevel", e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Select level</option>
                                <option value="Currently in school (SSC level)">Currently in school (SSC level)</option>
                                <option value="Currently in college (HSC level)">Currently in college (HSC level)</option>
                                <option value="Undergraduate student">Undergraduate student</option>
                                <option value="Postgraduate student">Postgraduate student</option>
                                <option value="Completed education">Completed education</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Learning Goals */}
                <div className="bg-background-Card_1 bg-opacity-90 border border-[#ffffff1d] rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-hover-text-1 mb-4 pb-2 border-b border-[#ffffff1d]">
                        Learning Goals
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>What do you hope to achieve?</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={tagSearch}
                                    onChange={(e) => setTagSearch(e.target.value)}
                                    className={inputClass}
                                    placeholder="Search and add tags..."
                                    disabled={form.goalTags.length >= 5}
                                />
                                {tagSearch && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-background-Card_1 border border-[#ffffff1a] rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                                        {filteredTags.length > 0 ? (
                                            filteredTags.map((tag: any) => (
                                                <button
                                                    key={tag._id}
                                                    type="button"
                                                    onClick={() => addTag(tag.title)}
                                                    className="w-full text-left px-4 py-3 text-text-basic hover:bg-hover-bg-1 transition-colors border-b border-[#ffffff0a] last:border-b-0"
                                                >
                                                    {tag.title}
                                                </button>
                                            ))
                                        ) : (
                                            <p className="px-4 py-3 text-text-basic opacity-40 text-sm">No tags found</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            {form.goalTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {form.goalTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-full text-sm font-medium"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-red-500 transition-colors"
                                            >
                                                <IoClose size={16} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Update Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="w-full md:w-[200px] h-[44px] bg-[#37a39a] hover:bg-[#2c8a82] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center"
                        disabled={isUserInfoUpdating}
                    >
                        {isUserInfoUpdating ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            translations[language].update
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileInfo;
