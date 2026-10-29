import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import { useSelector } from "react-redux";
import { translations } from "../../utils/translations";

type Props = {};

const ChangePass: FC<Props> = (props) => {
    const { language } = useSelector((state: any) => state.language);
    const { user } = useSelector((state: any) => state.auth);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

    const toggleOldPasswordVisibility = () => {
        setShowOldPassword(!showOldPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const changePassHandler = async (e: any) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Password do not match");
        } else {
            await updatePassword({ oldPassword, newPassword });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Password updated successfully");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
    }, [isSuccess, error]);

    const hasPassword = user?.hasPassword;

    const inputClass = "input w-full border-b border-b-text-basic rounded-none pr-10";
    const labelClass = "block pb-1.5 text-sm font-medium text-text-basic";

    return (
        <div className="w-full">
            <div className="bg-background-Card_1 bg-opacity-90 border border-[#ffffff1d] rounded-2xl p-6 md:p-8">
                <h1 className="text-2xl font-bold text-text-basic mb-6 pb-3 border-b border-[#ffffff1d]">
                    {hasPassword 
                        ? translations[language].password_change 
                        : translations[language].set_password}
                </h1>

                <form onSubmit={changePassHandler} className="space-y-5">
                    {hasPassword && (
                        <div>
                            <label className={labelClass}>
                                {translations[language].old_password}
                            </label>
                            <div className="relative">
                                <input
                                    type={showOldPassword ? "text" : "password"}
                                    required
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className={inputClass}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-basic opacity-60 hover:opacity-100 transition-opacity"
                                    onClick={toggleOldPasswordVisibility}
                                >
                                    {showOldPassword ? (
                                        <AiFillEyeInvisible size={20} />
                                    ) : (
                                        <AiFillEye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className={labelClass}>
                            {hasPassword 
                                ? translations[language].new_password 
                                : translations[language].set_password}
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={inputClass}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-basic opacity-60 hover:opacity-100 transition-opacity"
                                onClick={toggleNewPasswordVisibility}
                            >
                                {showNewPassword ? (
                                    <AiFillEyeInvisible size={20} />
                                ) : (
                                    <AiFillEye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>
                            {translations[language].confirm_password}
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={inputClass}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-basic opacity-60 hover:opacity-100 transition-opacity"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? (
                                    <AiFillEyeInvisible size={20} />
                                ) : (
                                    <AiFillEye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <input
                            type="submit"
                            value={translations[language].update}
                            className="w-full md:w-[200px] h-[44px] bg-[#37a39a] hover:bg-[#2c8a82] text-white font-semibold rounded-xl cursor-pointer transition-all duration-300"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePass;
