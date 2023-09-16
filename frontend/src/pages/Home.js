import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Layout from "../layouts/Layout";
import Banner from "../components/Banner"
import CategoryButton from "../components/CategoryButton"
import CardHome from "../components/CardHome"

import BannerImage from "../assets/home-banner.png"
import CategoryAllImage from "../assets/home-cat-all.png"
import CategoryEventImage from "../assets/home-cat-event.png"
import CategoryDiscussionImage from "../assets/home-cat-discussion.png"
import CategoryDonationImage from "../assets/home-cat-donation.png"

import { GlobeAltIcon, CalendarDaysIcon, ChatBubbleLeftRightIcon, CurrencyDollarIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { Navigate } from "react-router-dom";
import Sample1 from "../assets/sample-nuts.jpg"

const Home = () => {
    const { user } = useAuthContext();

    return (
        <Layout>
            <section className="grid ">
                <Banner image={BannerImage} title="Home" />
                <div className="grid grid-cols-4 h-24 my-2 gap-2">
                    <CategoryButton image={CategoryAllImage} title="ALL" icon={GlobeAltIcon} />
                    <CategoryButton image={CategoryEventImage} title="EVENTS" icon={CalendarDaysIcon} />
                    <CategoryButton image={CategoryDiscussionImage} title="DISCUSSIONS" icon={ChatBubbleLeftRightIcon} />
                    <CategoryButton image={CategoryDonationImage} title="DONATIONS" icon={CurrencyDollarIcon} />
                </div>
                <div className="scroll-px-0 overflow-auto w-full">
                    <div className="inline-flex gap-2 px-2">
                        <button className="bg-white text-black text-xs font-medium border-1 border-white/10 rounded-full outline-none py-1 px-4 text-center">
                            RELATED
                        </button>
                        <button className="bg-transparent hover:bg-white/5 text-white text-xs font-medium border-1 border-white/10 rounded-full outline-none py-1 px-4 text-center">
                            NEW
                        </button>
                        <button className="bg-transparent hover:bg-white/5 text-white text-xs font-medium border-1 border-white/10 rounded-full outline-none py-1 px-4 text-center">
                            TOP
                        </button>
                    </div>

                </div>
                <div className="grid grid-cols-2 max-lg:grid-cols-1 p-2">
                    {
                        [...Array(9)].map((_, index) => (
                            <CardHome key={index} image={Sample1} title="Save deez nutz" organisation="Nut Allergy Foundation" category="Discussion" type="Health" />
                        ))
                    }
                </div>
            </section>
        </Layout >
    )
}

export default Home;