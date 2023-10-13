import React from 'react';

import { CakeIcon } from "@heroicons/react/24/solid";

import Sample2 from "../assets/sample-mental.png";

export default function SideBarOrganisationInfo(props) {
    const { organisationName, organisationDescription, createDate, numberPosts, numberMembers } = props;

    return (
        <section className="rounded-tr-lg rounded-br-lg h-fit w-96 bg-theme-primary">
            <div className="flex h-44 bg-cover bg-center bg-no-repeat outline-none rounded-tr-lg" style={{ backgroundImage: `url(${Sample2})` }}>
                <div className="h-full w-full p-4 bg-gradient-to-t from-theme-primary flex items-end">
                    <h2 className="text-white text-3xl font-semibold overflow-hidden">{organisationName}</h2>
                </div>
            </div>
            <div className="flex flex-col gap-4 p-4">
                <div className="text-white text-sm">
                    {organisationDescription}
                </div>
                <div className="flex text-neutral-500 items-center gap-1">
                    <CakeIcon className="h-4" />
                    <div className=" text-sm">
                        Created: {createDate}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 px-4 py-2">
                <div className="flex flex-col">
                    <div className="text-white">
                        {numberPosts}
                    </div>
                    <div className="text-neutral-500 text-sm">
                        Posts
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="text-white">
                        {numberMembers}
                    </div>
                    <div className="text-neutral-500 text-sm">
                        Members
                    </div>
                </div>
            </div>
            <hr className="m-2 border-t-neutral-600" />
            <div className="px-4 py-2 mb-2">
                <button className="w-full py-1 rounded-full bg-white font-sans font-bold">
                    Join
                </button>
            </div>
        </section>
    );
};
