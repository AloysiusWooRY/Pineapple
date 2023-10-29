// React / Packages
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import CardHomeOrg from "../components/CardHomeOrg";
import { Tabs } from "../components/Buttons";
import { Divider } from "../components/Miscellaneous";

// Assets
import { PlusCircleIcon, NewspaperIcon, HeartIcon, BookOpenIcon, GlobeAsiaAustraliaIcon, HandRaisedIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/home-banner-org.png";
import Sample1 from "../assets/sample-nuts.jpg";

// API
import { useAuthContext } from "../hooks/useAuthContext";

export default function OrganisationHome() {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState(["all", "health", "education", "environment", "humanitarian"]);

    const handleClick = (e) => {
        navigate("../organisation/new");
    }

    return (
        <Layout>
            <section className="grid">
                <Banner image={BannerImage} title="Organisations" button={{ icon: <PlusCircleIcon />, text: "Apply for New Organisation", onClick: handleClick }} />

                <Tabs tabs={categories} heroIconsArr={[<NewspaperIcon />, <HeartIcon />, <BookOpenIcon />, <GlobeAsiaAustraliaIcon />, <HandRaisedIcon />]}
                    onClick={(e) => setSelectedCategory(e.target.getAttribute('data-value'))} />

                <Divider padding={0} />

                <div className="grid p-2 gap-2 sm:flex flex-wrap">
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" posts="69" category="health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" posts="69" category="education" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" posts="69" category="environment" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" posts="69" category="humanitarian" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" posts="69" category="health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" posts="69" category="education" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" posts="69" category="environment" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" posts="69" category="humanitarian" />
                </div>
            </section>
        </Layout >
    )
}
