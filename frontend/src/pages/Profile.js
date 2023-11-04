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

    // Editability/Popup Variables
    const [isAccountActive, setIsAccountActive] = useState(false);
    const [isPaymentActive, setIsPaymentActive] = useState(false);
    const [displayPasswordPopup, setDisplayPasswordPopup] = useState(false);

    // Account Settings Variables
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [nameErr, setNameErr] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [accountUpdateEffectFlag, setAccountUpdateEffectFlag] = useState(null);
    const [accountUpdateAPIResponse, setAccountUpdateAPIResponse] = useState('');
    // ~ Memory of old Account Settings for reverting during errors
    const [stasisName, setStasisName] = useState(user.name);
    const [stasisEmail, setStasisEmail] = useState(user.email);

    // Change Password Variables
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [currentPasswordErr, setCurrentPasswordErr] = useState('');
    const [newPasswordErr, setNewPasswordErr] = useState('');
    const [confirmNewPasswordErr, setConfirmNewPasswordErr] = useState('');
    const [changePasswordGeneralError, setChangePasswordGeneralError] = useState('');
    const [passwordUpdateEffectFlag, setPasswordUpdateEffectFlag] = useState(null);
    const [passwordUpdateAPIResponse, setPasswordUpdateAPIResponse] = useState('');
    const [passwordScore, setPasswordScore] = useState(0);

    // Payment Settings Variables
    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [currentExpiryMonth, setCurrentExpiryMonth] = useState('');
    const [currentExpiryYear, setCurrentExpiryYear] = useState('');
    const [expiryMonthYear, setExpiryMonthYear] = useState('');
    const [paymentUpdateGeneralError, setPaymentUpdateGeneralError] = useState('');
    const [paymentUpdateEffectFlag, setPaymentUpdateEffectFlag] = useState(null);
    const [paymentUpdateAPIResponse, setPaymentUpdateAPIResponse] = useState('');
    // ~ Memory of old Payment Settings for reverting during errors
    const [stasisCreditCardNumber, setStasisCreditCardNumber] = useState('');
    const [stasisCurrentExpiryMonth, setStasisCurrentExpiryMonth] = useState('');
    const [stasisCurrentExpiryYear, setStasisCurrentExpiryYear] = useState('');

    const ERR_EMAIL_INVALID = "Invalid email";
    const ERR_PASSWORD_WEAK = "Password is not strong enough";
    const ERR_PASSWORD_MISMATCH = "Passwords do not match";

    // Hook that fires on page launch to load payment information
    useEffect(() => {
        async function fetchPaymentInfo() {
            const response = await accountPaymentInfoPOST();

            // No CC details associated with this account
            if (response.status === 204)
                return;

            const json = await response.json();

            if (response.ok) {
                setCreditCardNumber(json.cardNumber);
                setCurrentExpiryMonth(json.expirationDate.split("/")[0]);
                setCurrentExpiryYear(json.expirationDate.split("/")[1]);

                setStasisCreditCardNumber(json.cardNumber);
                setStasisCurrentExpiryMonth(json.expirationDate.split("/")[0]);
                setStasisCurrentExpiryYear(json.expirationDate.split("/")[1]);
            } else {
                toast.error(response.error);
            }
        }

        fetchPaymentInfo();
    }, []);

    function isDateAtLeastOneMonthInFuture(inputDate) {
        const [inputMonth, inputYear] = inputDate.split('/');
        const inputDateObject = new Date(`20${inputYear}`, inputMonth - 1);

        const currentDate = new Date();

        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

        return inputDateObject >= currentDate || inputDateObject >= oneMonthFromNow;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    // Handler which activates when user submits new account details
    async function handleEditProfile() {
        if (user.name === name && user.email === email)
            return;

        setNameErr('');
        setEmailErr('');

        let hasFailures = false;

        if (!name) {
            setNameErr("Name field cannot be blank!");
            hasFailures = true;
        }
        if (!validator.isEmail(email)) {
            setEmailErr(ERR_EMAIL_INVALID);
            hasFailures = true;
        }
        if (!email) {
            setEmailErr("Email field cannot be blank!");
            hasFailures = true;
        }

        if (hasFailures) {
            setName(stasisName);
            setEmail(stasisEmail);

            setAccountUpdateEffectFlag(false);
            return;
        }

        const response = await accountUpdate({ name: name, email: email });

        if (response.ok) {
            const newUser = { ...user };
            newUser.name = name;
            newUser.email = email;
            setStasisName(name);
            setStasisEmail(email);
            localStorage.setItem('user', JSON.stringify(newUser));

            setAccountUpdateAPIResponse("Account Details successfully updated!");
            setAccountUpdateEffectFlag(true);
        } else {
            setName(stasisName);
            setEmail(stasisEmail);

            setAccountUpdateEffectFlag(false);
        }
    }
    // Toasts must be toasted not at the same time as a component update
    // useEffect waits for render completion before effecting
    // Hook for rendering toasts relating to account settings
    useEffect(() => {
        if (accountUpdateEffectFlag === false) {
            if (nameErr) toast.error(nameErr);
            if (emailErr) toast.error(emailErr);

            if (accountUpdateAPIResponse) toast.error(accountUpdateAPIResponse);

            // Reset the update trigger
            setAccountUpdateEffectFlag(null);
        }
        else if (accountUpdateEffectFlag === true) {
            toast.success(accountUpdateAPIResponse);

            // Reset the update trigger
            setAccountUpdateEffectFlag(null);
        }
    }, [accountUpdateEffectFlag]);

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    // Handler which activates when user submits new password details
    async function handlePasswordChange(e) {
        e.preventDefault();

        setCurrentPasswordErr('');
        setNewPasswordErr('');
        setConfirmNewPasswordErr('');
        setChangePasswordGeneralError('');

        let hasFailures = false;

        if (!currentPassword) {
            setCurrentPasswordErr("Current password is blank!");
            hasFailures = true;
        }
        if (!newPassword) {
            setNewPasswordErr("New password is blank!");
            hasFailures = true;
        }
        if (!confirmNewPassword) {
            setConfirmNewPasswordErr("Confirm new password is blank!");
            hasFailures = true;
        }
        if (confirmNewPassword !== newPassword) {
            setConfirmNewPasswordErr(ERR_PASSWORD_MISMATCH);
            hasFailures = true;
        }
        if (passwordScore < 2) {
            setNewPasswordErr(ERR_PASSWORD_WEAK);
            hasFailures = true;
        }

        if (hasFailures) {
            setPasswordUpdateEffectFlag(false);
            return;
        }

        const response = await accountUpdatePassword({ oldPassword: currentPassword, newPassword });
        const json = await response.json();

        if (response.ok) {
            setPasswordUpdateAPIResponse("Password successfully updated!");
            setPasswordUpdateEffectFlag(true);

            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } else {
            setChangePasswordGeneralError(json.error);
            setPasswordUpdateAPIResponse(json.error);
            setPasswordUpdateEffectFlag(false);
        }
    }
    // Hook for rendering toasts relating to password change
    useEffect(() => {
        if (passwordUpdateEffectFlag === false) {
            if (currentPasswordErr) toast.error(currentPasswordErr);
            if (newPasswordErr) toast.error(newPasswordErr);
            if (confirmNewPasswordErr) toast.error(confirmNewPasswordErr);

            if (passwordUpdateAPIResponse) toast.error(passwordUpdateAPIResponse);

            // Reset the update trigger
            setPasswordUpdateEffectFlag(null);
        }
        else if (passwordUpdateEffectFlag === true) {
            toast.success(passwordUpdateAPIResponse);

            // Reset the update trigger
            setPasswordUpdateEffectFlag(null);
        }
    }, [passwordUpdateEffectFlag]);

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    // Handler which activates when user submits new payment details
    async function handleEditPayment() {
        if (creditCardNumber === stasisCreditCardNumber && currentExpiryMonth === stasisCurrentExpiryMonth && currentExpiryYear === stasisCurrentExpiryYear)
            return;

        let hasFailures = false;

        setPaymentUpdateGeneralError('');
        setPaymentUpdateAPIResponse('');
        let errorString = '';

        const sanitisedCardNumber = validator.escape(validator.trim(creditCardNumber));

        if (!creditCardNumber) {
            errorString = "Credit Card Number is blank!";
            hasFailures = true;
        }
        if (!currentExpiryMonth) {
            errorString = errorString.concat(" ", "Expiry Month is blank!");
            hasFailures = true;
        }
        if (!currentExpiryYear) {
            errorString = errorString.concat(" ", "Expiry Year is blank!");
            hasFailures = true;
        }
        if (!validator.isCreditCard(sanitisedCardNumber)) {
            errorString = errorString.concat(" ", "This is not a valid card number!");
            hasFailures = true;
        }
        if (expiryMonthYear.length > 5) {
            errorString = errorString.concat(" ", "Invalid year!");
            hasFailures = true;
        }
        const isExpiryValid = isDateAtLeastOneMonthInFuture(expiryMonthYear);
        if (!isExpiryValid) {
            errorString = errorString.concat(" ", "Your credit card is expired!");
            hasFailures = true;
        }

        if (hasFailures) {
            setPaymentUpdateGeneralError(errorString);

            setCreditCardNumber(stasisCreditCardNumber);
            setCurrentExpiryMonth(stasisCurrentExpiryMonth);
            setCurrentExpiryYear(stasisCurrentExpiryYear);

            setPaymentUpdateEffectFlag(false);
            return;
        }

        const response = await accountPaymentInfoPUT({ cardNumber: creditCardNumber, expirationDate: expiryMonthYear });
        const json = await response.json();

        if (response.ok) {
            setStasisCreditCardNumber(creditCardNumber);
            setStasisCurrentExpiryMonth(currentExpiryMonth);
            setStasisCurrentExpiryYear(currentExpiryYear);

            setPaymentUpdateAPIResponse("Payment Details successfully updated!");
            setPaymentUpdateEffectFlag(true);
        } else {
            setCreditCardNumber(stasisCreditCardNumber);
            setCurrentExpiryMonth(stasisCurrentExpiryMonth);
            setCurrentExpiryYear(stasisCurrentExpiryYear);

            setPaymentUpdateGeneralError(json.error);
            setPaymentUpdateAPIResponse(json.error);
            setPaymentUpdateEffectFlag(false);
        }
    }
    // Hook for rendering toasts relating to payment update
    useEffect(() => {
        if (paymentUpdateEffectFlag === false) {
            if (paymentUpdateGeneralError) toast.error(paymentUpdateGeneralError);

            if (paymentUpdateAPIResponse) toast.error(paymentUpdateAPIResponse);

            // Reset the update trigger
            setPaymentUpdateEffectFlag(null);
        }
        else if (paymentUpdateEffectFlag === true) {
            toast.success(paymentUpdateAPIResponse);

            // Reset the update trigger
            setPaymentUpdateEffectFlag(null);
        }
    }, [paymentUpdateEffectFlag]);
    ////////////////////////////////////////////////////////////////////////////////////////////////////

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
                <InputField title="Name" placeholder="Enter Name" type="text" width="2/3" additionalProps={{ required: 'required' }}
                    active={isAccountActive} value={name} errorMsg={nameErr}
                    onChange={(e) => setName(e.target.value)} />
                <InputField title="Email Address" placeholder="Enter Email" type="email" width="2/3" additionalProps={{ required: 'required' }}
                    active={isAccountActive} value={email} errorMsg={emailErr}
                    onChange={(e) => setEmail(e.target.value)} />

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
                    active={isPaymentActive} value={creditCardNumber} onChange={(e) => setCreditCardNumber(e.target.value)} />

                <InputMonthYear title="Expiry" width="1/3" setFormattedValue={setExpiryMonthYear} active={isPaymentActive}
                    month={currentExpiryMonth} setMonth={setCurrentExpiryMonth}
                    year={currentExpiryYear} setYear={setCurrentExpiryYear} />

                <label id="error-change-password" className="text-text-warn">
                    {paymentUpdateGeneralError ?? ''}
                </label>
            </div>

            <Popup title="Change Password"
                variableThatDeterminesIfPopupIsActive={displayPasswordPopup}
                setVariableThatDeterminesIfPopupIsActive={setDisplayPasswordPopup}
                onSubmit={handlePasswordChange}
            >
                <InputField title="Current Password" placeholder="Enter Current Password" type="password" width='full' additionalProps={{ required: 'required' }}
                    value={currentPassword} errorMsg={currentPasswordErr} onChange={(e) => setCurrentPassword(e.target.value)} />

                <InputField title="New Password" placeholder="Enter New Password" type="password" width='full' additionalProps={{ required: 'required' }}
                    value={newPassword} errorMsg={newPasswordErr} onChange={(e) => setNewPassword(e.target.value)} />

                <CustomPasswordStrengthBar title="Update Password" password={newPassword} passwordScore={passwordScore} setPasswordScore={setPasswordScore} />

                <InputField title="Confirm New Password" placeholder="Confirm New Password" type="password" width='full' additionalProps={{ required: 'required' }}
                    value={confirmNewPassword} errorMsg={confirmNewPasswordErr} onChange={(e) => setConfirmNewPassword(e.target.value)} />

                <label id="error-change-password" className="text-text-warn">
                    {changePasswordGeneralError ?? ''}
                </label>
            </Popup>
        </Layout>
    );
};
