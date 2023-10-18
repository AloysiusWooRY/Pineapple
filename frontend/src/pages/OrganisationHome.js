// React / Packages
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import CardHomeOrg from "../components/CardHomeOrg";
import { StandardDropdown } from "../components/Buttons";
import { SearchField } from "../components/Inputs";

// Assets
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/home-banner-org.png";
import Sample1 from "../assets/sample-nuts.jpg";

// API
import { useAuthContext } from "../hooks/useAuthContext";

export default function OrganisationHome() {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const [searchField, setSearchField] = useState('');

    const handleClick = (e) => {
        navigate("../organisation/new");
    }

    return (
        <Layout>
            <section className="grid">
                <Banner image={BannerImage} title="Organisations" button={{ icon: <PlusCircleIcon />, text: "Create New", onClick: handleClick }} />
                
                <div className="flex flex-row items-center justify-between">
                    <div className="w-1/5 my-2">
                        <SearchField title="Search by Category" bottomPadding={0} value={searchField} onChange={(e) => { setSearchField(e.target.value); }}/>
                    </div>
                    <div className="w-1/5 my-2">
                        <StandardDropdown title="Sort By" bottomPadding={0} options={['Most Followed', 'Newest']} onChange={(e) => { console.log(e.target.value); }} />
                    </div>
                </div>

                <div className="grid p-2 gap-2 sm:flex flex-wrap">
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" category="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" category="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" category="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" category="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" category="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" category="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" category="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" category="Health" />
                </div>
            </section>
        </Layout >
    )
}
