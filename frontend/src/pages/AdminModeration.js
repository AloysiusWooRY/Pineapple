// React / Packages
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import Table from "../components/Table";
import Popup from "../components/Popup";
import { StandardDropdown } from "../components/Buttons";
import { UserType } from "../components/Miscellaneous";

// Assets
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/banner-admin-moderation.png";

// API
import { useAuthContext } from "../hooks/useAuthContext";
import { adminAccountAll, adminAccountEditRole, organisationAll } from "../apis/exportedAPIs";

export default function AdminModeration() {
    const { user } = useAuthContext();

    const [allOrganisations, setAllOrganisations] = useState(null);
    const [allOrganisationOptions, setAllOrganisationOptions] = useState([]);
    const [allUsers, setAllUsers] = useState(null);

    const [viewingUserMode, setViewingUserMode] = useState(false);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const [userModerates, setUserModerates] = useState([]);

    // Fires on page load
    useEffect(() => {
        async function fetchAllOrganisations() {
            const response = await organisationAll({ category: "" });
            const json = await response.json();

            if (response.ok) {
                setAllOrganisations(json.organisations);
                setAllOrganisationOptions(json.organisations.map(organisation => organisation.name));
            } else {
                toast.error(json.error);
            }
        }

        async function fetchAllUsers() {
            const response = await adminAccountAll();
            const json = await response.json();

            if (response.ok) {
                setAllUsers(json.accounts);
            } else {
                toast.error(json.error);
            }
        }

        fetchAllOrganisations();
        fetchAllUsers();
    }, []);

    // Returns user data for population of table
    // function GenerateUsers() {
    //     let tableData = [];
    //     allUsers ?
    //         allUsers.map((item) => {
    //             tableData.push({
    //                 name: item.name,
    //                 email: item.email,
    //                 role: <UserType type={item.isAdmin ? "administrator" : item.moderation.length > 0 ? "moderator" : "user"} />
    //             });
    //         })
    //         :
    //         tableData = [];

    //     return tableData;
    // }
    function GenerateUsers() {
        if (!allUsers) {
            return [];
        }

        return allUsers.map((item) => ({
            name: item.name,
            email: item.email,
            role: <UserType type={item.isAdmin ? "administrator" : item.moderation.length > 0 ? "moderator" : "user"} />,
        }));
    }

    // User clicked handler
    function HandleLoadUser(e) {
        setUsername(allUsers[e].name);
        setUserRole(allUsers[e].isAdmin ? "administrator" : allUsers[e].moderation.length > 0 ? "moderator" : "user");
        setUserId(allUsers[e]._id);

        setUserModerates(allUsers[e].moderation);

        setViewingUserMode(true);
    }

    // Popup submit handler
    async function handlePermissionUpdate(e) {
        e.preventDefault();

        const ogUser = allUsers.find(item => item._id === userId);
        const ogUserRole = ogUser.isAdmin ? "administrator" : ogUser.moderation.length > 0 ? "moderator" : "user";

        if (userId === user._id) {
            toast.error("Cannot modify your own role!");
            return;
        }

        if (ogUserRole === userRole && userRole !== "moderator") {
            toast.error("Same role selected!");
            return;
        }
        if (userModerates.length <= 0 && userRole === "moderator") {
            toast.error("Please select an organisation to moderate!");
            return;
        }
        if (new Set(userModerates).size !== userModerates.length) {
            toast.error("Please do not select the same organisation more than once!");
            return;
        }

        const response = await adminAccountEditRole({
            account: userId,
            role: userRole,
            moderation: (userRole === "moderator") ? userModerates : [],
        });
        const json = await response.json();

        if (response.ok) {
            // Update client-side user details
            ogUser.isAdmin = userRole === "administrator";
            ogUser.moderation = (userRole === "moderator") ? [...userModerates] : [];

            toast.success(`${username}'s permissions have been updated! (${userRole})`);
        } else {
            toast.error(json.error);
        }

        setViewingUserMode(false);
    }

    return (
        <Layout>
            <section className="flex flex-col">
                <Banner image={BannerImage} title="Moderation" />

                {/* <div className="w-1/5 pt-2">
                    <SearchField title="Search By Name" bottomPadding={0} value={searchField} onChange={(e) => { setSearchField(e.target.value); }} />
                </div> */}

                <div className="flex flex-grow pt-2 gap-2">
                    <div className="w-full">
                        {allUsers && (allUsers.length > 0 ?
                            <Table rows={GenerateUsers()} title="Users" onClick={(e) => HandleLoadUser(e.target.parentElement.getAttribute('data-index'))} />
                            :
                            <h1 className="grow text-text-primary py-4 text-3xl text-center">🍍No Users Here🍍</h1>)
                        }
                    </div>
                </div>
            </section>

            <Popup title={`Editing User ${username}`}
                variableThatDeterminesIfPopupIsActive={viewingUserMode}
                setVariableThatDeterminesIfPopupIsActive={setViewingUserMode}
                onSubmit={handlePermissionUpdate}
            >
                <StandardDropdown title="Role" titleLocation="top" options={['user', 'moderator', 'administrator']}
                    value={userRole ?? undefined} onChange={(e) => { setUserRole(e.target.value); }} />

                {userRole === 'moderator' &&
                    <div className="flex flex-col space-y-2 py-2">
                        <div className="flex flex-row space-x-2 justify-center items-center">
                            <span className="grow text-text-primary">Moderator Of</span>
                            <button onClick={(e) => {
                                e.preventDefault();
                                let workingArray = [...userModerates];
                                workingArray.push(allOrganisations[0]._id);
                                setUserModerates(workingArray);
                            }}><PlusCircleIcon className="h-8 w-8 text-text-primary" /></button>
                        </div>

                        {userModerates.map((organisationId, i) => (
                            <div
                                key={"key-moderates-" + i}
                                className="flex flex-row space-x-2 justify-center items-center">
                                <div className="grow">
                                    <StandardDropdown
                                        title={"moderates-" + i}
                                        value={allOrganisations.find(organisation => { return organisation._id === organisationId }).name}
                                        titleLocation="none"
                                        bottomPadding={0}
                                        options={allOrganisationOptions}
                                        onChange={(e) => {
                                            let workingArray = [...userModerates];
                                            workingArray[i] = allOrganisations.find(organisation => { return organisation.name === e.target.value })._id;
                                            setUserModerates(workingArray);
                                        }}
                                    />
                                </div>

                                <button onClick={(e) => {
                                    e.preventDefault();
                                    let workingArray = [...userModerates];
                                    workingArray.splice(i, 1);
                                    setUserModerates(workingArray);
                                }}>
                                    <MinusCircleIcon className="h-8 text-text-primary" />
                                </button>
                            </div>
                        ))}
                    </div>
                }
            </Popup>
        </Layout >
    )
}
