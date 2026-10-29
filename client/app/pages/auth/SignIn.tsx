"use client";

import React, { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// hooks
import {
  useLogInMutation,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";

// icons
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";

// notification
import toast from "react-hot-toast";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email."),
  password: Yup.string().required("Please enter your password.").min(8),
});

const SignIn: FC<Props> = ({ setRoute, setOpen }) => {
  // show & hide pass
  const [showPass, setShowPass] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const togglePass = () => {
    setShowPass(!showPass);
  };

  const { data: session, status } = useSession();
  const router = useRouter();

  const [logIn, { isSuccess, error }] = useLogInMutation();
  const [socialAuth, { isSuccess: socialSuccess, error: socialError }] =
    useSocialAuthMutation();

  // Handle social auth success
  useEffect(() => {
    if (session && status === "authenticated") {
      // NextAuth handled the backend call, now update Redux state
      const { backendUser, accessToken } = session as any;

      if (backendUser && accessToken) {
        // Dispatch to Redux if needed
        toast.success("Social login successful!");
        setOpen(false);
      }
    }
  }, [session, status, setOpen]);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      await logIn({ email, password });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successfully!");
      setOpen(false);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error, setOpen]);

  // Handle social login
  const handleSocialLogin = async (provider: "google") => {
    try {
      setSocialLoading(true);
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: window.location.origin,
      });

      if (result?.error) {
        toast.error(`${provider} login failed`);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast.error(`${provider} login failed`);
    } finally {
      setSocialLoading(false);
    }
  };

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      <h1 className="title">Sign in with Best1 Academy</h1>
      <form onSubmit={handleSubmit}>
        {/* email */}
        <div className="w-full mt-10">
          <label className="label" htmlFor="email">
            Enter your email
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="login@gmail.com"
            className={`${
              errors.email && touched.email && "border-message-error"
            } input border border-text-basic px-2 mt-3 text-text-basic placeholder:text-text-basic`}
          />
          {errors.email && touched.email && (
            <span className="text-message-error pt-2 block">
              {errors.email}
            </span>
          )}
        </div>

        {/* password */}
        <div className="w-full mt-5 mb-1">
          <label className="label" htmlFor="password">
            Enter your password
          </label>
          <input
            type={!showPass ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="P@$$w0Rd!"
            className={`${
              errors.password && touched.password && "border-message-error"
            } input border border-text-basic px-2 mt-3 text-text-basic placeholder:text-text-basic`}
          />
          {/* eyeBtn */}
          <div className="relative">
            <button
              type="button"
              onClick={togglePass}
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
            >
              {showPass ? <IoEye /> : <IoEyeOff />}
            </button>
          </div>
          {errors.password && touched.password && (
            <span className="text-message-error pt-2 block">
              {errors.password}
            </span>
          )}
        </div>
        <div>
          <input
            type="submit"
            value="SignIn"
            className="button bg-button-btn_2 mt-6 text-white"
          />
        </div>
        <br />
        <h5 className="text-center mt-2 font-Poppins text-[14px] text-text-1">
          Or join with
        </h5>

        {/* social auth */}
        <div className="flex-center my-3 gap-x-1">
          <FcGoogle
            className={`cursor-pointer ${socialLoading ? "opacity-50" : ""}`}
            size={30}
            onClick={() => !socialLoading && handleSocialLogin("google")}
          />
        </div>

        {socialLoading && (
          <p className="text-center text-sm text-text-1">Signing in...</p>
        )}

        <h5
          className="text-center pt-4 font-Poppins text-[14px] cursor-pointer"
          onClick={() => setRoute("SignUp")}
        >
          Sign up
        </h5>
      </form>
      <br />
    </div>
  );
};

export default SignIn;
