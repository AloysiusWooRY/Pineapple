// React / Packages
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import { InputField, InputTextBox, InputFile } from "../components/Inputs";
import { RectangleButton, StandardDropdown } from "../components/Buttons";

// Assets
import { PaperAirplaneIcon, NoSymbolIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/org-banner.png";

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
    const [bannerImage, setBannerImage] = useState(null);
    const [posterImage, setPosterImage] = useState(null);

    useEffect(() => {
        async function fetchAllCategories() {
            if (allCategories.length > 0)
                return;

            const response = await organisationCategories();

            const json = await response.json();
            if (response.ok) {
                setAllCategories(['all', ...json.categories]);
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

            // TODO: Check for field length and file type
            const response = await organisationApply({
                name: organisationName,
                description: organisationDescription,
                category: organisationCategory,
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
                <StandardDropdown title="Category" titleLocation="top" width="1/4" options={allCategories}
                    value={organisationCategory} onChange={(e) => { setOrganisationCategory(e.target.value); }} />
                <InputFile title="Upload Banner" width='full' accept=".png,.jpeg,.jpg" onChange={(e) => { setBannerImage(e.target.files[0]) }} />
                <InputFile title="Upload Poster" width='full' accept=".png,.jpeg,.jpg" onChange={(e) => { setPosterImage(e.target.files[0]) }} />

                <div className="flex flex-row gap-2 items-center">
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
