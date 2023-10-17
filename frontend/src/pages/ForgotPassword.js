import React from "react";
import toast from 'react-hot-toast';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo-no-background.png";

import { InputField } from "../components/Inputs";
import { RectangleButton } from "../components/Buttons";
import SteppedProgressBar from "../components/SteppedProgressBar";
import CustomPasswordStrengthBar from "../components/CustomPasswordStrengthBar";

import { PaperAirplaneIcon, ArrowLeftOnRectangleIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [stage, setStage] = useState(1);
    const [email, setEmail] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordScore, setPasswordScore] = useState(0);
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleRecoveryRequest = async () => {
        console.log("stage 1 launched!");

        setStage(2);
    };

    const handleRecoveryCheck = async (e) => {
        e.preventDefault();

        console.log("stage 2 launched!");

        setStage(3);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        console.log("stage 3 launched!");
    };

    const handleReturnToLogin = () => {
        navigate('../login');
    }

    return (
        <div
            id="forgot-password"
            className="flex items-center justify-between min-h-screen bg-[#161618]"
        >
            <section className="flex flex-col items-center justify-center w-full p-5">
                <div className="flex flex-col items-center justify-center text-center">
                    <img src={Logo} alt="logo" className="h-44" />
                </div>

                <div className="flex flex-col w-2/3 max-w-md p-10 mx-auto mt-5 bg-[#] border-[#FFFF00] border-0 rounded-lg text-white">
                    <p className="font-bold text-center text-2xl text-[#FFFF00]">Account Recovery</p>

                    <div className="py-4"></div>

                    <div>
                        <SteppedProgressBar title="Password Forget" steps={3} currentPhase={stage} />
                    </div>

                    {stage == 1 && <>
                        <p className="pt-4 pb-2">Enter the Email Address associated with your account, and we'll send you a recovery code.</p>

                        <div className="border-b border-gray-700"></div>
                        <div className="py-2"></div>

                        <form onSubmit={handleRecoveryRequest}>
                            <InputField title="Email Address" placeholder="Enter Email Address" type="email" width="full" additionalProps={{ required: 'required' }}
                                value={email} onChange={(e) => setEmail(e.target.value)} />

                            <RectangleButton title="Send Recovery Code" forForm heroIcon={<PaperAirplaneIcon />} colour="bg-green-800" />
                        </form>
                    </>}

                    {stage == 2 && <>
                        <p className="pt-4 pb-2">A recovery code has been dispatched to your email! Enter the 6-digit code here:</p>

                        <div className="border-b border-gray-700"></div>
                        <div className="py-2"></div>

                        <form onSubmit={handleRecoveryCheck}>
                            <InputField title="Recovery Code" placeholder="Enter Recovery Code" type="text" width="full" additionalProps={{ pattern: '[0-9]{6}', required: 'required' }}
                                value={recoveryCode} onChange={(e) => setRecoveryCode(e.target.value)} />

                            <RectangleButton title="Submit Recovery Code" forForm heroIcon={<PaperAirplaneIcon />} colour="bg-green-800" />
                        </form>
                    </>}

                    {stage == 3 && <>
                        <p className="pt-4 pb-2">Recovery code accepted! Please change your password:</p>

                        <div className="border-b border-gray-700"></div>
                        <div className="py-2"></div>

                        <form onSubmit={handleChangePassword}>
                            <InputField title="Password" placeholder="Enter Password" type="password" width="full"
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                            <CustomPasswordStrengthBar password={password} passwordScore={passwordScore} setPasswordScore={setPasswordScore} />

                            <InputField title="Confirm Password" placeholder="Confirm Password" type="password" width='full'
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                            <RectangleButton title="Change Password" forForm heroIcon={<ArrowPathIcon />} colour="bg-green-800" />
                        </form>
                    </>}

                    <div className="py-4"></div>
                    <div className="border-b border-gray-700"></div>

                    <p className="pt-4 pb-2">Suddenly remember your password?</p>

                    <div>
                        <RectangleButton title="Back to Login" onClick={handleReturnToLogin} heroIcon={<ArrowLeftOnRectangleIcon />} colour="bg-blue-500" />
                    </div>
                </div>
            </section>
        </div>
    );
}
