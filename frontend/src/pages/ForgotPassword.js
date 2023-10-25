// React / Packages
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import { InputField } from "../components/Inputs";
import { RectangleButton } from "../components/Buttons";
import { Divider } from "../components/Miscellaneous";
import SteppedProgressBar from "../components/SteppedProgressBar";
import CustomPasswordStrengthBar from "../components/CustomPasswordStrengthBar";

// Assets
import { PaperAirplaneIcon, ArrowLeftOnRectangleIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import Logo from "../assets/logo-no-background.png";

// API
// ~

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
            className="flex items-center justify-between min-h-screen bg-background-minor"
        >
            <section className="flex flex-col items-center justify-center w-full p-5">
                <img src={Logo} alt="logo" className="h-44" />

                <div className="flex flex-col w-2/3 max-w-md p-10 mx-auto mt-5 text-text-primary">
                    <p className="font-bold text-center text-2xl text-text-yellow-pineapple pb-8">Account Recovery</p>

                    <div className="py-2">
                        <SteppedProgressBar title="Password Forget" steps={3} currentPhase={stage} />
                    </div>

                    {stage === 1 && <>
                        <p className="pt-4">Enter the Email Address associated with your account, and we'll send you a recovery code.</p>

                        <Divider padding={4} />

                        <form onSubmit={handleRecoveryRequest}>
                            <InputField title="Email Address" placeholder="Enter Email Address" type="email" additionalProps={{ required: 'required' }}
                                value={email} onChange={(e) => setEmail(e.target.value)} />

                            <RectangleButton title="Send Recovery Code" forForm heroIcon={<PaperAirplaneIcon />} colour="bg-button-green" />
                        </form>
                    </>}

                    {stage === 2 && <>
                        <p className="pt-4">A recovery code has been dispatched to your email! Enter the 6-digit code here:</p>

                        <Divider padding={4} />

                        <form onSubmit={handleRecoveryCheck}>
                            <InputField title="Recovery Code" placeholder="Enter Recovery Code" type="text" additionalProps={{ pattern: '[0-9]{6}', required: 'required' }}
                                value={recoveryCode} onChange={(e) => setRecoveryCode(e.target.value)} />

                            <RectangleButton title="Submit Recovery Code" forForm heroIcon={<PaperAirplaneIcon />} colour="bg-button-green" />
                        </form>
                    </>}

                    {stage === 3 && <>
                        <p className="pt-4">Recovery code accepted! Please change your password:</p>

                        <Divider padding={4} />

                        <form onSubmit={handleChangePassword}>
                            <InputField title="Password" placeholder="Enter Password" type="password"
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                            <CustomPasswordStrengthBar password={password} passwordScore={passwordScore} setPasswordScore={setPasswordScore} />

                            <InputField title="Confirm Password" placeholder="Confirm Password" type="password" width='full'
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                            <RectangleButton title="Change Password" forForm heroIcon={<ArrowPathIcon />} colour="bg-button-green" />
                        </form>
                    </>}

                    <Divider />

                    <p className="pb-2">Suddenly remember your password?</p>

                    <RectangleButton title="Back to Login" onClick={handleReturnToLogin} heroIcon={<ArrowLeftOnRectangleIcon />} colour="bg-button-blue" />
                </div>
            </section>
        </div>
    );
}
