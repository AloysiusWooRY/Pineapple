import React from "react";

export function PostType(props) {
    const { type } = props;

    switch (type.toLowerCase()) {
        case 'discussion':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-[#EC8100]">
                    Discussion
                </div>
            );
        case 'event':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-[#681a64]">
                    Event
                </div>
            );
        case 'donation':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-[#104d24]">
                    Donation
                </div>
            );
        default:
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-gray-500">
                    {type}
                </div>
            );
    }
};