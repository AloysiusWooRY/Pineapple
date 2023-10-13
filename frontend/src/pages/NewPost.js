import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

import Layout from "../layouts/Layout";
import Banner from "../components/Banner"
import { InputField, InputTextBox, InputFile } from "../components/Inputs";

import BannerImage from "../assets/post-banner.png"

import { CalendarDaysIcon, ChatBubbleLeftRightIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";

export default function NewPost(){
    const { user } = useAuthContext();

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

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

                <InputField title="Post Title" placeholder="Enter Post Title . . ." type="text" width='full'
                    value={title} onChange={(e) => setTitle(e.target.value)} />
                <InputTextBox title="Your Message" placeholder="Write your thoughts here . . ." width='full'
                    value={message} onChange={(e) => setMessage(e.target.value)} />
                <InputFile title="Upload Image" width='full' accept=".png,.jpeg,.jpg" onChange={(e) => { return }}/>
            </div>
        </Layout >
    )
}
