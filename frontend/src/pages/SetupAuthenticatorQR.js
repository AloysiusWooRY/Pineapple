// React / Packages
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

// Components
import { RectangleButton } from "../components/Buttons";
import { InputField } from "../components/Inputs";
import { Divider } from "../components/Miscellaneous";

// Assets
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Logo from "../assets/logo-no-background.png";

// API
import { useAuthContext } from "../hooks/useAuthContext";
import { accountLoginOTP, accountVerifyOTP } from "../apis/exportedAPIs";

export default function SetupAuthenticatorQR() {
    const navigate = useNavigate();
    const { dispatch } = useAuthContext();
    const { state } = useLocation();

    const [qrImageBase64, setQrImageBase64] = useState('');
    const [authenticatorCode, setAuthenticatorCode] = useState('');

    useEffect(() => {
        if (state === null) {
            navigate("/");
        } else {
            setQrImageBase64(state.qrImageBase64);
        }
    }, []);

    const handleVerify = async (e) => {
        e.preventDefault();

        let response = await accountVerifyOTP({ token: authenticatorCode });

        const json = await response.json();
        if (!response.ok) {
            toast.error(json.error);
            return;
        }

        response = await accountLoginOTP({ token: authenticatorCode });
        if (response.ok) {
            // Save the user to local storage
            localStorage.setItem("user", JSON.stringify(json));

            // Update the auth context
            dispatch({ type: "LOGIN", payload: json });
        } else {
            toast.error(json.error);
        }
    };

    return (
        <div
            id="login"
            className="flex items-center justify-between min-h-screen bg-background-minor"
        >
            <section className="flex flex-col items-center justify-center w-full p-5">
                <img src={Logo} alt="logo" className="h-44" />

                <form
                    className="flex flex-col w-2/3 max-w-md p-10 mx-auto mt-5 text-text-primary"
                    onSubmit={handleVerify}
                >
                    <p className="font-bold text-center text-2xl text-text-yellow-pineapple pb-8">Setup Mobile Authenticator</p>

                    <img id="authenticator-verify-qr-code" src={qrImageBase64} className="w-2/3 self-center"></img>

                    <p className="pt-4">Scan the above QR code in your mobile authenticator, then enter the 6-digit code here:</p>

                    <Divider padding={4} />

                    <InputField title="Authenticator Code" placeholder="Enter Authenticator Code" type="text" additionalProps={{ pattern: '[0-9]{6}', required: 'required' }}
                        value={authenticatorCode} onChange={(e) => setAuthenticatorCode(e.target.value)} />

                    <RectangleButton title="Submit Authenticator Code" forForm heroIcon={<PaperAirplaneIcon />} colour="bg-button-green" />
                </form>
            </section>

        </div>
    );
}
