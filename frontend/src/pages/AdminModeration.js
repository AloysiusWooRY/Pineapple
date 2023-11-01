// React / Packages
import React, { useState } from "react";

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import Table from "../components/Table";
import Popup from "../components/Popup";
import { RoundedButton, StandardDropdown } from "../components/Buttons";
import { SearchField } from "../components/Inputs";
import { UserType } from "../components/Miscellaneous";

// Assets
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/banner-admin-moderation.png";

// API
import { useAuthContext } from "../hooks/useAuthContext";
import { adminAccountAll } from "../apis/Collections/adminAPIs";

export default function AdminModeration() {
    const { user } = useAuthContext();

    const [searchField, setSearchField] = useState('');

    const [allOrganisations, setAllOrganisations] = useState(['Org-1', 'Org-2', 'Org-3']);

    const [viewingUserMode, setViewingUserMode] = useState(false);
    const [username, setUsername] = useState('John Xina');
    const [userRole, setUserRole] = useState('administrator');
    const [userModerates, setUserModerates] = useState(['Org-1', 'Org-3']);

    function GenerateUsers() {
        const tableData = [
            { name: 'John Xina', email: 'jxina@hotmail.com', role: <UserType type="user" /> },
            { name: 'The Wok', email: 'twok@gmail.com', role: <UserType type="moderator" /> },
            { name: 'Bing Chilling', email: 'bchill@outlook.com', role: <UserType type="administrator" /> }
        ];

        return tableData;
    }

    function HandleLoadUser(e) {
        setUsername(e);

        setViewingUserMode(true);
    }

    async function fetchData() {
        
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
                        <Table rows={GenerateUsers()} title="Users" onClick={(e) => HandleLoadUser(e.target.parentElement.getAttribute('data-index'))} />
                    </div>
                </div>
            </section>

            <Popup title={`Editing User ${username}`}
                variableThatDeterminesIfPopupIsActive={viewingUserMode}
                setVariableThatDeterminesIfPopupIsActive={setViewingUserMode}
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
