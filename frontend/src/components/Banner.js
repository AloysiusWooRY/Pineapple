import React from "react";

const Banner = ({ image, title, custom = null }) => {

    const { icon: PlusCircleIcon, text, handleClick } = custom || {}

    return (
        <div className="flex h-36 bg-cover bg-center bg-no-repeat outline-none rounded-tr-lg" style={{ backgroundImage: `url(${image})` }}>
            <div className="h-full w-full p-4 bg-gradient-to-t from-theme-primary flex items-end">
                <h2 className="text-white text-6xl">{title}</h2>
                {
                    custom &&
                    <div className="flex flex-grow items-end justify-end">
                        <button type="button" className="flex w-fit text-white px-4 py-2 rounded bg-neutral-800 items-center" onClick={handleClick}>
                            <PlusCircleIcon className="h-7 w-7 mr-2" />
                            Create New
                        </button>
                    </div>
                }

            </div>

        </div>
    );
}

export default Banner;
