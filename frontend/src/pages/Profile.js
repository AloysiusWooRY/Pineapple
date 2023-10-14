import React, { useState, useEffect, useCallback } from 'react';

import { useAuthContext } from "../hooks/useAuthContext";
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import { InputField, InputHeader } from '../components/Inputs';
import { RectangleButton } from '../components/Buttons';

import BannerImage from "../assets/post-banner.png";

import { UserCircleIcon, CreditCardIcon, KeyIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

export default function Profile() {
    const { user } = useAuthContext();

    const [name, setName] = useState('Fish Ee');
    const [email, setEmail] = useState('fish@gmail.com');
    const [password, setPassword] = useState('');
    const [paymentInfo, setPaymentInfo] = useState('1111 2222 3333 4444');

    const [isAccountActive, setIsAccountActive] = useState(false);
    const [isPaymentActive, setIsPaymentActive] = useState(false);

    async function handleEditProfile() {
        console.log("handle profile!");
    }

    async function handleEditPayment() {
        console.log("handle pay!");
    }

    return (
        <Layout>
            <section className="grid">
                <Banner image={BannerImage} title="Profile" />
            </section>

            <div className="flex flex-col p-4 gap-2 ">
                <InputHeader title="Account Settings" heroIcon={<UserCircleIcon />} edit active={isAccountActive}
                    onClick={() => {
                        setIsAccountActive((currentIsAccountActive) => {
                            const newIsAccountActive = !currentIsAccountActive;
                            if (!newIsAccountActive) { handleEditProfile(); }
                            return newIsAccountActive;
                        });
                    }} />
                <InputField title="Name" placeholder="Enter Name . . ." type="text"
                    active={isAccountActive} value={name} onChange={(e) => setName(e.target.value)} />
                <InputField title="Email Address" placeholder="Enter Email . . ." type="email"
                    active={isAccountActive} value={email} onChange={(e) => setEmail(e.target.value)} />

                <InputHeader title="Change Password" heroIcon={<KeyIcon />} />
                <RectangleButton title="Begin" heroIcon={<ArrowPathIcon />} onClick={(e) => { console.log("password!") }} />

                <div className="py-2"></div>

                <InputHeader title="Payment Settings" heroIcon={<CreditCardIcon />} edit active={isPaymentActive}
                    onClick={() => {
                        setIsPaymentActive((currentIsPaymentActive) => {
                            const newIsPaymentActive = !currentIsPaymentActive;
                            if (!newIsPaymentActive) { handleEditPayment(); }
                            return newIsPaymentActive;
                        });
                    }} />
                <InputField title="Payment Info" placeholder="Enter Credit Card Information . . ." type="tel"
                    active={isPaymentActive} value={paymentInfo} onChange={(e) => setPaymentInfo(e.target.value)} />
            </div>
        </Layout>
    );
};
