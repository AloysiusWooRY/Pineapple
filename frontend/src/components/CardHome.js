import React from "react";

const CardHome = ({ image, title, organisation, category, type }) => {

    return (
        <a className="w-full flex rounded outline-none gap-2 p-2 no-underline cursor-pointer hover:bg-white/5">
            <img src={image} className="h-36 basis-28 shrink-0 rounded object-cover object-center" />
            <div className="w-[calc(100vh-8rem)] flex flex-col justify-center gap-1 flex-shrink">
                <div className="w-full flex gap-1">
                    <span className="w-full text-white text-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                        {title}
                    </span>
                </div>
                <div className="flex items-center text-sm text-neutral-400">
                    {organisation}
                </div>
                <div className="flex items-center text-sm gap-1 text-neutral-400">
                    <span className="text-[#ffdc00]">
                        {category}
                    </span>· {type}
                </div>
            </div>
        </a>
    );
}

export default CardHome;
