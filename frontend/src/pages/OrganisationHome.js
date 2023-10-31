// React / Packages
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cookie from 'react-cookies';

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
import { organisationAll } from "../apis/exportedAPIs";


export default function OrganisationHome() {
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState(["all", "health", "education", "environment", "humanitarian"]);

    const [allOrganisations, setAllOrganisations] = useState(null);

    const handleClick = (e) => {
        navigate("../organisation/new");
    }

    useEffect(() => {
        async function fetchData() {
            const allOrgsJson = await organisationAll({ category: 'health' });
            const allOrganisations = await allOrgsJson.json()
            setAllOrganisations(allOrganisations)
        }
        fetchData();
    }, []);

    return (
        <Layout>
            <section className="grid">
                <Banner image={BannerImage} title="Organisations" button={{ icon: <PlusCircleIcon />, text: "Apply for New Organisation", onClick: handleClick }} />

                <Tabs title="Organisation Categories" tabs={categories} heroIconsArr={[<NewspaperIcon />, <HeartIcon />, <BookOpenIcon />, <GlobeAsiaAustraliaIcon />, <HandRaisedIcon />]}
                    onClick={(e) => setSelectedCategory(e.target.getAttribute('data-value'))} />

                <Divider padding={0} />

                <div className="grid p-2 gap-2 sm:flex flex-wrap">
                    {allOrganisations && (allOrganisations ?
                        (allOrganisations.organisations.map(item => (
                            <div key={"key-organisation-" + item._id}>
                                <CardHomeOrg image={`http://localhost:4000/comptra.png`} name={item.name} posts={item.posts} category={item.category} />
                            </div>
                        )))
                        :
                        <h1 className="grow text-text-primary py-4 text-6xl text-center">🍍No Organisations Here :(🍍</h1>
                    )}
                </div>
            </section>
        </Layout >
    )
}
