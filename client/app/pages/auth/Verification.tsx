import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

// hooks
import { useActivationMutation } from '@/redux/features/auth/authApi';

// notification
import toast from 'react-hot-toast';

// icons
import { VscWorkspaceTrusted } from 'react-icons/vsc';

type Props = {
    setRoute: (route: string) => void;
    setOpen: (open: boolean) => void;
}

type VerifyNumber = {
    [key: string]: string; // More flexible type for verifyNumber
}

const Verification: FC<Props> = ({ setRoute, setOpen }) => {
    const { token } = useSelector((state: any) => state.auth);
    const [activation, { isSuccess, error }] = useActivationMutation();
    const [verificationCode, setVerificationCode] = useState<VerifyNumber>({ 0: "", 1: "", 2: "", 3: "" });
    const [isCodeInvalid, setIsCodeInvalid] = useState(false);
    const inputRefs = [

        useRef<HTMLInputElement>(null),
        
        useRef<HTMLInputElement>(null),
        
        useRef<HTMLInputElement>(null),
        
        useRef<HTMLInputElement>(null)
        
    ];

    useEffect(() => {
        if (isSuccess) {
            toast.success("Account activated successfully!");
            setOpen(false);
        }

        if (error) {
            const errorMessage = (error as any)?.data?.message || "Failed to activate account.";
            toast.error(errorMessage);
            setIsCodeInvalid(true);
        }
    }, [isSuccess, error, setRoute]);

    const handleInputChange = (index: number, value: string) => {
        setIsCodeInvalid(false);
        const singleDigit = value.slice(0, 1);
        const newVerificationCode = { ...verificationCode, [index]: singleDigit };
        setVerificationCode(newVerificationCode);

        if (singleDigit === "" && index > 0) {
            inputRefs[index - 1].current?.focus();
        } else if (singleDigit && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleVerifyOTP = async () => {
        const code = Object.values(verificationCode).join("");
        if (code.length !== 4) {
            setIsCodeInvalid(true);
            return;
        }
        await activation({ activation_token: token, activation_code: code });
    };

    return (
        <div>
            <h1 className='title'>
                Verify Your Account.
            </h1>
            <br />
            <div className='w-full flex-center mt-2'>
                <div className='w-[80px] h-[80px] rounded-full flex-center bg-background-Icon_1'>
                    <VscWorkspaceTrusted size={40} className='text-white' />
                </div>
            </div>
            <br />
            <br />
            <div className='m-auto flex-center'>
                {Object.keys(verificationCode).map((key, index) => (
                    <input
                        type="number"
                        key={key}
                        ref={inputRefs[index]}
                        placeholder=''
                        maxLength={1}
                        value={verificationCode[key]}
                        className={`${isCodeInvalid ? "shake border-message-error" : "border-text-basic"} w-[65px] h-[65px] ml-1 bg-transparent border-[3px] rounded-[10px] flex-center text-text-1 text-[18px] font-Poppins outline-none text-center`}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                ))}
            </div>
            <br />
            <br />
            <div className='w-full felx-center'>
                <button
                    className='button bg-button-btn_2 text-white'
                    onClick={handleVerifyOTP}
                >
                    Verify OTP
                </button>
                <br />
                <h5 className='text-center pt-4 font-Poppins text-[14px] text-text-2'>
                    Go back to sign in?
                    <span
                        className='text-link-link_2 pl-1 cursor-pointer'
                        onClick={() => setRoute("SignIn")}
                    >
                        Sign in
                    </span>
                </h5>
            </div>
        </div>
    );
};

export default Verification;