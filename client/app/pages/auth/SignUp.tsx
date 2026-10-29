"use client";

import React, { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { signIn, useSession } from "next-auth/react";

// hooks
import {
  useRegisterMutation,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";

// icons
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";

// notification
import toast from "react-hot-toast";

type Props = {
  setRoute: (route: string) => void;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Please enter your name."),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email."),
  password: Yup.string().required("Please enter your password.").min(8),
});

const SignUp: FC<Props> = ({ setRoute }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const [register, { isSuccess, data, error }] = useRegisterMutation();
  const [socialAuth, { isSuccess: socialSuccess, error: socialError }] =
    useSocialAuthMutation();

  const { data: session, status } = useSession();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle social auth success
  useEffect(() => {
    if (session && status === "authenticated") {
      const { backendUser, accessToken } = session as any;

      if (backendUser && accessToken) {
        toast.success("Account created successfully!");
      }
    }
  }, [session, status]);

  useEffect(() => {
    if (isSuccess && data?.message) {
      toast.success(data.message);
      setRoute("Verification");
    }

    if (error) {
      const errorMessage =
        (error as any)?.data?.message ||
        "An error occurred during registration.";
      toast.error(errorMessage);
    }
  }, [isSuccess, data?.message, error, setRoute]);

  // Handle social login
  const handleSocialLogin = async (provider: "google") => {
    try {
      setSocialLoading(true);
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: window.location.origin,
      });

      if (result?.error) {
        toast.error(`${provider} signup failed`);
      }
    } catch (error) {
      console.error(`${provider} signup error:`, error);
      toast.error(`${provider} signup failed`);
    } finally {
      setSocialLoading(false);
    }
  };

  const { handleSubmit, handleChange, values, errors, touched } = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await register(values);
    },
  });

  return (
    <div className="w-full">
      <h1 className="title">Join to Best1 Academy</h1>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="w-full mb-3">
          <label className="label" htmlFor="name">
            Enter your name
          </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="mr. X"
            className={`input border border-text-basic px-2 mt-3 text-text-basic placeholder:text-text-basic ${errors.name && touched.name ? "border-message-error" : ""}`}
          />
          {errors.name && touched.name && (
            <span className="text-message-error pt-2 block">{errors.name}</span>
          )}
        </div>

        {/* Email */}
        <div className="w-full">
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
            className={`input border border-text-basic px-2 mt-3 text-text-basic placeholder:text-text-basic ${errors.email && touched.email ? "border-message-error" : ""}`}
          />
          {errors.email && touched.email && (
            <span className="text-message-error pt-2 block">
              {errors.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="w-full mt-5 mb-1 relative">
          <label className="label" htmlFor="password">
            Enter your password
          </label>
          <input
            type={!showPassword ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="P@$$w0Rd!"
            className={`input border border-text-basic px-2 mt-3 text-text-basic placeholder:text-text-basic ${errors.password && touched.password ? "border-message-error" : ""}`}
          />
          <button
            type="button"
            onClick={handleTogglePasswordVisibility}
            className="absolute bottom-3 right-2 z-1 cursor-pointer"
          >
            {showPassword ? <IoEye /> : <IoEyeOff />}
          </button>
        </div>
        {errors.password && touched.password && (
          <span className="text-message-error pt-2 block">
            {errors.password}
          </span>
        )}

        <div>
          <input
            type="submit"
            value="SignUp"
            className="button bg-button-btn_2 mt-6 text-white"
          />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-text-1">
          Or join with
        </h5>
        <div className="flex-center my-3 gap-x-1">
          <FcGoogle
            className={`cursor-pointer ${socialLoading ? "opacity-50" : ""}`}
            size={30}
            onClick={() => !socialLoading && handleSocialLogin("google")}
          />
        </div>

        {socialLoading && (
          <p className="text-center text-sm text-text-1">Creating account...</p>
        )}

        <h5
          className="text-center pt-4 font-Poppins text-[14px] cursor-pointer"
          onClick={() => setRoute("SignIn")}
        >
          Sign in
        </h5>
      </form>
      <br />
    </div>
  );
};

export default SignUp;
