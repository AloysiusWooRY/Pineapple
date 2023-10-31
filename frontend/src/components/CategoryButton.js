// React / Packages
import React from "react";

// Components
// ~

// Assets
// ~

// API
// ~

// THIS PAGE IS DEPRECATED

export default function CategoryButton(props) {
    const { image, title, icon: IconComponent } = props;

    return (
        <button className="relative flex flex-col items-center justify-center gap-1 border-1 border-white/10 outline-none rounded-lg cursor-pointer">
            <div className="absolute h-full w-full rounded-lg bg-cover bg-center left-0 right-0 z-10 opacity-30 transition-opacity hover:opacity-60"
                style={{ backgroundImage: `url(${image})` }} />
            <div className="relative z-20 text-text-primary w-16 h-16">
                <IconComponent />
            </div>

            <span className="text-text-primary z-20">{title}</span>
        </button>
    );
}
