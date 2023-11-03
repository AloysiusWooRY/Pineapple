// React / Packages
import React from "react";
import { OrganisationType } from "./Miscellaneous";

// Components
import { constructResourceURL } from "./componentUtils";

// Assets
// ~

// API
// ~

export default function CardHomeOrg(props) {
    const { organisationContent } = props;

    return (
        <a
            id={"card-org-" + organisationContent.id}
            href={`/organisation/${organisationContent.id}`}
            className="h-fit w-fit flex flex-col rounded outline-none gap-1 p-2 no-underline cursor-pointer hover:bg-background-minor">
            <div className="h-72 w-52 shrink-0 bg-cover bg-center rounded"
                style={{ backgroundImage: constructResourceURL(organisationContent.posterPath) }}></div>
            <div className="w-full flex flex-col justify-center flex-shrink">
                <div className="w-full flex">
                    <span className="w-full text-text-primary overflow-hidden text-sm whitespace-nowrap">
                        {organisationContent.name}
                    </span>
                </div>
                <div className="flex pb-1 items-center text-xs text-text-secondary">
                    {organisationContent.posts} Posts
                </div>
                <OrganisationType type={organisationContent.category} />
            </div>
        </a>
    );
}
