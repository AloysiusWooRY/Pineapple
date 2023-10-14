import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, ChevronDownIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

import Layout from "../layouts/Layout";
import Banner from "../components/Banner"
import CardHomeOrg from "../components/CardHomeOrg"
import { StandardDropdown } from "../components/Buttons";

import BannerImage from "../assets/home-banner-org.png"
import Sample1 from "../assets/sample-nuts.jpg"

export default function OrganisationHome() {
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const handleClick = (e) => {
        e.preventDefault()
        navigate("../organisation/new")
    }

    return (
        <Layout>
            <section className="grid">
                <Banner image={BannerImage} title="Organisations" custom={{ icon: PlusCircleIcon, text: "Create New", handleClick }} />
                <div className="inline-block">
                    <div className="float-left flex sm:w-72 bg-white/5 border-white/10 rounded m-2 mb-0 relative">
                        <input className="h-9 w-full bg-transparent text-white border-none outline-none p-2 pr-8 font-medium" type="search" placeholder="Search by Categories" />
                        <button className="h-9 w-8 flex items-center justify-center bg-transparent border-none outline-none rounded p-0 absolute right-0 top-0" type="button">
                            <MagnifyingGlassIcon className="h-5 text-white " />
                        </button>
                    </div>

                    <div className="float-right w-1/5 m-2 mb-0">
                        <StandardDropdown title="Sort By" options={['Most Followed', 'Newest']} onChange={(e) => { console.log(e.target.value); }} />
                    </div>
                </div>

                <div className="grid p-2 gap-2 sm:flex flex-wrap">
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" type="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" type="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" type="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" type="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" type="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" type="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" type="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" type="Health" />
                </div>
            </section>
        </Layout >
    )
}
