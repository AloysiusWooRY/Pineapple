// React / Packages
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import toast from 'react-hot-toast';

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import CardHome from "../components/CardHome";
import { Tabs, StandardDropdown } from "../components/Buttons";
import { Divider } from "../components/Miscellaneous";

// Assets
import { NewspaperIcon, GlobeAltIcon, CalendarDaysIcon, ChatBubbleLeftRightIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/home-banner.png";
import Sample1 from "../assets/sample-nuts.jpg";

// API
import { postAll } from "../apis/exportedAPIs";

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState('new');

    const [allPosts, setAllPosts] = useState(null);

    const [categoryFilteredPosts, setCategoryFilteredPosts] = useState(allPosts);
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        async function fetchData() {
            const fetchedData = await postAll({
                organisation: '',
                category: '',
                filter: '',
                sortByPinned: false,
            });

            const jsonResponse = await fetchedData.json();
            if (fetchedData.ok) {
                console.log(jsonResponse);
                setAllPosts(jsonResponse);
            } else {
                toast.error(jsonResponse.error);
            }
        }

        fetchData();
    }, []);

    function handleCategoryPosts() {
        const filteredItems = allPosts.filter(item => {
            if (selectedCategory === "donation") {
                return item.organisation.donation;
            }
            else if (selectedCategory === "event") {
                return item.organisation.event;
            }
            else if (selectedCategory === "discussion") {
                return !item.organisation.donation && !item.organisation.event;
            }
            return true;
        });

        // setCategoryFilteredPosts(filteredItems);
        console.log(filteredItems);
    }


    return (
        <Layout>
            <section className="grid">
                <Banner image={BannerImage} title="Home" />

                <div className="flex flex-row justify-between mt-2">
                    <div className="flex basis-4/5">
                        <Tabs title="Post Types" tabs={['all', 'discussion', 'event', 'donation']} heroIconsArr={[<NewspaperIcon />, <ChatBubbleLeftRightIcon />, <CalendarDaysIcon />, <CurrencyDollarIcon />]}
                            onClick={(e) => setSelectedCategory(e.target.getAttribute('data-value'))} />
                    </div>

                    <div className="basis-1/5">
                        <StandardDropdown title="Sort By" value={sortBy} options={['newest', 'top']} onChange={(e) => setSortBy(e.target.value)} />
                    </div>
                </div>

                <div className="-mt-2">
                    <Divider padding={0} />
                </div>

                <div className="grid grid-cols-2 max-lg:grid-cols-1 p-2">

                    {allPosts ?
                        (allPosts.posts.map((item) => (
                            <NavLink key={item._id} to={`/organisation/${item.organisation._id}/post/${item._id}`}>
                                <CardHome _id={item._id} image={`http://localhost:4000/comptra.png`} title={item.title}
                                    organisation={item.organisation.name}
                                    category={item.organisation.category} />
                            </NavLink>
                        ))) : ""
                    }
                </div>
            </section>
        </Layout >
    )
}
