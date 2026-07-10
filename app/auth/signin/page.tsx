"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from 'next/navigation';
import { RiGoogleFill, RiCheckLine, RiLoader4Line } from "@remixicon/react";
import Image from 'next/image';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

function CustomButton({ children, onClick, type = "button", disabled }: CustomButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="group w-full h-[30px] relative flex items-center justify-center gap-[8px] rounded-[8px] drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[#f5f5f5] rounded-[8px] pointer-events-none" />
      <div className="relative z-10 flex items-center gap-[8px]">
        {children}
      </div>
      <div className="absolute inset-0 rounded-[8px] pointer-events-none shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white] transition-shadow" />
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    try {
      const authData: Record<string, any> = { email: userEmail, flow: isSignUp ? "signUp" : "signIn" };
      if (isSignUp) {
        authData.name = userName;
      }
      await signIn("resend-otp", authData);
      setStep("otp");
    } catch (error: any) {
      setAuthError(error?.message || "An error occurred while sending the code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    try {
      await signIn("resend-otp", { email: userEmail, code: otpCode });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      setAuthError("Invalid code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signIn("google", { redirectTo: "/dashboard" });
    } catch (error) {
      console.error("Google auth error:", error);
    }
  }

  const handleSlackAuth = async () => {
    try {
      await signIn("slack", { redirectTo: "/dashboard" });
    } catch (error) {
      console.error("Slack auth error:", error);
    }
  }

  return (
    <main className="bg-[#eff0ee] flex flex-col lg:flex-row min-h-screen w-full items-stretch relative font-['Inter',sans-serif]">

      <div className="relative w-full lg:w-[48%] xl:w-[922px] flex-shrink-0 min-h-[300px] lg:min-h-screen overflow-hidden">
        <Image
          src="/bg.png"
          alt="Background Graphic"
          fill
          className="absolute inset-0 object-cover opacity-90 pointer-events-none"
          priority
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-2 lg:p-[10px] relative self-stretch">
        <div className="w-full h-full relative flex flex-col items-center justify-center p-8 lg:p-[32px] rounded-[12px] drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.35),-3px_3px_3.5px_rgba(0,0,0,0.04)] max-w-none lg:max-w-[986px]">
          <div aria-hidden className="absolute inset-0 bg-[#f5f5f5] rounded-[12px] pointer-events-none" />
          <div className="absolute inset-0 rounded-[12px] pointer-events-none shadow-[inset_2px_0px_12px_0px_white,inset_0px_0px_0px_0px_white]" />

          <div className="relative z-10 w-full max-w-[384px] flex flex-col items-start">

            <div className="flex items-center gap-[8px] pb-[32px]">
              <div className="relative size-[28px] overflow-clip">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 overflow-visible">
                  <g id="Group" filter="url(#filter0_ii_133_206)">
                    <path id="Vector" d="M8.4 0H19.6C24.2392 0 28 3.76081 28 8.4V19.6C28 24.2392 24.2392 28 19.6 28H8.4C3.76081 28 0 24.2392 0 19.6V8.4C0 3.76081 3.76081 0 8.4 0Z" fill="url(#paint0_linear_133_206)" />
                    <g id="Frame">
                      <g id="Group_2">
                        <g id="Vector_2" filter="url(#filter1_i_133_206)">
                          <path d="M8.28356 17.9053H14.1346C14.5096 17.9053 14.7847 17.6048 14.7847 17.2541C14.7847 16.8784 14.4847 16.5779 14.1346 16.5779H13.0845C10.5589 16.5779 8.50856 14.524 8.50856 11.9943C8.50856 9.46457 10.5589 7.41071 13.0845 7.41071H18.3103C18.3103 7.41071 18.8943 7.44979 18.8943 9.39643C18.8943 11.3431 18.3103 11.3431 18.3103 11.3431H13.0845C12.7343 11.3431 12.4342 11.6436 12.4342 11.9943C12.4342 12.37 12.7343 12.6455 13.0845 12.6455H14.1346C16.6602 12.6455 18.7105 14.7244 18.7105 17.2541C18.7105 19.7839 16.6602 21.8377 14.1346 21.8377H8.28356V17.9053Z" fill="white" />
                        </g>
                      </g>
                      <path id="Vector_3" d="M14.6404 14.6159L14.1052 16.6128L13.8797 17.1989L15.5803 15.7248L15.9678 15.2786L16.3156 15.6315L15.7101 15.9198L13.8557 17.5552L14.7354 17.2283L14.7267 17.3565L16.8702 16.9435L18.223 15.1165C18.223 15.1165 18.1806 14.8989 17.5286 14.1817C16.8766 13.4645 16.6651 13.4215 16.6651 13.4215L14.6404 14.6159Z" fill="white" />
                      <path id="Vector_4" d="M16.3156 15.6315L15.9678 15.2786L15.5856 15.6821L13.9263 17.1447L13.8911 17.2426L14.5111 16.7405L14.6295 16.8917L15.7243 15.9207L16.3156 15.6315Z" fill="white" />
                      <g id="Group_3" filter="url(#filter2_i_133_206)">
                        <g id="Vector_5"></g>
                        <path id="Vector_6" d="M21.4506 9.33835C21.5328 9.33743 21.6053 9.3484 21.6805 9.38332C21.9399 9.5036 22.5958 10.2717 22.6874 10.5537C22.7293 10.6825 22.7071 10.7862 22.6421 10.9032C22.5882 11.0002 22.513 11.0831 22.4332 11.1594C22.246 11.3387 22.0374 11.4987 21.8415 11.6689L20.6157 12.7442L19.5141 13.7179C19.3066 13.9012 19.1014 14.0993 18.8801 14.2654C18.791 14.3323 18.6987 14.3645 18.5937 14.3952C18.5389 14.3869 18.4826 14.3718 18.4335 14.3456C18.2281 14.236 17.4078 13.3089 17.3453 13.0744C17.323 12.991 17.3414 12.9261 17.3859 12.8535C17.5673 12.5581 18.1992 12.0718 18.4865 11.8209L19.8723 10.6066C20.1103 10.3975 20.3498 10.1897 20.5851 9.9774C20.7489 9.8296 20.9013 9.6738 21.0766 9.53866C21.195 9.44737 21.3033 9.37335 21.4506 9.33835Z" fill="#EBEBEB" />
                      </g>
                      <g id="Group_4">
                        <g id="Vector_7" filter="url(#filter3_i_133_206)">
                          <path d="M16.9183 13.6673C16.9249 13.6674 16.9316 13.6667 16.9381 13.6677C17.1039 13.6929 17.8483 14.5534 17.9939 14.721C17.7323 15.0679 17.5103 15.3165 17.286 15.7018C17.0883 16.0414 16.9409 16.4071 16.7471 16.7463L16.7379 16.7621C16.4072 16.8456 16.0609 16.8729 15.7266 16.9415C15.0275 17.085 14.4504 17.3317 13.8074 17.6341C13.9952 17.4483 14.2068 17.2785 14.4058 17.1044L15.5401 16.1118C15.6021 16.0551 15.6683 16.0045 15.7348 15.9533C15.8425 15.9599 15.9546 15.9728 16.0581 15.9345C16.1899 15.8858 16.2539 15.7615 16.3119 15.6428C16.3098 15.637 16.3076 15.6312 16.3057 15.6254C16.2797 15.5502 16.2564 15.4891 16.2017 15.429C16.1266 15.3465 16.0283 15.2937 15.9153 15.2931C15.7786 15.2925 15.6869 15.3665 15.5963 15.4581C15.5644 15.5747 15.5649 15.6743 15.5712 15.7934C15.2691 16.0605 14.9644 16.3247 14.6572 16.5858C14.3959 16.8118 14.1394 17.0427 13.8725 17.262C13.9692 17.1023 14.074 16.9483 14.1646 16.7847C14.5197 16.1353 14.7741 15.4356 14.919 14.7095C15.19 14.5736 15.4843 14.483 15.7575 14.3492C16.1635 14.1503 16.5317 13.8988 16.9183 13.6673Z" fill="#EBEBEB" />
                        </g>
                      </g>
                    </g>
                  </g>
                  <defs>
                    <filter id="filter0_ii_133_206" x="0" y="-0.56" width="28" height="28.7" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dy="0.14" />
                      <feGaussianBlur stdDeviation="0.14" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_133_206" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dy="-0.56" />
                      <feGaussianBlur stdDeviation="0.28" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                      <feBlend mode="normal" in2="effect1_innerShadow_133_206" result="effect2_innerShadow_133_206" />
                    </filter>
                    <filter id="filter1_i_133_206" x="8.28356" y="6.85071" width="10.6107" height="14.987" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dy="-0.56" />
                      <feGaussianBlur stdDeviation="0.28" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_133_206" />
                    </filter>
                    <filter id="filter2_i_133_206" x="17.3358" y="8.77829" width="5.37296" height="5.61691" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dy="-0.56" />
                      <feGaussianBlur stdDeviation="0.28" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_133_206" />
                    </filter>
                    <filter id="filter3_i_133_206" x="13.8074" y="13.1072" width="4.18648" height="4.52696" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dy="-0.56" />
                      <feGaussianBlur stdDeviation="0.28" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_133_206" />
                    </filter>
                    <linearGradient id="paint0_linear_133_206" x1="14" y1="0" x2="14" y2="28" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1E78FF" stopOpacity="0.65" />
                      <stop offset="1" stopColor="#1E78FF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h1 className="font-medium text-[24px] tracking-[-0.6px] text-[#1E78FF] leading-[32px]">
                Scribe
              </h1>
            </div>

            <h2 className="font-semibold text-[16px] tracking-[-0.4px] text-[#4b4b4b] leading-[24px]">
              {step === "otp"
                ? "Check your email"
                : isSignUp ? "Create an account" : "Welcome back!"}
            </h2>
            <p className="font-normal text-[13px] text-[#606060] leading-[17.875px] mt-[4px]">
              {step === "otp"
                ? `We sent a secure code to ${userEmail}.`
                : "Master any language natively through immersion."}
            </p>

            {authError && (
              <div className="mt-[16px] w-full bg-red-50 text-red-600 px-[12px] py-[8px] rounded-[8px] text-[12px] font-medium border border-red-100">
                {authError}
              </div>
            )}

            {step === "email" && (
              <div className="w-full pt-[32px] flex gap-[8px]">
                <CustomButton onClick={handleGoogleAuth}>
                  <RiGoogleFill size={18} className="text-[#4b4b4b]" />
                </CustomButton>

                <CustomButton onClick={handleSlackAuth}>
                  <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <path d="M6.35319 14.3464C6.35319 15.4665 5.44506 16.3765 4.32316 16.3765C3.20125 16.3765 2.29495 15.4665 2.29495 14.3464C2.29495 13.2264 3.20308 12.3164 4.32498 12.3164H6.35501V14.3464H6.35319Z" fill="#E01E5A" />
                      <path d="M7.36728 14.3464C7.36728 13.2264 8.2754 12.3164 9.39731 12.3164C10.5192 12.3164 11.4273 13.2245 11.4273 14.3464V19.4206C11.4273 20.5407 10.5192 21.4506 9.39731 21.4506C8.2754 21.4506 7.36728 20.5425 7.36728 19.4206V14.3464Z" fill="#E01E5A" />
                      <path d="M9.39731 6.22815C8.27723 6.22815 7.36728 5.32003 7.36728 4.19812C7.36728 3.07622 8.27723 2.16992 9.39731 2.16992C10.5174 2.16992 11.4273 3.07805 11.4273 4.19995V6.22998H9.39731V6.22815Z" fill="#36C5F0" />
                      <path d="M9.39731 7.24414C10.5174 7.24414 11.4273 8.15226 11.4273 9.27417C11.4273 10.3961 10.5192 11.3042 9.39731 11.3042H4.32315C3.20307 11.3042 2.29312 10.3961 2.29312 9.27417C2.29312 8.15226 3.20124 7.24414 4.32315 7.24414H9.39731Z" fill="#36C5F0" />
                      <path d="M17.5156 9.27222C17.5156 8.15214 18.4237 7.24219 19.5456 7.24219C20.6657 7.24219 21.5757 8.15031 21.5757 9.27222C21.5757 10.3941 20.6675 11.3022 19.5456 11.3022H17.5156V9.27222Z" fill="#2EB67D" />
                      <path d="M16.4997 9.27229C16.4997 10.3924 15.5915 11.3023 14.4696 11.3023C13.3496 11.3023 12.4396 10.3942 12.4396 9.27229V4.19995C12.4414 3.07805 13.3496 2.16992 14.4715 2.16992C15.5915 2.16992 16.5015 3.07805 16.5015 4.19995V9.27229H16.4997Z" fill="#2EB67D" />
                      <path d="M14.4715 17.3911C15.5915 17.3911 16.5015 18.2992 16.5015 19.4211C16.5015 20.5412 15.5934 21.4512 14.4715 21.4512C13.3514 21.4512 12.4414 20.543 12.4414 19.4211V17.3911H14.4715Z" fill="#ECB22E" />
                      <path d="M14.4715 16.3765C13.3514 16.3765 12.4414 15.4683 12.4414 14.3464C12.4414 13.2245 13.3496 12.3164 14.4715 12.3164H19.5456C20.6657 12.3164 21.5757 13.2245 21.5757 14.3464C21.5757 15.4683 20.6675 16.3765 19.5456 16.3765H14.4715Z" fill="#ECB22E" />
                    </g>
                  </svg>
                </CustomButton>
              </div>
            )}

            {step === "email" && (
              <div className="w-full h-[30px] flex items-center pt-[12px] pb-[4px]">
                <div className="flex-1 h-px bg-[rgba(0,0,0,0.11)] shadow-[0px_1px_0px_0px_white]" />
                <div className="px-[8px]">
                  <p className="font-normal text-[12px] text-[#666] leading-[18px] text-center">or</p>
                </div>
                <div className="flex-1 h-px bg-[rgba(0,0,0,0.11)] shadow-[0px_1px_0px_0px_white]" />
              </div>
            )}

            <form className={`w-full flex flex-col gap-[14px] ${step === "otp" ? "mt-[32px]" : ""}`} onSubmit={step === "email" ? handleEmailSubmit : handleOtpSubmit}>
              {step === "email" ? (
                <>
                  {isSignUp && (
                    <input
                      name="name"
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your name"
                      className="w-full h-[34.563px] bg-white rounded-[8px] px-[12px] py-[8px] text-[13px] text-[#666] outline-none placeholder:text-[#666] focus:ring-1 focus:ring-[#1E78FF] transition-shadow shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100"
                    />
                  )}
                  <input
                    name="email"
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-[34.563px] bg-white rounded-[8px] px-[12px] py-[8px] text-[13px] text-[#666] outline-none placeholder:text-[#666] focus:ring-1 focus:ring-[#1E78FF] transition-shadow shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100"
                  />
                  <CustomButton type="submit" disabled={isSubmitting}>
                    <span className="font-medium text-[12px] text-[#4b4b4b] leading-[16px]">
                      {isSubmitting ? "Sending..." : "Sign in with email"}
                    </span>
                  </CustomButton>
                </>
              ) : (
                <>
                  <input
                    name="code"
                    type="text"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="••••••"
                    disabled={isSubmitting || isSuccess}
                    className="w-full h-[34.563px] bg-white rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#666] tracking-[0.5em] text-center outline-none placeholder:text-[#666] placeholder:tracking-[0.5em] focus:ring-1 focus:ring-[#1E78FF] transition-shadow shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100 disabled:opacity-50"
                  />
                  <CustomButton type="submit" disabled={isSubmitting || isSuccess || otpCode.length < 6}>
                    {isSubmitting ? (
                      <RiLoader4Line size={18} className="text-[#4b4b4b] animate-spin" />
                    ) : isSuccess ? (
                      <RiCheckLine size={18} className="text-[#2EB67D]" />
                    ) : (
                      <span className="font-medium text-[12px] text-[#4b4b4b] leading-[16px]">
                        Verify and Sign In
                      </span>
                    )}
                  </CustomButton>

                  <div className="w-full text-center mt-[4px]">
                    <button type="button" onClick={() => { setStep("email"); setAuthError(''); }} className="text-[11px] font-medium text-[#606060] hover:text-[#4b4b4b] transition-colors underline decoration-solid underline-offset-2">
                      Use a different email
                    </button>
                  </div>
                </>
              )}
            </form>

            {step === "email" && (
              <div className="w-full pt-[24px] flex justify-center">
                <p className="font-normal text-[11px] text-[#606060] leading-[15.125px]">
                  {isSignUp ? "Already have an account? " : "Don't have an account? "}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }}
                    className="font-medium text-[#4b4b4b] underline decoration-solid decoration-from-font underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E78FF]"
                  >
                    {isSignUp ? "Log in" : "Sign up"}
                  </button>
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
