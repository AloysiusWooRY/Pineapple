// React / Packages
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import ReCAPTCHA from "react-google-recaptcha";

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import { InputField, InputTextBox, InputFile } from "../components/Inputs";
import { RectangleButton, StandardDropdown } from "../components/Buttons";

// Assets
import { PaperAirplaneIcon, NoSymbolIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/banner-organisation-home.png";

// API
import { organisationCategories, organisationApply } from "../apis/exportedAPIs";


export default function NewOrganisation() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [allCategories, setAllCategories] = useState([]);

    const [organisationName, setOrganisationName] = useState('');
    const [organisationDescription, setOrganisationDescription] = useState('');
    const [organisationCategory, setOrganisationCategory] = useState('all');
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [posterImage, setPosterImage] = useState(null);

    useEffect(() => {
        async function fetchAllCategories() {
            if (allCategories.length > 0)
                return;

            const response = await organisationCategories();

            const json = await response.json();
            if (response.ok) {
                setAllCategories([...json.categories]);
            } else {
                toast.error(json.error);
            }
        }

        fetchAllCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const toastId = toast.loading('Loading...');

        try {
            setIsLoading(true);

            // DEV TOKEN HERE
            const response = await organisationApply({
                name: organisationName,
                description: organisationDescription,
                category: organisationCategory,
                token: recaptchaToken,
                banner: bannerImage,
                poster: posterImage,
            });
            const json = await response.json();

            if (response.ok) {
                toast.success("Success!", { id: toastId });
                navigate("/organisation", { replace: true });
            } else {
                const errorMsg = json.error;
                toast.error(errorMsg, { id: toastId });
                setError(errorMsg);
            }

        } catch (error) {
            const errorMsg = "Something went wrong, try again later!";
            toast.error(errorMsg, { id: toastId });
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        navigate("/organisation", { replace: true });
    }

    return (
        <Layout>
            <section className="grid">
                <Banner image={BannerImage} title="New Organisation Application" />
            </section>

            <form className="flex flex-col p-4 gap-2" onSubmit={handleSubmit}>
                <InputField title="Name" placeholder="Enter Organisation Name" type="text" width='full'
                    value={organisationName} onChange={(e) => setOrganisationName(e.target.value)} />
                <InputTextBox title="Description" placeholder="Explain what your organisation does" width='full'
                    value={organisationDescription} onChange={(e) => setOrganisationDescription(e.target.value)} />
                <div className="w-1/4">
                    <StandardDropdown title="Category" titleLocation="top" options={allCategories}
                        value={organisationCategory} onChange={(e) => { setOrganisationCategory(e.target.value); }} />
                </div>
                <InputFile title="Upload Banner" accept=".png,.jpeg,.jpg" onChange={(e) => { setBannerImage(e.target.files[0]) }} />
                <InputFile title="Upload Poster" accept=".png,.jpeg,.jpg" onChange={(e) => { setPosterImage(e.target.files[0]) }} />

                <div
                    id="captcha-new-organisation"
                    className="pt-2 pb-4">
                    <ReCAPTCHA
                        sitekey="6LeZRPEoAAAAAAsHZlKI2jCO7EktXk3BHRFDu2UW"
                        onChange={(token) => setRecaptchaToken(token)}
                    />
                </div>

                <div className="flex flex-row gap-2 py-4 items-center">
                    <RectangleButton title="Submit" width="fit" forForm heroIcon={<PaperAirplaneIcon />} colour="bg-button-green" onClick={(e) => { console.log("Submit me!") }} />
                    <RectangleButton title="Cancel" width="fit" heroIcon={<NoSymbolIcon />} colour="bg-button-red" onClick={handleCancel} />
                    <label id="error-new-organsation" className="text-text-warn">
                        {error ?? ''}
                    </label>
                </div>
            </form>
        </Layout >
    )
}
