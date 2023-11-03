// React / Packages
import React from "react";
import { useNavigate } from "react-router-dom";

// Components
import { FormatDateTime, constructResourceURL } from "./componentUtils";
import { RoundedButton } from './Buttons';
import { Divider } from './Miscellaneous';

// Assets
import { CakeIcon, MegaphoneIcon } from "@heroicons/react/24/solid";

// API
// ~

export default function SideBarOrganisationInfo(props) {
    const { organisationContent } = props;
    const navigate = useNavigate();

    return (
        <section className="rounded-tr-lg rounded-br-lg h-fit w-96 bg-theme-primary">
            <div className="flex h-44 bg-cover bg-center bg-no-repeat outline-none rounded-tr-lg"
                style={{ backgroundImage: constructResourceURL(organisationContent.posterPath) }}
            >
                <div className="h-full w-full p-4 bg-gradient-to-t from-theme-primary flex items-end cursor-pointer"
                    onClick={() => navigate(`/organisation/${organisationContent._id}`)}>
                    <h2 className="text-text-primary text-3xl font-semibold overflow-hidden organisation-name">{organisationContent.name}</h2>
                </div>
            </div>
            <div className="flex flex-col text-text-primary text-sm gap-4 p-4 organisation-description">
                {organisationContent.description}

                <div className="flex items-center gap-1">
                    <CakeIcon className="h-4" />
                    <div className="flex flex-row text-sm gap-1">
                        <p className="text-text-secondary organisation-create-date">Created:</p> {FormatDateTime(organisationContent.createDate)}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <MegaphoneIcon className="h-4" />
                    <div className="flex flex-row text-sm gap-1 organisation-post-count">
                        {organisationContent.posts} <p className="text-text-secondary">Posts</p>
                    </div>
                </div>
            </div>

            <Divider padding={0} />

            <div className="px-2 py-2">
                <RoundedButton title="Create Post" onClick={() => navigate(`/organisation/${organisationContent._id}/post/new`)} />
            </div>
        </section>
    );
};
