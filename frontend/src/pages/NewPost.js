import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Layout from "../layouts/Layout";
import Banner from "../components/Banner"

import BannerImage from "../assets/post-banner.png"
import CategoryAllImage from "../assets/home-cat-all.png"
import CategoryEventImage from "../assets/home-cat-event.png"
import CategoryDiscussionImage from "../assets/home-cat-discussion.png"
import CategoryDonationImage from "../assets/home-cat-donation.png"

import { CalendarDaysIcon, ChatBubbleLeftRightIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
import Sample1 from "../assets/sample-nuts.jpg"

const NewPost = () => {
    const { user } = useAuthContext();

    return (
        <Layout>
            <section className="grid ">
                <Banner image={BannerImage} title="New Post" />
            </section>
            <div class="border-b border-gray-700 ">

            </div>

            <div className="flex flex-col p-4 gap-2">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <ul class="flex flex-wrap -mb-px text-sm font-medium  text-center text-gray-400">
                        <li class="mr-2">
                            <a href="#" class="inline-flex items-center justify-center py-2 px-4 border-b-2 border-[#ffdc00] text-[#ffdc00] rounded-t-lg hover:text-gray-600 hover:border-gray-300 group gap-2 text-lg bg-theme-primary">
                                <ChatBubbleLeftRightIcon className="w-4" />Discussion
                            </a>
                        </li>
                        <li class="mr-2">
                            <a href="#" class="inline-flex items-center justify-center py-2 px-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 group gap-2 text-lg">
                                <CalendarDaysIcon className="w-4" />Event
                            </a>
                        </li>
                        <li class="mr-2">
                            <a href="#" class="inline-flex items-center justify-center py-2 px-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 group gap-2 text-lg">
                                <CurrencyDollarIcon className="w-4" />Donation
                            </a>
                        </li>
                    </ul>
                </div>


                <label for="title" className="text-white ">Title</label>

                <input
                    id="title"
                    type="text"
                    placeholder="Post Title"
                    onChange={(e) => { return }}
                    className="p-2 rounded-sm  text-black bg-white/10 placeholder:text-theme-placeholder"
                />
                <label for="comment" className="text-white">Your message</label>
                <textarea id="comment" className="p-2 rounded-sm bg-white/10 text-black placeholder:text-theme-placeholder h-32" placeholder="Write your thoughts here ..." />
                <label for="file" className="text-white">Upload image</label>
                <input
                    id="file"
                    type="file"
                    onChange={(e) => { return }}
                    className="p-2 bg-white/10 text-theme-placeholder rounded-lg"
                />
            </div>
        </Layout >
    )
}

export default NewPost;