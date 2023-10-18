// React / Packages
import React from "react";

// Components
import { RoundedButton } from './Buttons';
import { Divider } from './Miscellaneous';

// Assets
import { CakeIcon } from "@heroicons/react/24/solid";
import Sample2 from "../assets/sample-mental.png";

// API
// ~

export default function SideBarOrganisationInfo(props) {
    const { organisationName, organisationDescription, createDate, numberPosts, numberMembers } = props;

    return (
        <section className="rounded-tr-lg rounded-br-lg h-fit w-96 bg-theme-primary">
            <div className="flex h-44 bg-cover bg-center bg-no-repeat outline-none rounded-tr-lg" style={{ backgroundImage: `url(${Sample2})` }}>
                <div className="h-full w-full p-4 bg-gradient-to-t from-theme-primary flex items-end">
                    <h2 className="text-text-primary text-3xl font-semibold overflow-hidden">{organisationName}</h2>
                </div>
            </div>
            <div className="flex flex-col gap-4 p-4">
                <div className="text-text-primary text-sm">
                    {organisationDescription}
                </div>
                <div className="flex text-text-secondary items-center gap-1">
                    <CakeIcon className="h-4" />
                    <div className=" text-sm">
                        Created: {createDate}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 px-4 py-2">
                <div className="flex flex-col">
                    <div className="text-text-primary">
                        {numberPosts}
                    </div>
                    <div className="text-text-secondary text-sm">
                        Posts
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="text-text-primary">
                        {numberMembers}
                    </div>
                    <div className="text-text-secondary text-sm">
                        Members
                    </div>
                </div>
            </div>

            <Divider padding={2}/>

            <div className="px-2 py-2">
                <RoundedButton title="Join" />
            </div>
        </section>
    );
};
