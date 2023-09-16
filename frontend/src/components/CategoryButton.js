import React from "react";

const CategoryButton = ({ image, title, icon: IconComponent }) => {


    return (
        <button className="relative flex flex-col items-center justify-center gap-1 border-1 border-white/10 outline-none rounded-lg cursor-pointer">
            <div className="absolute h-full w-full rounded-lg bg-cover bg-center left-0 right-0 z-10 opacity-30 transition-opacity hover:opacity-60" style={{ backgroundImage: `url(${image})` }} />
            <div className="relative z-20 text-white w-12 h-12">
                <IconComponent />
            </div>

            <span className="text-white z-20 text-sm">{title}</span>
        </button>
    );
}

export default CategoryButton;
