// React / Packages
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import cookie from 'react-cookies';

// Components
import { InputField } from "../components/Inputs";
import { RectangleButton } from "../components/Buttons";
import { Divider } from "../components/Miscellaneous";

// Assets
import { PaperAirplaneIcon, KeyIcon, PencilIcon } from "@heroicons/react/24/solid";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Logo from "../assets/logo-no-background.png";

// API
import { useLogin } from "../hooks/useLogin";

export default function Login() {
    const [stage, setStage] = useState(1);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authenticatorCode, setAuthenticatorCode] = useState('');

    const { login, error, isLoading } = useLogin();
    const navigate = useNavigate();

    const handleStageOne = async (e) => {
        e.preventDefault();

        await login(email, password);
    };
    // 'error' is a useState, so it's not guaranteed that it is updated by the time handleStageOne is complete.
    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const handleStageTwo = async (e) => {
        e.preventDefault();

    };

    const handleRecoverPass = () => {
        navigate('../forgot-password');
    };

    const handleRegister = () => {
        navigate('../register');
    }

    const getCSRF = () => {
        const csrf = cookie.load('csrf')
        if (!csrf) {
            fetch('/api/get-csrf-token')
            .catch(error => {
                console.error('Failed to fetch CSRF token', error);
            });
            return cookie.load('csrf')
        }
        return csrf
    }

    return (
        <div
            id="login"
            className="flex items-center justify-between min-h-screen bg-background-minor"
        >
            {stage === 1 && <>
                <section className="flex flex-col items-center justify-center w-full p-5">
                    <img src={Logo} alt="logo" className="h-44" />

                    <form
                        className="flex flex-col w-2/3 max-w-md p-10 mx-auto mt-5 text-text-primary"
                        onSubmit={handleStageOne}
                    >
                        <p className="font-bold text-center text-2xl text-text-yellow-pineapple pb-8">Welcome Back!</p>

                        <InputField title="Email Address" placeholder="Enter Email Address" type="email" additionalProps={{ required: 'required' }}
                            value={email} onChange={(e) => setEmail(e.target.value)} />

                        <InputField title="Password" placeholder="Enter Password" type="password" additionalProps={{ required: 'required' }}
                            value={password} onChange={(e) => setPassword(e.target.value)} />

                        <RectangleButton title="Log In" forForm heroIcon={<KeyIcon />} colour="bg-button-green" />

                        <Divider />

                        <RectangleButton title="Forgot Password" onClick={handleRecoverPass} heroIcon={<QuestionMarkCircleIcon />} colour="bg-button-red" />

                        <div className="py-2"></div>

                        <RectangleButton title="Register" onClick={handleRegister} heroIcon={<PencilIcon />} colour="bg-button-blue" />
                    </form>
                </section>
            </>}

            {stage === 2 && <>
                <section className="flex flex-col items-center justify-center w-full p-5">
                    <img src={Logo} alt="logo" className="h-44" />

                    <form
                        className="flex flex-col w-2/3 max-w-md p-10 mx-auto mt-5 text-text-primary"
                        onSubmit={handleStageTwo}
                    >
                        <p className="font-bold text-center text-2xl text-text-yellow-pineapple pb-8">Mobile Authentication</p>

                        <p className="pt-4">A code has been dispatched to your authenticator! Enter the 6-digit code here:</p>

                        <Divider padding={4} />

                        <InputField title="Recovery Code" placeholder="Enter Recovery Code" type="text" additionalProps={{ pattern: '[0-9]{6}', required: 'required' }}
                            value={authenticatorCode} onChange={(e) => setAuthenticatorCode(e.target.value)} />

                        <RectangleButton title="Submit Authenticator Code" forForm heroIcon={<PaperAirplaneIcon />} colour="bg-button-green" />
                    </form>
                </section>
            </>}
        </div>
    );
}
