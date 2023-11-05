// React / Packages
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

// Components
import { InputField } from "../components/Inputs";
import { RectangleButton } from "../components/Buttons";
import { Divider } from "../components/Miscellaneous";
import { SteppedProgressBar } from "../components/CustomProgressBar";
import CustomPasswordStrengthBar from "../components/CustomPasswordStrengthBar";

// Assets
import { PaperAirplaneIcon, ArrowLeftOnRectangleIcon, ArrowPathIcon, ForwardIcon, BackwardIcon } from "@heroicons/react/24/solid";
import Logo from "../assets/logo-no-background.png";

// API
import { accountForgotPassword, accountValidateCode, accountResetPassword } from "../apis/exportedAPIs";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [stage, setStage] = useState(1);
    const [email, setEmail] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordScore, setPasswordScore] = useState(0);
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleRecoveryRequest = async (e) => {
        e.preventDefault();

        const response = await accountForgotPassword({ email: email });

        const json = await response.json();
        if (response.ok) {
            setStage(2);
        } else {
            toast.error(json.error);
        }
    };

    const handleRecoveryCheck = async (e) => {
        e.preventDefault();

        const response = await accountValidateCode({ email: email, code: recoveryCode });

        const json = await response.json();
        if (response.ok) {
            setStage(3);
        } else {
            toast.error(json.error);
            return;
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const response = await accountResetPassword({ email: email, password: password, code: recoveryCode });

        const json = await response.json();
        if (response.ok) {
            navigate('../setup-authenticator-qr', { state: { referrer: 'forgot', qrImageBase64: json.qrImage } });
        } else {
            toast.error(json.error);
            return;
        }
    };

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

                            <div className="py-2"></div>

                            <RectangleButton title="I Already Have a Code" onClick={() => setStage(2)} heroIcon={<ForwardIcon />} colour="bg-button-blue" />
                        </form>
                    </>}

                    {stage === 2 && <>
                        <p className="pt-4">A recovery code has been dispatched to your email! Enter the 6-digit code here:</p>

                        <Divider padding={4} />

                        <form onSubmit={handleRecoveryCheck}>
                            <InputField title="Recovery Code" placeholder="Enter Recovery Code" type="text" additionalProps={{ pattern: '[0-9]{6}', required: 'required' }}
                                value={recoveryCode} onChange={(e) => setRecoveryCode(e.target.value)} />

                            <RectangleButton title="Submit Recovery Code" forForm heroIcon={<PaperAirplaneIcon />} colour="bg-button-green" />

                            <div className="py-2"></div>

                            <RectangleButton title="I Don't Have a Code" onClick={() => setStage(1)} heroIcon={<BackwardIcon />} colour="bg-button-blue" />
                        </form>
                    </>}

                    {stage === 3 && <>
                        <p className="pt-4">Recovery code accepted! Please change your password:</p>

                        <Divider padding={4} />

                        <form onSubmit={handleChangePassword}>
                            <InputField title="Password" placeholder="Enter Password" type="password"
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                            <CustomPasswordStrengthBar title="Forgot Password Reset" password={password} passwordScore={passwordScore} setPasswordScore={setPasswordScore} />

                            <InputField title="Confirm Password" placeholder="Confirm Password" type="password" width='full'
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                            <RectangleButton title="Change Password" forForm heroIcon={<ArrowPathIcon />} colour="bg-button-green" />
                        </form>
                    </>}

                    <Divider />

                    <p className="pb-2">Suddenly remember your password?</p>

                    <RectangleButton title="Back to Login" onClick={() => navigate('../login')} heroIcon={<ArrowLeftOnRectangleIcon />} colour="bg-button-blue" />
                </div>
            </section>
        </div>
    );
}
