// React / Packages
import React, { useState, useEffect } from "react";

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
// ~

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

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
                    {
                        [...Array(9)].map((_, index) => (
                            <div key={"key-" + index}>
                                <CardHome image={Sample1} title="Save deez nutz" organisation="Nut Allergy Foundation" category="Health" />
                            </div>
                        ))
                    }
                </div>
            </section>
        </Layout >
    )
}
