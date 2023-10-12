import React, { useState, useEffect, useCallback } from 'react';

import { useAuthContext } from "../hooks/useAuthContext";
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";

import BannerImage from "../assets/post-banner.png";

import { PencilIcon, UserCircleIcon, CreditCardIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";

const Profile = () => {
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

            <div className="flex flex-col p-4 gap-2">
                <div className="flex items-end justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
                    <h3 className="flex w-fit text-white text-3xl">
                        <UserCircleIcon className="h-8 w-8 mr-2" />
                        Account Settings
                    </h3>
                    <button type="button" className={`flex w-fit text-white px-4 py-2 rounded ${!isAccountActive ? 'bg-neutral-800' : 'bg-green-800'} items-center`}
                        onClick={() => {
                            setIsAccountActive((currentIsAccountActive) => {
                                const newIsAccountActive = !currentIsAccountActive;
                                if (!newIsAccountActive) { handleEditProfile(); }
                                return newIsAccountActive;
                            });
                        }}>
                        {!isAccountActive ? <><PencilIcon className="h-4 w-4 mr-2" />Edit</> : <><PaperAirplaneIcon className="h-4 w-4 mr-2" />Submit</>}
                    </button>
                </div>

                <label for="name" className="text-white">Name</label>
                <input
                    id="name"
                    type="text"
                    placeholder="Enter Name . . ."
                    disabled={!isAccountActive ? true : false}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${!isAccountActive ? 'border-l cursor-not-allowed' : 'border rounded-sm'} border-gray-500 p-2 text-gray-400 bg-black w-1/3 placeholder:text-theme-placeholder`}
                />

                <label for="email" className="text-white">Email Address</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Enter Email . . ."
                    disabled={!isAccountActive ? true : false}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${!isAccountActive ? 'border-l cursor-not-allowed' : 'border rounded-sm'} border-gray-500 p-2 text-gray-400 bg-black w-1/3 placeholder:text-theme-placeholder`}
                />

                <label for="password" className="text-white">Change Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="New password must be at least 8 characters long."
                    disabled={!isAccountActive ? true : false}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${!isAccountActive ? 'border-l cursor-not-allowed' : 'border rounded-sm'} border-gray-500 p-2 text-gray-400 bg-black w-1/3 placeholder:text-theme-placeholder`}
                />

                <div className="pt-8 flex flex-grow items-end justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
                    <h3 className="flex w-fit text-white text-3xl">
                        <CreditCardIcon className="h-8 w-8 mr-2" />
                        Payment Settings
                    </h3>
                    <button type="button" className={`flex w-fit text-white px-4 py-2 rounded ${!isPaymentActive ? 'bg-neutral-800' : 'bg-green-800'} items-center`}
                        onClick={() => {
                            setIsPaymentActive((currentIsPaymentActive) => {
                                const newIsPaymentActive = !currentIsPaymentActive;
                                if (!newIsPaymentActive) { handleEditPayment(); }
                                return newIsPaymentActive;
                            });
                        }}>
                        {!isPaymentActive ? <><PencilIcon className="h-4 w-4 mr-2" />Edit</> : <><PaperAirplaneIcon className="h-4 w-4 mr-2" />Submit</>}
                    </button>
                </div>

                <label for="payment-info" className="text-white">Payment Info</label>
                <input
                    id="payment-info"
                    type="tel"
                    placeholder="Enter Credit Card Information . . ."
                    disabled={!isPaymentActive ? true : false}
                    value={paymentInfo}
                    onChange={(e) => setPaymentInfo(e.target.value)}
                    className={`${!isPaymentActive ? 'border-l cursor-not-allowed' : 'border rounded-sm'} border-gray-500 p-2 text-gray-400 bg-black w-1/3 placeholder:text-theme-placeholder`}
                />
            </div>

        </Layout>
    )
}

export default Profile;