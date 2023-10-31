// React / Packages
import React from "react";

// Components
import { textNerfer } from "./componentUtils";

// Assets
// ~

// API
// ~

export default function CardHome(props) {
    const { image, title, organisation, category } = props;

    return (
        <a
            id={"card-home-" + textNerfer(title)}
            className="w-full flex rounded outline-none gap-2 p-2 no-underline cursor-pointer hover:bg-background-minor">
            <img src={image} className="h-36 basis-28 shrink-0 rounded object-cover object-center" />
            <div className="w-[calc(100vh-8rem)] flex flex-col justify-center gap-1 flex-shrink">
                <div className="w-full flex gap-1">
                    <span className="w-full text-text-primary text-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                        {title}
                    </span>
                </div>
                <div className="flex items-center text-sm text-text-yellow-pineapple">
                    {organisation}
                </div>
                <div className="flex items-center text-sm gap-1 text-text-green-pineapple">
                    {category}
                </div>
            </div>
        </a>
    );
}
