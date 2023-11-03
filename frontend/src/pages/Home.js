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
import { NewspaperIcon, CalendarDaysIcon, ChatBubbleLeftRightIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/home-banner.png";

// API
import { postAll } from "../apis/exportedAPIs";

export default function Home() {
    const [allPosts, setAllPosts] = useState(null);
    const [categoryFilteredPosts, setCategoryFilteredPosts] = useState(null);

    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        async function fetchData() {
            const fetchedData = await postAll({
                organisation: '',
                category: '',
                filter: '',
                sortByPinned: false,
            });

            const json = await fetchedData.json();
            if (fetchedData.ok) {
                setAllPosts(json.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setCategoryFilteredPosts(json.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } else {
                toast.error(json.error);
            }
        }

        fetchData();
    }, []);

    function handleCategoryPosts(e) {
        const category = e.target.getAttribute('data-value');

        if (allPosts) {
            const filteredItems = allPosts.filter(item => {
                if (category === "donation") {
                    return item.donation;
                }
                else if (category === "event") {
                    return item.event;
                }
                else if (category === "discussion") {
                    return !item.donation && !item.event;
                }
                return true;
            });

            setCategoryFilteredPosts(sortBy === "newest" ? filteredItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : filteredItems.sort((a, b) => b.likes - a.likes));
        }
    }

    function handleSortPosts(e) {
        const sortByValue = e.target.value;
        setSortBy(sortByValue);

        if (sortByValue === "newest") {
            setCategoryFilteredPosts(categoryFilteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
        else if (sortByValue === "top") {
            setCategoryFilteredPosts(categoryFilteredPosts.sort((a, b) => b.likes - a.likes));
        }
    }

    return (
        <Layout>
            <section className="grid">
                <Banner image={BannerImage} title="Home" />

                <div className="flex flex-row justify-between mt-2">
                    <div className="flex basis-4/5">
                        <Tabs title="Post Types" tabs={['all', 'discussion', 'event', 'donation']} heroIconsArr={[<NewspaperIcon />, <ChatBubbleLeftRightIcon />, <CalendarDaysIcon />, <CurrencyDollarIcon />]}
                            onClick={(e) => handleCategoryPosts(e)} />
                    </div>

                    <div className="basis-1/5">
                        <StandardDropdown title="Sort By" value={sortBy} options={['newest', 'top']} onChange={(e) => handleSortPosts(e)} />
                    </div>
                </div>

                <div className="-mt-2">
                    <Divider padding={0} />
                </div>

                {categoryFilteredPosts && (categoryFilteredPosts.length > 0 ?
                    <div className="grid grid-cols-2 max-lg:grid-cols-1 p-2">
                    {categoryFilteredPosts.map((item) => (
                            <CardHome postContent={{
                                "postId": item._id,
                                "title": item.title,
                                "description": item.description,
                                "image": item.imagePath,
                                "type": (item.donation ? "donation" : item.event ? "event" : "discussion"),
                                "createdAt": item.createdAt,
                                "likes": item.likes,
                                "organisationId": item.organisation._id,
                                "organisationName": item.organisation.name,
                                "organisationCategory": item.organisation.category,
                            }} />
                        ))}
                    </div>
                    :
                    <h1 className="grow text-text-primary py-4 text-3xl text-center">🍍No Posts Here🍍</h1>
                )}
            </section>
        </Layout >
    )
}
