// React / Packages
import React from "react";

// Components
import { RoundedButton } from './Buttons';
import { Divider } from './Miscellaneous';

// Assets
import { CakeIcon, MegaphoneIcon } from "@heroicons/react/24/solid";
import Sample2 from "../assets/sample-mental.png";

// API
// ~

export default function SideBarOrganisationInfo(props) {
    const { organisationName, organisationDescription, createDate, numberPosts, numberMembers, onCreateClicked, imagePath = null } = props;

    return (
        <section className="rounded-tr-lg rounded-br-lg h-fit w-96 bg-theme-primary">
            {/* imagePath? imagePath: Sample2 */}
            <div className="flex h-44 bg-cover bg-center bg-no-repeat outline-none rounded-tr-lg" style={{ backgroundImage: `url(${Sample2})` }}>
                <div className="h-full w-full p-4 bg-gradient-to-t from-theme-primary flex items-end">
                    <h2 className="text-text-primary text-3xl font-semibold overflow-hidden organisation-name">{organisationName}</h2>
                </div>
            </div>
            <div className="flex flex-col text-text-primary text-sm gap-4 p-4 organisation-description">
                {organisationDescription}

                <div className="flex items-center gap-1">
                    <CakeIcon className="h-4" />
                    <div className="flex flex-row text-sm gap-1">
                        <p className="text-text-secondary organisation-create-date">Created:</p> {createDate}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <MegaphoneIcon className="h-4" />
                    <div className="flex flex-row text-sm gap-1 organisation-post-count">
                        {numberPosts} <p className="text-text-secondary">Posts</p>
                    </div>
                </div>
            </div>

            <Divider padding={0} />

            <div className="px-2 py-2">
                <RoundedButton title="Create Post" onClick={onCreateClicked} />
            </div>
        </section>
    );
};
