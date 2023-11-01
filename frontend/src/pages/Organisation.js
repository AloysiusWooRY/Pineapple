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
        name: '',
        description: '',
        bannerImage: null,
        posterImage: null,
        error: null,
    });

    // Loads the organisation by id
    useEffect(() => {
        async function fetchOrganisation() {
            const response = await organisationId({ id });

            if (response.ok) {
                const json = await response.json();
                console.log(json);
                setSelectedOrganisation(json.organisation);
            }
        }
        fetchOrganisation();
    }, []);

    // Loads all posts
    useEffect(() => {
        async function fetchPosts() {
            const response = await postAll({
                organisation: id,
                category: "",
                filter: "",
                sortByPinned: true,
            });
            const json = await response.json();

            if (response.ok) {
                setAllPosts(json.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setCategoryFilteredPosts(json.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } else {
                toast.error(json.error);
            }
        }
        fetchPosts();
    }, []);

    function OrganisationPosts() {
        let posts = [];
        const currentDate = new Date();

        categoryFilteredPosts.length > 0 ?
            categoryFilteredPosts.map(item => (
                posts.push(
                    <NavLink key={"post-link-" + item._id} to={`/organisation/${selectedOrganisation._id}/post/${item._id}`}>
                        <DiscussionOverview
                            post={{
                                id: item._id,
                                title: item.title,
                                discussionType: item.donation ? "donation" : item.event ? "event" : "discussion",
                                votes: item.likes,
                                createdAt: item.createdAt,
                                username: item.owner.name,
                                upvoted: null,
                                imagePath: selectedOrganisation.imagePath.poster,
                            }}
                        />
                    </NavLink>
                )
            ))
            :
            posts.push(
                <h1 className="text-text-primary py-4 text-3xl text-center">🍍No Organisations Here🍍</h1>
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

        setCategoryFilteredPosts(sortBy === "newest" ? filteredItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : filteredItems.sort((a, b) => b.likes - a.likes));
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

    async function handleOrganisationEdit(e) {
        e.preventDefault();

        console.log("handle edit org!");
        console.log(selectedOrganisation);
    }

    return (
        <Layout>
            <div className="flex flex-row gap-2">
                <section className="h-96 flex-grow">
                    {selectedOrganisation && <Banner image={BannerImage} title={selectedOrganisation.name} />}
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
                        {selectedOrganisation && categoryFilteredPosts && <OrganisationPosts />}
                    </div>
                </section>

                {selectedOrganisation &&
                    <NavLink to={`/organisation/${selectedOrganisation._id}/post/new`}>
                        <SideBarOrganisationInfo
                            organisationName={selectedOrganisation.name}
                            organisationDescription={selectedOrganisation.description}
                            createDate={selectedOrganisation.createdAt}
                            numberPosts={selectedOrganisation.posts}
                        />
                    </NavLink>
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
