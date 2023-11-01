// React / Packages
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";

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

    const [categories, setCategories] = useState(["all", "health", "education", "environment", "humanitarian"]);

    const [allOrganisations, setAllOrganisations] = useState(null);
    const [categoryFilteredOrganisations , setCategoryFilteredOrganisations] = useState(null);

    const handleClick = (e) => {
        navigate("../organisation/new");
    }

    function handleCategoryOrganisations(e) {
        const category = e.target.getAttribute('data-value');

        const filteredItems = allOrganisations.filter(item => {
            if (category === "all") {
                return true;
            } else {
                return item.category === category;
            }   
        });

        setCategoryFilteredOrganisations(filteredItems);
    }

    useEffect(() => {
        async function fetchData() {
            const response = await organisationAll({ category: '' });
            const jsonResponse = await response.json();

            if (response.ok) {
                setAllOrganisations(jsonResponse.organisations);
                setCategoryFilteredOrganisations(jsonResponse.organisations);
            } else {
                toast.error(response.error);
            }
        }
        fetchData();
    }, []);

    return (
        <Layout>
            <section className="grid">
                <Banner image={BannerImage} title="Organisations" button={{ icon: <PlusCircleIcon />, text: "Apply for New Organisation", onClick: handleClick }} />

                <Tabs title="Organisation Categories" tabs={categories} heroIconsArr={[<NewspaperIcon />, <HeartIcon />, <BookOpenIcon />, <GlobeAsiaAustraliaIcon />, <HandRaisedIcon />]}
                    onClick={(e) => handleCategoryOrganisations(e) } />

                <Divider padding={0} />

                <div className="grid p-2 gap-2 sm:flex flex-wrap">
                    {categoryFilteredOrganisations ? 
                        (categoryFilteredOrganisations.map(item => (
                            <NavLink key={"nav-link" + item._id} to={`/organisation/${item._id}`}>
                                <CardHomeOrg key={item.id} image={`http://localhost:4000/comptra.png`} name={item.name} posts={item.posts} category={item.category} />
                            </NavLink>
                        ))) 
                        : <h1 className="grow text-text-primary py-4 text-6xl text-center">🍍No Organisations Here :(🍍</h1>
                    }
                </div>
            </section>
        </Layout >
    )
}
