import React from "react";

const Banner = ({ image, title }) => {

    return (
        <div className="flex h-36 bg-cover bg-center bg-no-repeat outline-none rounded-tr-lg" style={{ backgroundImage: `url(${image})` }}>
            <div className="h-full w-full p-4 bg-gradient-to-t from-theme-primary flex items-end">
                <h2 className="text-white text-6xl">{title}</h2>
            </div>
        </div>
    );
}

export default Banner;
