import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

import Layout from "../layouts/Layout";
import Banner from "../components/Banner"
import BannerImage from "../assets/org-banner.png"

const NewOrganisation = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        const toastId = toast.loading('Loading...')

        // TODO: Check for field length and file type

        const name = e.target.name.value
        const description = e.target.description.value
        const banner = e.target.banner.files[0]
        const poster = e.target.poster.files[0]

        const formData = new FormData();
        formData.append("name", name)
        formData.append("description", description)
        formData.append("banner", banner)
        formData.append("poster", poster)

        try {
            setIsLoading(true)

            const response = await fetch(`/api/organisation/apply`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
                body: formData,
            });
            const json = await response.json()

            if (response.ok) {
                toast.success("Success!", { id: toastId })
                navigate("/organisation", { replace: true })
            } else {
                const errorMsg = json.error
                toast.error(errorMsg, { id: toastId })
                setError(errorMsg)
            }

        } catch (error) {
            const errorMsg = "Something went wrong, try again later!"
            toast.error(errorMsg, { id: toastId })
            setError(errorMsg)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = (e) => {
        e.preventDefault()
        navigate("/organisation", { replace: true })
    }

    return (
        <Layout>
            <section className="grid ">
                <Banner image={BannerImage} title="New Organisation Application" />
            </section>

            <form className="flex flex-col p-4 gap-2" onSubmit={handleSubmit}>
                <label className="text-white ">Name</label>
                <input
                    id="name"
                    type="text"
                    placeholder="Organisation Name"
                    onChange={(e) => { return }}
                    className="p-2 rounded-sm  text-white bg-white/10 placeholder:text-theme-placeholder"
                />

                <label className="text-white">Description</label>
                <textarea id="description" className="p-2 rounded-sm bg-white/10 text-white placeholder:text-theme-placeholder h-32" placeholder="Explain what your organisation does ..." />

                <label className="text-white">Upload Banner</label>
                <input
                    id="banner"
                    type="file"
                    accept=".png,.jpeg,.jpg"
                    className="p-2 bg-white/10 text-theme-placeholder rounded-lg"
                />

                <label className="text-white">Upload Poster</label>
                <input
                    id="poster"
                    type="file"
                    accept=".png,.jpeg,.jpg"
                    className="p-2 bg-white/10 text-theme-placeholder rounded-lg"
                />
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

export default NewOrganisation;