import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import PasswordStrengthBar from 'react-password-strength-bar';
import validator from "validator";
import ReCAPTCHA from "react-google-recaptcha"

import { InputField } from "../components/Inputs";
import { RectangleButton } from "../components/Buttons";

import Logo from "../assets/logo-no-background.png";

import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordScore, setPasswordScore] = useState(0);
    const [confirmPassword, setConfirmPassword] = useState('');

    let ERR_MISSING_FIELDS = "Missing fields";
    let ERR_GENERIC = "Something went wrong, try again later!";
    let ERR_EMAIL_INVALID = "Invalid email";
    let ERR_EMAIL_DUPLICATE = "Email already exist";
    let ERR_PASSWORD_WEAK = "Password not strong";
    let ERR_PASSWORD_MISMATCH = "Passwords do not match";

    const [isLoading, setIsLoading] = useState(false);
    const [emailErr, setEmailErr] = useState(null);
    const [passwordErr, setPasswordErr] = useState(null);
    const [confirmPasswordErr, setConfirmPasswordErr] = useState(null);
    const [error, setError] = useState(null);

    const [recaptchaToken, setRecaptchaToken] = useState(null);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        clearAllErrorMsg();
        const toastId = toast.loading('Loading...');

        if (!validator.isEmail(email)) {
            toast.error(ERR_EMAIL_INVALID, { id: toastId });
            return setEmailErr(ERR_EMAIL_INVALID);
        }
        if (passwordScore < 2) {
            toast.error(ERR_PASSWORD_WEAK, { id: toastId });
            return setPasswordErr(ERR_PASSWORD_WEAK);
        }
        if (confirmPassword !== password) {
            toast.error(ERR_PASSWORD_MISMATCH, { id: toastId });
            return setConfirmPasswordErr(ERR_PASSWORD_MISMATCH);
        }

        try {
            setIsLoading(true);

            const response = await fetch(`/api/account/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name, email, password, recaptchaToken
                }),
            });
            const json = await response.json();

            if (response.ok) {
                toast.success("Success!", { id: toastId });
                navigate("..");
            } else {
                const errorMsg = json.error;
                toast.error(errorMsg, { id: toastId });
                if (json.error === "Missing fields") setError(errorMsg);
                if (json.error === "Invalid email") setEmailErr(errorMsg);
                if (json.error === "Email already exist") setEmailErr(errorMsg);
                if (json.error === "Password not strong") setPasswordErr(errorMsg);
            }
        } catch (error) {
            const errorMsg = ERR_GENERIC;
            toast.error(errorMsg, { id: toastId });
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const clearAllErrorMsg = () => {
        setError(null);
        setConfirmPasswordErr(null);
        setEmailErr(null);
        setPasswordErr(null);
    }

    return (
        <div
            id="login"
            className="flex items-center justify-between min-h-screen bg-[#161618]"
        >
            <section className="flex flex-col items-center justify-center w-full p-5">
                <div className="flex flex-col items-center justify-center text-center">
                    <img src={Logo} alt="logo" className="h-44" />
                </div>
                <form
                    className="flex flex-col w-2/3 max-w-md p-10 mx-auto mt-5 bg-[#] border-[#FFFF00] border-0 rounded-lg text-white"
                    onSubmit={handleFormSubmit}
                >
                    <p className="font-bold text-center text-2xl font-sans text-[#FFFF00]">Sign Up</p>

                    <div className="py-2"></div>

                    <InputField title="Email Address" errorMsg={emailErr} placeholder="Enter Email" type="email" width="full"
                        value={email} onChange={(e) => setEmail(e.target.value)} />

                    <InputField title="Name" placeholder="Enter Name" type="text" width="full"
                        value={name} onChange={(e) => setName(e.target.value)} />

                    <InputField title="Password" errorMsg={passwordErr} placeholder="Enter Password" type="password" width="full"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    <PasswordStrengthBar
                        password={password}
                        className="-mt-4"
                        onChangeScore={(passwordScore, feedback) => { setPasswordScore(passwordScore) }}
                        barColors={['#ddd', '#FF0000', '#FFA500', '#00FF00', '#0000FF']}
                        scoreWords={['Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong']}
                    />

                    <InputField title="Confirm Password" errorMsg={confirmPasswordErr} placeholder="Confirm Password" type="password" width='full'
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                    <ReCAPTCHA
                        sitekey="6LeQDqooAAAAAHzIRnk97IoeBTb_JBFtY07NtW9b"
                        onChange={(token) => setRecaptchaToken(token)}
                    />

                    <div className="flex flex-row flex-wrap justify-between">
                        <label className="self-center text-red-600 text-right">
                            {error ?? ''}
                        </label>
                        <div>
                            <RectangleButton title="Submit" forForm heroIcon={<PaperAirplaneIcon />} colour="bg-green-800" />
                        </div>
                    </div>
                </form>
            </section>
        </div >
    );
}
