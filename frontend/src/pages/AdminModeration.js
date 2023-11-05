// React / Packages
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import Table from "../components/Table";
import Popup from "../components/Popup";
import { RoundedButton, StandardDropdown } from "../components/Buttons";
import { SearchField } from "../components/Inputs";
import { UserType } from "../components/Miscellaneous";
import { FormatDateTime } from "../components/componentUtils";

// Assets
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/banner-admin-moderation.png";

// API
import { useAuthContext } from "../hooks/useAuthContext";
import { adminAccountAll, adminAccountEditRole, organisationAll } from "../apis/exportedAPIs";

export default function AdminModeration() {
    const { user } = useAuthContext();

    const [searchField, setSearchField] = useState('');

    const [allOrganisations, setAllOrganisations] = useState(null);
    const [allOrganisationNames, setAllOrganisationNames] = useState([]);
    const [allUsers, setAllUsers] = useState(null);

    const [viewingUserMode, setViewingUserMode] = useState(false);
    const [userIndex, setUserIndex] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const [userModerates, setUserModerates] = useState([]);
    const [newUserModerates, setNewUserModerates] = useState([]);

    useEffect(() => {
        async function fetchAllUsers() {
            const response = await adminAccountAll();
            const json = await response.json();
    
            if (response.ok) {
                setAllUsers(json.accounts);
                console.log(json.accounts);
            } else {
                toast.error(json.error);
            }
        }
        async function fetchAllOrganisations() {
            const response = await organisationAll({
                category: "",
            });
            const json = await response.json();
    
            if (response.ok) {
                setAllOrganisations(json.organisations);
                setAllOrganisationNames(json.organisations.map(item => item.name));
                console.log(json.organisations);
            } else {
                toast.error(json.error);
            }
        }

        fetchAllOrganisations();
        fetchAllUsers();
    }, []);

    function GenerateUsers() {
        let tableData = [];
        allUsers ?
        allUsers.map((item) => {
            tableData.push({ 
                name: item.name, 
                email: item.email, 
                role: <UserType type={ item.isAdmin ? "administrator" : item.moderation.length > 0 ? "moderator" : "user" } /> 
            });
        })
        :
        tableData = [];

        return tableData;
    }

    function HandleLoadUser(e) {
        setUsername(allUsers[e].name);
        setUserRole(allUsers[e].isAdmin ? "administrator" : allUsers[e].moderation.length > 0 ? "moderator" : "user");
        setUserId(allUsers[e]._id);

        const moderatedId = allUsers[e].moderation;
        const moderatedNames = allOrganisations.filter(item => moderatedId.includes(item._id));
        setUserModerates(moderatedNames);

        setViewingUserMode(true);
    }

    async function handleModerationSubmit(e) {
        e.preventDefault();

        const foundUser = allUsers.find(item => item._id === userId);
        const foundUserRole = foundUser.isAdmin ? "administrator" : foundUser.moderation.length > 0 ? "moderator" : "user";

        if (foundUserRole === userRole && userRole !== "moderator") {
            toast.error("Same role selected!");
            return;
        }
        
        if (new Set(userModerates).size !== userModerates.length) {
            toast.error("Please do not select the same organisation more than once!");
            return;
        }

        console.log(userRole);
        console.log(userModerates);
        // const response = await adminAccountEditRole({
        //     account: userId,
        //     role: userRole,
        //     moderation: userModerates,
        // });

        // const json = await response.json();

        // if (response.ok) {
        //     toast.success(`The user ${username} has been given the new role of a ${userRole}!`);
        //     if (userRole === "moderator") {
        //         console.log(userModerates);
        //     }
        // } else {
        //     toast.error(json.error);
        // }
        setViewingUserMode(false);
    }

    return (
        <Layout>
            <section className="flex flex-col">
                <Banner image={BannerImage} title="Moderation" />

                <div className="w-1/5 pt-2">
                    <SearchField title="Search By Name" bottomPadding={0} value={searchField} onChange={(e) => { setSearchField(e.target.value); }} />
                </div>

                <div className="flex flex-grow pt-2 gap-2">
                    <div className="w-full">
                       { allUsers && allUsers.length > 0 ? 
                       <Table rows={GenerateUsers()} title="Users" onClick={(e) => HandleLoadUser(e.target.parentElement.getAttribute('data-index'))} nullData="Users" /> 
                       : <h1 className="grow text-text-primary py-4 text-3xl text-center">🍍No Users Here🍍</h1> }
                    </div>
                </div>
            </section>

            <Popup title={`Editing User ${username}`}
                variableThatDeterminesIfPopupIsActive={viewingUserMode}
                setVariableThatDeterminesIfPopupIsActive={setViewingUserMode}
                onSubmit={handleModerationSubmit}
            >
                <StandardDropdown title="Role" titleLocation="top" options={['user', 'moderator', 'administrator']}
                    value={userRole} onChange={(e) => { setUserRole(e.target.value); }} />

                {userRole === 'moderator' &&
                    <div className="flex flex-col space-y-2 py-2">
                        <div className="flex flex-row space-x-2 justify-center items-center">
                            <span className="grow text-text-primary">Moderator Of</span>
                            <button onClick={(e) => {
                                e.preventDefault();
                                let workingArray = [...userModerates];
                                workingArray.push(userModerates);
                                console.log(workingArray);
                                setUserModerates(workingArray);
                            }}><PlusCircleIcon className="h-8 w-8 text-text-primary" /></button>
                        </div>

                        {userModerates.map((organisation, i) => (
                            <div className="flex flex-row space-x-2 justify-center items-center">
                                <div className="grow">
                                {console.log(organisation)}
                                    <StandardDropdown
                                        title={"moderator-" + i}
                                        value={organisation}
                                        titleLocation="none"
                                        bottomPadding={0}
                                        options={allOrganisationNames}
                                        onChange={(e) => {
                                            let workingArray = [...userModerates];
                                            workingArray[i] = e.target.value;
                                            console.log(i);
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
