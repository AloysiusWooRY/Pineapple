// React / Packages
import React, { useState } from "react";

// Components
import Layout from "../layouts/Layout";
import SideBarOrganisationInfo from "../components/SidebarOrganisationInfo";
import DiscussionOverview from "../components/DiscussionOverview";
import { StandardDropdown, Tabs } from "../components/Buttons";
import { Divider } from "../components/Miscellaneous";

// Assets
import { NewspaperIcon, ChatBubbleLeftRightIcon, CalendarDaysIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";

// API
import { useAuthContext } from "../hooks/useAuthContext";

export default function Organisation() {
    const { user } = useAuthContext();

    const [selectedCategory, setSelectedCategory] = useState('discussion');

    function OrganisationPosts() {
        let posts = [];

        for (let i = 0; i < 10; i++) {
            posts.push(
                <DiscussionOverview
                    key={"post-" + i}
                    title={"What if we could print a brain?"} discussionType={"Discussion"}
                    votes={69} timeSincePost={"4 days"} posterUsername={"Ho Lee"} upvoted={null} />
            );
        }

        return posts;
    }

    return (
        <Layout>
            <div className="flex flex-row gap-2">
                <section className="h-96 flex-grow">
                    <div className="flex flex-row justify-between mt-2">
                        <div className="flex basis-4/5">
                            <Tabs tabs={['All', 'Discussion', 'Event', 'Donation']} heroIconsArr={[<NewspaperIcon />, <ChatBubbleLeftRightIcon />, <CalendarDaysIcon />, <CurrencyDollarIcon />]}
                                onClick={(e) => setSelectedCategory(e.target.getAttribute('data-value'))} />
                        </div>

                        <div className="basis-1/5">
                            <StandardDropdown title="Sort By" options={['Newest', 'Top']} onChange={(e) => { console.log(e.target.value); }} />
                        </div>
                    </div>

                    <div className="-mt-2">
                        <Divider padding={0} />
                    </div>

                    <div className="flex flex-col py-2 gap-2">
                        {<OrganisationPosts />}
                    </div>
                </section>

                <SideBarOrganisationInfo
                    organisationName="Mental Health Hoax"
                    organisationDescription="Crazy? I was crazy once. They locked me in a room. A rubber room. A rubber room with rats. And rats make me crazy."
                    createDate="July 22, 1999"
                    numberPosts={30}
                    numberMembers={60}
                />
            </div>
        </Layout>
    );
}
