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

    const [allOrganisations, setAllOrganisations] = useState(['Org-1', 'Org-2', 'Org-3']);
    const [allUsers, setAllUsers] = useState(null);

    const [viewingUserMode, setViewingUserMode] = useState(false);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('John Xina');
    const [userRole, setUserRole] = useState('administrator');
    const [userModerates, setUserModerates] = useState(['Org-1', 'Org-3']);

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
            const response = await organisationAll();
            const json = response.json();
    
            if (response.ok) {
                setAllUsers(json.organisations);
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

        setViewingUserMode(true);
    }

    async function handleModerationSubmit(e) {
        e.preventDefault();

        const foundUser = allUsers.find(item => item._id === userId);
        const foundUserRole = foundUser.isAdmin ? "administrator" : foundUser.moderation.length > 0 ? "moderator" : "user";

        if (foundUserRole === userRole) {
            toast.error("Same role selected!");
            return;
        }

        console.log(userRole);
        const response = await adminAccountEditRole({
            account: userId,
            role: userRole,
            moderation: userModerates,
        });

        const json = await response.json();

        if (response.ok) {
            toast.success(`The user ${username} has been given the new role of a ${userRole}!`);
        } else {
            toast.error(json.error);
        }
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
                                workingArray.push(allOrganisations[0]);
                                setUserModerates(workingArray);
                            }}><PlusCircleIcon className="h-8 w-8 text-text-primary" /></button>
                        </div>

                        {userModerates.map((organisation, i) => (
                            <div className="flex flex-row space-x-2 justify-center items-center">
                                <div className="grow">
                                    <StandardDropdown
                                        title={'moderator-' + i}
                                        value={organisation}
                                        titleLocation="none"
                                        bottomPadding={0}
                                        options={allOrganisations}
                                        onChange={(e) => {
                                            let workingArray = [...userModerates];
                                            workingArray[i] = e.target.value;
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
