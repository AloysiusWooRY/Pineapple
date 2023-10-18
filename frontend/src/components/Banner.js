// React / Packages
import React from "react";

// Components
// ~

// Assets
// ~

// API
// ~

import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

export default function Banner(props) {
    const { title, image, button = {} } = props;
    const { icon: heroIcon = <QuestionMarkCircleIcon />, text = "Uninitialised!", onClick = null } = button;

    return (
        <div className="flex h-36 bg-cover bg-center bg-no-repeat outline-none rounded-tr-lg" style={{ backgroundImage: `url(${image})` }}>
            <div className="h-full w-full p-4 bg-gradient-to-t from-theme-primary flex items-end">
                <h2 className="text-text-primary text-6xl">{title}</h2>
                {
                    Object.keys(button).length > 0 &&
                    <div className="flex flex-grow items-end justify-end">
                        <button type="button" className="flex w-fit text-text-primary px-4 py-2 rounded bg-neutral-800 items-center" onClick={onClick}>
                            {heroIcon && React.cloneElement(heroIcon, { className: "h-4 w-4 mr-2" })}
                            {text}
                        </button>
                    </div>
                }

            </div>
        </div>
    );
}
