// React / Packages
import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";

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
import { organisationId, postAll } from "../apis/exportedAPIs";

export default function Organisation() {
    const { user } = useAuthContext()
    const { id } = useParams()

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [allPosts, setAllPosts] = useState(null)

    const [selectedOrganisation, setSelectedOrganisation] = useState({
        name: 'Mental Health Hoax',
        description: 'Crazy? I was crazy once. They locked me in a room. A rubber room. A rubber room with rats. And rats make me crazy.',
        createDate: 'July 22, 1999',
        posts: 30,
        default: true,
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
        (allPosts != null && !selectedOrganisation.default) ? (
            allPosts.posts.map(item => (
                posts.push(
                <NavLink to={`/organisation/${selectedOrganisation._id}/post/${item._id}`}>
                    <DiscussionOverview
                        key={"post-" + item._id}
                        title={item.title} 
                        discussionType={item.donation ? "donation": item.event ? "event": "discussion"}
                        votes={item.likes} 
                        timeSincePost={item.updatedAt}
                        posterUsername={user.name} 
                        upvoted={null}
                        imagePath={selectedOrganisation.imagePath.poster}
                    />
                </NavLink>
                )
            ))
        )
        :
        posts.push(
            <div key={"key-post-" + id}>
                <NavLink to={`/organisation/${selectedOrganisation._id}/post/123`}>
                    <DiscussionOverview
                        id={"post-" + id}
                        title={"What if we could print a brain?"} discussionType={"discussion"}
                        votes={69} timeSincePost={"4 days"} posterUsername={"Ho Lee"} upvoted={null} />
                </NavLink>
            </div>
        );
        

        return posts;
    }

    useEffect(() => {
        async function fetchData() {
            const fetchedOrganisation = await organisationId({id})
            const fetchedData = await fetchedOrganisation.json()

            if (fetchedData.error != "Invalid id") {
                setSelectedOrganisation(fetchedData.organisation)
            }
        }
        fetchData()
    }, []);

    useEffect(() => {
        async function fetchData() {
            const fetchedPosts = await postAll({
                organisation: id,
                category: "",
                filter: "",
                sortByPinned: true,
            })
            const fetchedData = await fetchedPosts.json()
            setAllPosts(fetchedData)
        }
        fetchData()
    }, []);

    async function handleOrganisationEdit(e) {
        e.preventDefault();

        console.log("handle edit org!");
        console.log(selectedOrganisation)
    }

    return (
        <Layout>
            <div className="flex flex-row gap-2">
                <section className="h-96 flex-grow">
                    <Banner image={BannerImage} title="Mental Health Hoax"
                        button={{ icon: <PencilIcon />, text: "Edit", onClick: () => setEditOrganisationMode(!editOrganisationMode) }} />

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

                    <div className="flex flex-col py-2 gap-2">
                       {<OrganisationPosts />}
                    </div>
                </section>

                {selectedOrganisation ? 
                    <NavLink to={`/organisation/${selectedOrganisation._id}/post/new`}>
                        <SideBarOrganisationInfo
                            organisationName={selectedOrganisation.name}
                            organisationDescription={selectedOrganisation.description}
                            createDate={selectedOrganisation.createdAt}
                            numberPosts={selectedOrganisation.posts}
                        />
                    </NavLink> 
                    : 
                    <SideBarOrganisationInfo
                        organisationName={selectedOrganisation.name}
                        organisationDescription={selectedOrganisation.description}
                        createDate={selectedOrganisation.createDate}
                        numberPosts={selectedOrganisation.posts}
                        onCreateClicked={handleOrganisationEdit}
                    />
                }
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

                <label id="error-edit-organisation" className="text-text-warn">
                    {editOrganisation.error ?? ''}
                </label>
            </Popup>
        </Layout>
    );
}
