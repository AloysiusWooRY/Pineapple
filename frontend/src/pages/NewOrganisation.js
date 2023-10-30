// React / Packages
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import { InputField, InputTextBox, InputFile } from "../components/Inputs";
import { RectangleButton } from "../components/Buttons";

// Assets
import { PaperAirplaneIcon, NoSymbolIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/org-banner.png";

// API
import { useCsrfContext } from "../hooks/useCsrfContext";
import { organisationApply } from "../apis/exportedAPIs";


export default function NewOrganisation() {
    const { csrfToken } = useCsrfContext();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [organisationName, setOrganisationName] = useState('');
    const [organisationDescription, setOrganisationDescription] = useState('');
    const [bannerImage, setBannerImage] = useState([]);
    const [posterImage, setPosterImage] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const toastId = toast.loading('Loading...');

        // TODO: Check for field length and file type

        const formData = new FormData();
        formData.append("name", organisationName);
        formData.append("description", organisationDescription);
        formData.append("banner", bannerImage[0]);
        formData.append("poster", posterImage[0]);

        try {
            setIsLoading(true);

            const response = await organisationApply(csrfToken, organisationName, organisationDescription, 'health', bannerImage[0], posterImage[0]);
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
                <InputFile title="Upload Banner" width='full' accept=".png,.jpeg,.jpg" onChange={(e) => { setBannerImage([...bannerImage, e.target.files[0]]) }} />
                <InputFile title="Upload Poster" width='full' accept=".png,.jpeg,.jpg" onChange={(e) => { setPosterImage([...posterImage, e.target.files[0]]) }} />

                <div className="flex flex-row gap-2 items-center">
                    <RectangleButton title="Submit" forForm heroIcon={<PaperAirplaneIcon />} colour="bg-button-green" onClick={(e) => { console.log("Submit me!") }} />
                    <RectangleButton title="Cancel" heroIcon={<NoSymbolIcon />} colour="bg-button-red" onClick={handleCancel} />
                    <label className="text-text-warn">
                        {error ?? ''}
                    </label>
                </div>
            </form>
        </Layout >
    )
}
