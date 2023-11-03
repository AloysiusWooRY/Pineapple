// React / Packages
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import validator from "validator";

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
import { accountUpdate, accountPaymentInfoPUT, accountPaymentInfoPOST, accountUpdatePassword } from "../apis/exportedAPIs";

export default function Profile() {
    const { user } = useAuthContext();

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [paymentInfo, setPaymentInfo] = useState('None');
    const [expiryMonthYear, setExpiryMonthYear] = useState('');
    const [paymentUpdated, setPaymentUpdated] = useState(true);
    const [currentExpiryMonth, setCurentExpiryMonth] = useState('');
    const [currentExpiryYear, setCurrentExpiryYear] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordScore, setPasswordScore] = useState(0);
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [changePasswordError, setChangePasswordError] = useState(null);

    const [isAccountActive, setIsAccountActive] = useState(false);
    const [isPaymentActive, setIsPaymentActive] = useState(false);
    const [displayPasswordPopup, setDisplayPasswordPopup] = useState(false);

    const [emailErr, setEmailErr] = useState(null);
    const [confirmNewPasswordErr, setConfirmNewPasswordErr] = useState(null);
    const [newPasswordErr, setNewPasswordErr] = useState(null);

    const ERR_EMAIL_INVALID = "Invalid email";
    const ERR_PASSWORD_WEAK = "Password is not strong enough";
    const ERR_PASSWORD_MISMATCH = "Passwords do not match";

    useEffect(() => {
        async function fetchData() {
            if (paymentUpdated) {
                const response = await accountPaymentInfoPOST();

                if (response.status === 204) {
                    return;
                }

                const json = await response.json();
                if (response.ok) {
                    setPaymentInfo(json.cardNumber);
                    setCurentExpiryMonth(json.expirationDate.split("/")[0]);
                    setCurrentExpiryYear(json.expirationDate.split("/")[1]);
                    setPaymentUpdated(false);
                } else {
                    toast.error(response.error);
                }
            }
        }
        fetchData();
    }, [paymentUpdated]);

    function isDateAtLeastOneMonthInFuture(inputDate) {
        const [inputMonth, inputYear] = inputDate.split('/');
        const inputDateObject = new Date(`20${inputYear}`, inputMonth - 1);

        const currentDate = new Date();

        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
      
        return inputDateObject >= currentDate || inputDateObject >= oneMonthFromNow;
      }

    async function handleEditProfile() {

        if (user.name === name && user.email === email) return;

        if (!validator.isEmail(email)) {
            toast.error(ERR_EMAIL_INVALID);
            return setEmailErr(ERR_EMAIL_INVALID);
        }
        if (!email) {
            toast.error("Please do not leave the email blank!");
            return false;
        }

        if (!name) {
            toast.error("Please do not leave the name blank!");
            return false;
        }

        const response = await accountUpdate({
            name,
            email,
        });

        if(response.ok) {
            const newUser = {...user};
            newUser.name = name;
            newUser.email = email;
            localStorage.setItem('user', JSON.stringify(newUser));
            toast.success("Account information successfully changed!");
        } else {
            toast.error(response.error);
        }
    }

    async function handleEditPayment() {
        const sanitisedCardNumber = validator.escape(validator.trim(paymentInfo));
        if(!validator.isCreditCard(sanitisedCardNumber)) {
            toast.error("This is not a valid card number!");
            return;
        }

        if (expiryMonthYear.length > 5) {
            toast.error("Invalid year!");
            return;
        }
        
        const isExpiryValid = isDateAtLeastOneMonthInFuture(expiryMonthYear);
        if (!isExpiryValid) {
            toast.error("Your credit card is expired!");
            return;
        }
        
        const response = await accountPaymentInfoPUT({
            cardNumber: paymentInfo,
            expirationDate: expiryMonthYear,
        });

        if(response.ok) {
            setPaymentUpdated(true);
        } else {
            toast.error(response.error);
        }
    }

    async function handlePasswordChange(e) {
        e.preventDefault();

        setConfirmNewPasswordErr('');
        setNewPasswordErr('');

        if (!currentPassword) {
            toast.error("Current password is blank!");
            return;
        }
        if (!newPassword) {
            toast.error("New password is blank!");
            return;
        }
        if (!confirmNewPassword) {
            toast.error("Confirm new password is blank!");
            return;
        }

        if (confirmNewPassword !== newPassword) {
            toast.error(ERR_PASSWORD_MISMATCH);
            return setConfirmNewPasswordErr(ERR_PASSWORD_MISMATCH);
        }

        if (passwordScore < 2) {
            toast.error(ERR_PASSWORD_WEAK);
            return setNewPasswordErr(ERR_PASSWORD_WEAK);
        }

        const response = await accountUpdatePassword({
            oldPassword: currentPassword,
            newPassword
        });
        const json = await response.json();

        if(response.ok) {
            setDisplayPasswordPopup(false);
            toast.success("Password Successfully Changed!");
        } else {
            toast.error(json.error);
        }

        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    }

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
                <InputField title="Email Address" placeholder="Enter Email" type="email" additionalProps={{ required: 'required' }} width="2/3"
                    active={isAccountActive} errorMsg={emailErr} value={email} onChange={(e) => setEmail(e.target.value)} />

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
                    active={isPaymentActive} value={paymentInfo ? paymentInfo: "None"} onChange={(e) => setPaymentInfo(e.target.value)} />

                <InputMonthYear title="Expiry" width="1/3" setFormattedValue={setExpiryMonthYear} active={isPaymentActive} currentMonth={currentExpiryMonth} currentYear={currentExpiryYear} />
            </div>

            <Popup title="Change Password"
                variableThatDeterminesIfPopupIsActive={displayPasswordPopup}
                setVariableThatDeterminesIfPopupIsActive={setDisplayPasswordPopup}
                onSubmit={handlePasswordChange}
            >
                <InputField title="Current Password" placeholder="Enter Current Password" type="password" width='full'
                    value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />

                <InputField title="New Password" placeholder="Enter New Password" type="password" width='full'
                    value={newPassword} errorMsg={newPasswordErr} onChange={(e) => setNewPassword(e.target.value)} />

                <CustomPasswordStrengthBar title="Update Password" password={newPassword} passwordScore={passwordScore} setPasswordScore={setPasswordScore} />

                <InputField title="Confirm New Password" placeholder="Confirm New Password" type="password" width='full'
                    value={confirmNewPassword} errorMsg={confirmNewPasswordErr} onChange={(e) => setConfirmNewPassword(e.target.value)} />

                <label id="error-change-password" className="text-text-warn">
                    {changePasswordError ?? ''}
                </label>
            </Popup>
        </Layout>
    );
};
