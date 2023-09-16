import React from "react";

const CardHomeOrg = ({ image, name, members, type }) => {

    return (
        <a className="h-fit w-fit flex flex-col rounded outline-none gap-1 p-2 no-underline cursor-pointer hover:bg-white/5">
            <img src={image} className="h-72 w-52 shrink-0 rounded object-cover object-center" />
            <div className="w-full flex flex-col justify-center flex-shrink">
                <div className="w-full flex">
                    <span className="w-full text-white overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                        {name}
                    </span>
                </div>
                <div className="flex pb-1 items-center text-xs text-neutral-400">
                    {members} Members
                </div>
                <div className="flex items-center text-xs gap-1 text-neutral-400">
                    <span className="rounded-full bg-white/5 px-2 py-[0.5px]">
                        {type}
                    </span>
                </div>
            </div>
        </a>
    );
}

export default CardHomeOrg;
