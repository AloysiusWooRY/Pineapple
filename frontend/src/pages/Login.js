import React from "react";
import toast from 'react-hot-toast';
import { useState, useEffect } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/logo-no-background.png";

import { InputField } from "../components/Inputs";
import { RectangleButton } from "../components/Buttons";

import { KeyIcon, QuestionMarkCircleIcon, PencilIcon } from "@heroicons/react/24/solid";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, error, isLoading } = useLogin();
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        await login(email, password);
    };
    // 'error' is a useState, so it's not guaranteed that it is updated by the time handleFormSubmit is complete.
    useEffect(() => {
        if (error) toast.error(error);            
    }, [error]);

    const handleRecoverPass = () => {
        navigate('../forgot-password');
        // window.location.href = "/forgot-password";
    };

    const handleRegister = () => {
        navigate('../register');
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
                    className="flex flex-col w-2/3 max-w-md p-10 mx-auto mt-5 bg-[#] border-[#FFFF00] border-0 rounded-lg"
                    onSubmit={handleFormSubmit}
                >
                    <p className="font-bold text-center text-2xl text-[#FFFF00]">Welcome Back!</p>

                    <div className="py-4"></div>

                    <InputField title="Email Address" placeholder="Enter Email Address" type="email" width="full" additionalProps={{ required: 'required' }}
                        value={email} onChange={(e) => setEmail(e.target.value)} />

                    <InputField title="Password" placeholder="Enter Password" type="password" width="full" additionalProps={{ required: 'required' }}
                        value={password} onChange={(e) => setPassword(e.target.value)} />

                    <div>
                        <RectangleButton title="Log In" forForm heroIcon={<KeyIcon />} colour="bg-green-800" />
                    </div>

                    <div className="py-4"></div>
                    <div className="border-b border-gray-700"></div>
                    <div className="py-4"></div>

                    <div>
                        <RectangleButton title="Forgot Password" onClick={handleRecoverPass} heroIcon={<QuestionMarkCircleIcon />} colour="bg-red-600" />
                    </div>
                    <div className="py-2"></div>
                    <div>
                        <RectangleButton title="Register" onClick={handleRegister} heroIcon={<PencilIcon />} colour="bg-blue-500" />
                    </div>
                </form>
            </section>
        </div>
    );
}
