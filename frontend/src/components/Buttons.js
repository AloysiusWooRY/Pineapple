import React from "react";

import { QuestionMarkCircleIcon, PencilIcon, PaperAirplaneIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

export function ToggleButton(props) {
    const { active, onClick } = props;

    return (
        <div>
            <button type="button" className={`flex w-fit text-white px-4 py-2 rounded ${!active ? 'bg-neutral-800' : 'bg-green-800'} items-center`}
                onClick={onClick}>
                {!active ? <><PencilIcon className="h-4 w-4 mr-2" />Edit</> : <><PaperAirplaneIcon className="h-4 w-4 mr-2" />Submit</>}
            </button>
        </div>
    );
};

export function StandardButton(props) {
    const { title, heroIcon = <QuestionMarkCircleIcon />, onClick } = props;

    return (
        <div>
            <button type="button" className={`flex w-fit text-white px-4 py-2 rounded bg-neutral-800 items-center`}
                onClick={onClick}>
                {heroIcon && React.cloneElement(heroIcon, { className: "h-4 w-4 mr-2" })}
                {title}
            </button>
        </div>
    );
};

export function StandardDropdown(props) {
    const { title, options = ['Uninitialised!'], onChange } = props;

    function IterateOptions() {
        let formattedOptions = [];


        for (var i = 0; i < options.length; i++) {
            formattedOptions.push(
                <option className="text-white bg-theme-primary"
                    value={options[i].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                >{options[i]}</option>
            );
        }

        return formattedOptions;
    }

    return (
        <div className="flex items-center">
            <span className="text-white">{title}</span>
            <div className="flex w-60 bg-white/5 border-white/10 rounded relative ml-2">
                <select id="sort"
                    onChange={onChange}
                    className="h-9 z-10 w-full bg-transparent text-white border-none outline-none px-2 font-medium appearance-none cursor-pointer">
                    {<IterateOptions />}
                </select>
                <button className="h-9 w-8 flex items-center justify-center bg-transparent border-none outline-none rounded p-0 absolute right-0 top-0"
                    type="button">
                    <ChevronDownIcon className="h-5 w-4 text-white" />
                </button>
            </div>
        </div>
    );
};