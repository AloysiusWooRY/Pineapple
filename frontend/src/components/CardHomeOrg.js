// React / Packages
import React from "react";
import { OrganisationType } from "./Miscellaneous";

// Components
import { textNerfer } from "./componentUtils";

// Assets
// ~

// API
// ~

export default function CardHomeOrg(props) {
    const { image, name, posts, category } = props;

    return (
        <a
            id={"card-org-" + textNerfer(name)}
            className="h-fit w-fit flex flex-col rounded outline-none gap-1 p-2 no-underline cursor-pointer hover:bg-background-minor">
            <img src={image} className="h-72 w-52 shrink-0 rounded object-cover object-center" />
            <div className="w-full flex flex-col justify-center flex-shrink">
                <div className="w-full flex">
                    <span className="w-full text-text-primary overflow-hidden text-sm whitespace-nowrap">
                        {name}
                    </span>
                </div>
                <div className="flex pb-1 items-center text-xs text-text-secondary">
                    {posts} Posts
                </div>
                <OrganisationType type={category} />
            </div>
        </a>
    );
}
