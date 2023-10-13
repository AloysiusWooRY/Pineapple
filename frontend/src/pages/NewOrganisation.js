import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

import Layout from "../layouts/Layout";
import Banner from "../components/Banner"
import { InputField, InputTextBox, InputFile } from "../components/Inputs";

import BannerImage from "../assets/org-banner.png"

export default function NewOrganisation() {
    const { user } = useAuthContext();
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

        // console.log(bannerImage);

        try {
            setIsLoading(true);

            const response = await fetch(`/api/organisation/apply`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
                body: formData,
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
            <section className="grid ">
                <Banner image={BannerImage} title="New Organisation Application" />
            </section>

            <form className="flex flex-col p-4 gap-2" onSubmit={handleSubmit}>
                <InputField title="Name" placeholder="Enter Organisation Name . . ." type="text" width='full'
                    value={organisationName} onChange={(e) => setOrganisationName(e.target.value)} />
                <InputTextBox title="Description" placeholder="Explain what your organisation does . . ." width='full'
                    value={organisationDescription} onChange={(e) => setOrganisationDescription(e.target.value)} />
                <InputFile title="Upload Banner" width='full' accept=".png,.jpeg,.jpg" onChange={(e) => { setBannerImage([...bannerImage, e.target.files[0]]) }} />
                <InputFile title="Upload Poster" width='full' accept=".png,.jpeg,.jpg" onChange={(e) => { setPosterImage([...posterImage, e.target.files[0]]) }} />

                <div className="flex gap-4 mt-2">
                    <button type="submit" disabled={isLoading} className="w-24 py-1 rounded-full bg-white font-sans font-bold hover:bg-white/80">
                        Submit
                    </button>
                    <button type="button" className="w-24 py-1 rounded-full bg-white font-sans font-bold hover:bg-white/80" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
                <label className="text-red-600">
                    {error ?? ""}
                </label>
            </form>
        </Layout >
    )
}
