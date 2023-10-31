// React / Packages
import React, { useState, useEffect } from "react";

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import Popup from '../components/Popup';
import { InputField, InputHeader, InputMonthYear } from '../components/Inputs';
import { RectangleButton } from '../components/Buttons';
import CustomPasswordStrengthBar from '../components/CustomPasswordStrengthBar';

// Assets
import { UserCircleIcon, CreditCardIcon, KeyIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/post-banner.png";

// API
import { useAuthContext } from "../hooks/useAuthContext";
import { accountUpdate } from "../apis/exportedAPIs";

export default function Profile() {
    const { user } = useAuthContext();

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [paymentInfo, setPaymentInfo] = useState('1111 2222 3333 4444');
    const [expiryMonthYear, setExpiryMonthYear] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordScore, setPasswordScore] = useState(0);
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [changePasswordError, setChangePasswordError] = useState(null);

    const [isAccountActive, setIsAccountActive] = useState(false);
    const [isPaymentActive, setIsPaymentActive] = useState(false);
    const [displayPasswordPopup, setDisplayPasswordPopup] = useState(false);

    async function handleEditProfile() {
        console.log("handle profile!");
    }

    async function handleEditPayment() {
        console.log("handle pay!");

        console.log(expiryMonthYear);
    }

    async function handlePasswordChange(e) {
        e.preventDefault();

        console.log("handle password!");
    }

    useEffect(() => {
        async function fetchData() {
            const patchProfile = await accountUpdate({
                name: name,
                email: email,
            });
            const fishtwo = await patchProfile.json();
            setName(user.name)
            setEmail(user.email)
            console.log(fishtwo)
          }

          fetchData();
    }, [name, email]);

    return (
        <Layout>
            <section className="grid">
                <Banner image={BannerImage} title="Profile" />
            </section>

            <div className="flex flex-col p-4 gap-2">
                <InputHeader title="Account Settings" heroIcon={<UserCircleIcon />} edit active={isAccountActive}
                    onClick={() => {
                        setIsAccountActive((currentIsAccountActive) => {
                            const newIsAccountActive = !currentIsAccountActive;
                            if (!newIsAccountActive) { handleEditProfile(); }
                            return newIsAccountActive;
                        });
                    }} />
                <InputField title="Name" placeholder="Enter Name" type="text" width="2/3"
                    active={isAccountActive} value={name} onChange={(e) => setName(e.target.value)} />
                <InputField title="Email Address" placeholder="Enter Email" type="email" width="2/3"
                    active={isAccountActive} value={email} onChange={(e) => setEmail(e.target.value)} />

                <InputHeader title="Change Password" heroIcon={<KeyIcon />} />
                <div className="self-start">
                    <RectangleButton title="Begin" heroIcon={<ArrowPathIcon />}
                        onClick={() => { setDisplayPasswordPopup(!displayPasswordPopup) }} />
                </div>

                <div className="py-2"></div>

                <InputHeader title="Payment Settings" heroIcon={<CreditCardIcon />} edit active={isPaymentActive}
                    onClick={() => {
                        setIsPaymentActive((currentIsPaymentActive) => {
                            const newIsPaymentActive = !currentIsPaymentActive;
                            if (!newIsPaymentActive) { handleEditPayment(); }
                            return newIsPaymentActive;
                        });
                    }} />
                <InputField title="Credit Card Number" placeholder="Enter Credit Card Number" type="tel" width="1/3"
                    active={isPaymentActive} value={paymentInfo} onChange={(e) => setPaymentInfo(e.target.value)} />

                <InputMonthYear title="Expiry" width="1/3" setFormattedValue={setExpiryMonthYear} active={isPaymentActive} />
            </div>

            <Popup title="Change Password"
                variableThatDeterminesIfPopupIsActive={displayPasswordPopup}
                setVariableThatDeterminesIfPopupIsActive={setDisplayPasswordPopup}
                onSubmit={handlePasswordChange}
            >
                <InputField title="Current Password" placeholder="Enter Current Password" type="password" width='full'
                    value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />

                <InputField title="New Password" placeholder="Enter New Password" type="password" width='full'
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                <CustomPasswordStrengthBar title="Update Password" password={newPassword} passwordScore={passwordScore} setPasswordScore={setPasswordScore} />

                <InputField title="Confirm New Password" placeholder="Confirm New Password" type="password" width='full'
                    value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />

                <label id="error-change-password" className="text-text-warn">
                    {changePasswordError ?? ''}
                </label>
            </Popup>
        </Layout>
    );
};
