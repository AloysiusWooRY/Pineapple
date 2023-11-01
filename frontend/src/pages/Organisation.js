// React / Packages
import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import toast from "react-hot-toast";

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

    const [allPosts, setAllPosts] = useState(null);
    const [categoryFilteredPosts, setCategoryFilteredPosts] = useState(null);

    const [selectedOrganisation, setSelectedOrganisation] = useState(null);

    const [editOrganisationMode, setEditOrganisationMode] = useState(false);
    const [editOrganisation, setEditOrganisation] = useState({
        name: 'Mental Health Hoax',
        description: 'Crazy? I was crazy once. They locked me in a room. A rubber room. A rubber room with rats. And rats make me crazy.',
        bannerImage: [],
        posterImage: [],
        error: null,
    });

    // Loads the organisation by id
    useEffect(() => {
        async function fetchData() {
            const response = await organisationId({id});

            if (response.ok) {
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                setSelectedOrganisation(jsonResponse.organisation);
            }
        }
        fetchData()
    }, []);

    // Loads all posts
    useEffect(() => {
        async function fetchData() {
            const response = await postAll({
                organisation: id,
                category: "",
                filter: "",
                sortByPinned: true,
            })
            const jsonResponse = await response.json();

            if (response.ok) {
                setAllPosts(jsonResponse.posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
                setCategoryFilteredPosts(jsonResponse.posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
            } else {
                toast.error(jsonResponse.error);
            }
        }
        fetchData();
    }, []);

    function OrganisationPosts() {
        let posts = [];
        const currentDate = new Date();

        (categoryFilteredPosts != null && selectedOrganisation != null) ? (
            
            categoryFilteredPosts.map(item => (
                posts.push(
                <NavLink key={"post-link-" + item._id} to={`/organisation/${selectedOrganisation._id}/post/${item._id}`}>
                    <DiscussionOverview
                        key={"post-" + item._id}
                        title={item.title} 
                        discussionType={item.donation ? "donation": item.event ? "event": "discussion"}
                        votes={item.likes} 
                        timeSincePost={(Math.floor((currentDate - (new Date(item.updatedAt))) / (1000 * 60 * 60 * 24)))}
                        posterUsername={item.owner.name} 
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
                <NavLink key={"nav-link-" + id} to={`/organisation/123/post/123`}>
                    <DiscussionOverview
                        id={"post-" + id}
                        title={"What if we could print a brain?"} discussionType={"discussion"}
                        votes={69} timeSincePost={"4 days"} posterUsername={"Ho Lee"} upvoted={null} />
                </NavLink>
            </div>
        );
        

        return posts;
    }

    function handleCategoryPosts(e) {
        const category = e.target.getAttribute('data-value');
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

        setCategoryFilteredPosts(sortBy === "newest" ? filteredItems.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) : filteredItems.sort((a, b) => b.likes - a.likes));
    }

    function handleSortPosts(e) {
        const sortByValue = e.target.value;
        setSortBy(sortByValue);

        if (sortByValue === "newest") {
            setCategoryFilteredPosts(categoryFilteredPosts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
        }
        else if(sortByValue === "top") {
            setCategoryFilteredPosts(categoryFilteredPosts.sort((a, b) => b.likes - a.likes));
        }
    }

    async function handleOrganisationEdit(e) {
        e.preventDefault();

        console.log("handle edit org!");
        console.log(selectedOrganisation);
    }

    return (
        <Layout>
            <div className="flex flex-row gap-2">
                <section className="h-96 flex-grow">
                    <Banner image={BannerImage} title={selectedOrganisation ? selectedOrganisation.name : "Mental Health Hoax"} />
                    {/* button={{ icon: <PencilIcon />, text: "Edit", onClick: () => setEditOrganisationMode(!editOrganisationMode) }} */}

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

                    <div className="flex flex-col py-2 gap-2">
                       {<OrganisationPosts />}
                    </div>
                </section>

                {selectedOrganisation != null ? 
                    <NavLink to={`/organisation/${selectedOrganisation._id}/post/new`}>
                        <SideBarOrganisationInfo
                            organisationName={selectedOrganisation.name}
                            organisationDescription={selectedOrganisation.description}
                            createDate={new Date(selectedOrganisation.createdAt).toLocaleDateString()}
                            numberPosts={selectedOrganisation.posts}
                        />
                    </NavLink> 
                    : 
                    <SideBarOrganisationInfo
                        organisationName="Mental Health Hoax"
                        organisationDescription="Crazy? I was crazy once. They locked me in a room. A rubber room. A rubber room with rats. And rats make me crazy."
                        createDate="July 22, 1999"
                        numberPosts="30"
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
