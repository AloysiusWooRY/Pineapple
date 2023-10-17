import React, { useState } from "react";

import { QuestionMarkCircleIcon, PencilIcon, PaperAirplaneIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

export function ToggleButton(props) {
    const { active, onClick } = props;

    return (
        <div>
            <button type="button" className={`flex w-fit items-center text-white px-4 py-2 rounded ${!active ? 'bg-neutral-800' : 'bg-green-800'}`}
                onClick={onClick}>
                {!active ? <><PencilIcon className="h-4 w-4 mr-2" />Edit</> : <><PaperAirplaneIcon className="h-4 w-4 mr-2" />Submit</>}
            </button>
        </div>
    );
};

export function RectangleButton(props) {
    const { title, forForm = null, heroIcon = <QuestionMarkCircleIcon />, colour = 'bg-neutral-800', onClick = null } = props;

    return (
        <div className="align-middle">
            <button type={!forForm ? "button" : "submit"} className={`flex w-full justify-center items-center text-white px-4 py-2 rounded ${colour}`}
                value={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                onClick={onClick}>
                {heroIcon && React.cloneElement(heroIcon, { className: "h-4 w-4 mr-2" })}
                {title}
            </button>
        </div>
    );
};

export function RoundedButton(props) {
    const { title, colour = 'bg-white', onClick } = props;

    return (
        <div>
            <button className={`w-full py-1 rounded-full ${colour} font-sans font-bold`}
                value={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                onClick={onClick}>
                {title}
            </button>
        </div>
    );
}

export function StandardDropdown(props) {
    const { title, titleLocation = 'side', options = ['Uninitialised!'], onChange } = props;

    function IterateOptions() {
        let formattedOptions = [];

        for (let i = 0; i < options.length; i++) {
            formattedOptions.push(
                <option className="text-white font-sans bg-theme-primary"
                    key={options[i].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                    value={options[i].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                >{options[i]}</option>
            );
        }

        return formattedOptions;
    }

    switch (titleLocation) {
        case 'side':
            return (
                <div className="flex flex-row items-center pb-2">
                    <span className="min-w-fit p-2 text-sm text-white">{title}</span>
                    <div className="flex w-full bg-white/5 border-white/10 rounded relative">
                        <select id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
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
        case 'top':
            return (
                <div className="flex flex-col pb-2">
                    <span className="min-w-fit p-2 text-sm text-white">{title}</span>
                    <div className="flex w-full bg-white/5 border-white/10 rounded relative">
                        <select id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
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
        default:
            return (
                <div className="pb-2">
                    <div className="flex w-full bg-white/5 border-white/10 rounded relative">
                        <select id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
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
    }
};

export function Tabs(props) {
    const { tabs = ['Uninitialised!'], heroIconsArr = [<QuestionMarkCircleIcon />], onClick } = props;

    const [activeTab, setActiveTab] = useState(0);

    function IterateTabs() {
        let formattedTabs = [];

        for (let i = 0; i < tabs.length; i++) {
            formattedTabs.push(
                <li 
                className="mr-2"
                key={"tab-" + tabs[i].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                >
                    <a href="#" data-value={tabs[i].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} onClick={(e) => { setActiveTab(i); onClick(e); }}
                        className={`inline-flex items-center justify-center py-2 px-4 group gap-2 text-lg border-b-2 
                                ${i === activeTab ? 'border-yellow-300 text-yellow-300 rounded-t-lg hover:text-yellow-300 hover:border-gray-300 bg-theme-primary' :
                                'border-transparent rounded-t-lg hover:text-orange-500 hover:border-gray-300'}`}
                    >
                        {heroIconsArr[i] && React.cloneElement(heroIconsArr[i], { className: "w-4" })} {tabs[i]}
                    </a>
                </li>
            );
        }

        return formattedTabs;
    }

    return (
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-400">
            {/* {tabs && tabs.map((tab, i) => (
                <li className="mr-2">
                    <a href="#" data-value={tab.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} onClick={(e) => { setActiveTab(i); onClick(e); }}
                        className={`inline-flex items-center justify-center py-2 px-4 group gap-2 text-lg border-b-2 
                            ${i === activeTab ? 'border-[#ffdc00] text-[#ffdc00] rounded-t-lg hover:text-gray-600 hover:border-gray-300 bg-theme-primary' :
                                'border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'}`}
                    >
                        {heroIconsArr[i] && React.cloneElement(heroIconsArr[i], { className: "w-4" })} {tab}
                    </a>
                </li>
            ))} */}
            <IterateTabs />
        </ul>
    );
}
