// React / Packages
import React, { useState } from "react";

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import Table from "../components/Table";
import { RoundedButton, StandardDropdown } from "../components/Buttons";
import { SearchField } from "../components/Inputs";
import { UserType } from "../components/Miscellaneous";

// Assets
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/banner-admin-moderation.png";

// API
import { useAuthContext } from "../hooks/useAuthContext";

export default function AdminModeration() {
    const { user } = useAuthContext();

    const [searchField, setSearchField] = useState('');

    function GenerateUsers() {
        const tableData = [
            { name: 'John Xina', email: 'jxina@hotmail.com', role: <UserType type="user" /> },
            { name: 'The Wok', email: 'twok@gmail.com', role: <UserType type="moderator" /> },
            { name: 'Bing Chilling', email: 'bchill@outlook.com', role: <UserType type="administrator" /> }
        ];

        return tableData;
    }

    return (
        <Layout>
            <section className="flex flex-col">
                <Banner image={BannerImage} title="Moderation" />

                <div className="w-1/5 pt-2">
                        <SearchField title="Search By Name" bottomPadding={0} value={searchField} onChange={(e) => { setSearchField(e.target.value); }}/>
                    </div>

                <div className="flex flex-grow pt-2 gap-2">
                    <div className="w-full">
                        <Table rows={GenerateUsers()} title="Users" onClick={(e) => { console.log(e.target.parentElement.id); }} />
                    </div>

                    <section className="flex flex-col gap-2 p-2 rounded-tr-lg rounded-br-lg h-fit w-[32rem] bg-theme-primary overflow-hidden whitespace-nowrap">
                        <div className="flex w-full gap-2 items-center">
                            <h2 className="text-text-primary text-3xl font-semibold flex-grow truncate">
                                John Xina
                            </h2>
                        </div>

                        <hr className="border-t-neutral-600" />

                        <div className="grow">
                            <StandardDropdown title="Role" titleLocation="top"
                                options={['User', 'Moderator', 'Administrator']} onChange={(e) => { console.log(e.target.value); }} />

                            <div className="flex flex-col py-2">
                                <div className="flex flex-row p-2 items-center">
                                    <span className="grow text-sm text-text-primary">Moderator Of</span>
                                    <button><PlusCircleIcon className="h-8 text-text-primary" /></button>
                                    <button><MinusCircleIcon className="h-8 text-text-primary" /></button>
                                </div>

                                <StandardDropdown title="Moderator 1" titleLocation="none"
                                    options={['Organisation-1', 'Organisation-2', 'Organisation-3']} onChange={(e) => { console.log(e.target.value); }} />
                                <StandardDropdown title="Moderator 2" titleLocation="none"
                                    options={['Organisation-1', 'Organisation-2', 'Organisation-3']} onChange={(e) => { console.log(e.target.value); }} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 m-2">
                            <RoundedButton title="Save" />
                            <RoundedButton title="Delete" />
                            <RoundedButton title="Cancel" />
                        </div>
                    </section>
                </div>
            </section>
        </Layout >
    )
}
