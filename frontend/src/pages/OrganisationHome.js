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

// API
import { organisationCategories, organisationAll } from "../apis/exportedAPIs";


export default function OrganisationHome() {
    const navigate = useNavigate();

    const [allCategories, setAllCategories] = useState([]);

    const [allOrganisations, setAllOrganisations] = useState(null);
    const [categoryFilteredOrganisations, setCategoryFilteredOrganisations] = useState(null);

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

        async function fetchAllOrganisations() {
            const response = await organisationAll({ category: '' });
            const json = await response.json();

            if (response.ok) {
                setAllOrganisations(json.organisations);
                setCategoryFilteredOrganisations(json.organisations);
            } else {
                toast.error(response.error);
            }
        }

        fetchAllCategories();
        fetchAllOrganisations();
    }, []);

    return (
        <Layout>
            <section className="grid">
                <Banner image={BannerImage} title="Organisations" button={{ icon: <PlusCircleIcon />, text: "Apply for New Organisation", onClick: handleClick }} />

                <Tabs title="Organisation Categories" tabs={allCategories} heroIconsArr={[<NewspaperIcon />, <HeartIcon />, <BookOpenIcon />, <GlobeAsiaAustraliaIcon />, <HandRaisedIcon />]}
                    onClick={(e) => handleCategoryOrganisations(e)} />

                <Divider padding={0} />

                <div className="grid p-2 gap-2 sm:flex flex-wrap">
                    {categoryFilteredOrganisations && (categoryFilteredOrganisations.length > 0 ?
                        categoryFilteredOrganisations.map(item => (
                            <NavLink key={"nav-link" + item._id} to={`/organisation/${item._id}`}>
                                <CardHomeOrg image={`http://localhost:4000/comptra.png`} name={item.name} posts={item.posts} category={item.category} />
                            </NavLink>
                        ))
                        :
                        <h1 className="grow text-text-primary py-4 text-3xl text-center">🍍No Organisations Here🍍</h1>
                    )
                    }
                </div>

            </section>
        </Layout >
    )
}
