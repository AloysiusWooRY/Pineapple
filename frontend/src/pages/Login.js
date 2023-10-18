// React / Packages
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

// Components
import { InputField } from "../components/Inputs";
import { RectangleButton } from "../components/Buttons";
import { Divider } from "../components/Miscellaneous";

// Assets
import { KeyIcon, PencilIcon } from "@heroicons/react/24/solid";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Logo from "../assets/logo-no-background.png";

// API
import { useLogin } from "../hooks/useLogin";

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
    };

    const handleRegister = () => {
        navigate('../register');
    }

    return (
        <div
            id="login"
            className="flex items-center justify-between min-h-screen bg-background-minor"
        >
            <section className="flex flex-col items-center justify-center w-full p-5">
                <img src={Logo} alt="logo" className="h-44" />

                <form
                    className="flex flex-col w-2/3 max-w-md p-10 mx-auto mt-5 text-text-primary"
                    onSubmit={handleFormSubmit}
                >
                    <p className="font-bold text-center text-2xl text-text-yellow-pineapple pb-8">Welcome Back!</p>

                    <InputField title="Email Address" placeholder="Enter Email Address" type="email" additionalProps={{ required: 'required' }}
                        value={email} onChange={(e) => setEmail(e.target.value)} />

                    <InputField title="Password" placeholder="Enter Password" type="password"  additionalProps={{ required: 'required' }}
                        value={password} onChange={(e) => setPassword(e.target.value)} />

                    <RectangleButton title="Log In" forForm heroIcon={<KeyIcon />} colour="bg-button-green" />

                    <Divider />

                    <RectangleButton title="Forgot Password" onClick={handleRecoverPass} heroIcon={<QuestionMarkCircleIcon />} colour="bg-button-red" />

                    <div className="py-2"></div>

                    <RectangleButton title="Register" onClick={handleRegister} heroIcon={<PencilIcon />} colour="bg-button-blue" />
                </form>
            </section>
        </div>
    );
}
