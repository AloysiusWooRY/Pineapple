// React / Packages
import React, { useState } from "react";

// Components
import Layout from "../layouts/Layout";
import SideBarOrganisationInfo from "../components/SidebarOrganisationInfo";
import DiscussionOverview from "../components/DiscussionOverview";
import Banner from "../components/Banner";
import Popup from "../components/Popup";
import { RectangleButton, StandardDropdown, Tabs } from "../components/Buttons";
import { Divider } from "../components/Miscellaneous";
import { InputField, InputTextBox, InputFile } from "../components/Inputs";

// Assets
import { NewspaperIcon, ChatBubbleLeftRightIcon, CalendarDaysIcon, CurrencyDollarIcon, PencilIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/home-banner-org.png";

// API
import { useAuthContext } from "../hooks/useAuthContext";

export default function Organisation() {
    const { user } = useAuthContext();

    const [selectedCategory, setSelectedCategory] = useState('All');

    const [organisation, setOrganisation] = useState({
        name: 'Mental Health Hoax',
        description: 'Crazy? I was crazy once. They locked me in a room. A rubber room. A rubber room with rats. And rats make me crazy.',
        createDate: 'July 22, 1999',
        posts: 30,
        members: 60,
    });

    const [editOrganisationMode, setEditOrganisationMode] = useState(false);
    const [editOrganisation, setEditOrganisation] = useState({
        name: 'Mental Health Hoax',
        description: 'Crazy? I was crazy once. They locked me in a room. A rubber room. A rubber room with rats. And rats make me crazy.',
        bannerImage: [],
        posterImage: [],
        error: null,
    });

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

    async function handleOrganisationEdit(e) {
        e.preventDefault();

        console.log("handle edit org!");
    }

    return (
        <Layout>
            <div className="flex flex-row gap-2">
                <section className="h-96 flex-grow">
                    <Banner image={BannerImage} title="Mental Health Hoax"
                        button={{ icon: <PencilIcon />, text: "Edit", onClick: () => setEditOrganisationMode(!editOrganisationMode) }} />

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
                    organisationName={organisation.name}
                    organisationDescription={organisation.description}
                    createDate={organisation.createDate}
                    numberPosts={organisation.posts}
                    numberMembers={organisation.members}
                />
            </div>

            <Popup title="Edit Organisation"
                variableThatDeterminesIfPopupIsActive={editOrganisationMode}
                setVariableThatDeterminesIfPopupIsActive={setEditOrganisationMode}
                onSubmit={handleOrganisationEdit}
            >
                <InputField title="Name" placeholder="Enter Organisation Name" type="text" width='full'
                    value={editOrganisation.name}
                    onChange={(e) => setEditOrganisation({ ...editOrganisation, name: e.target.value })} />
                <InputTextBox title="Description" placeholder="Explain what your organisation does" width='full'
                    value={editOrganisation.description}
                    onChange={(e) => setEditOrganisation({ ...editOrganisation, description: e.target.value })} />
                <InputFile title="Upload Banner" width='full' accept=".png,.jpeg,.jpg"
                    onChange={(e) => setEditOrganisation({ ...editOrganisation, bannerImage: e.target.files[0] })} />
                <InputFile title="Upload Poster" width='full' accept=".png,.jpeg,.jpg"
                    onChange={(e) => setEditOrganisation({ ...editOrganisation, posterImage: e.target.files[0] })} />

                <label className="text-text-warn">
                    {editOrganisation.error ?? ''}
                </label>
            </Popup>
        </Layout>
    );
}
