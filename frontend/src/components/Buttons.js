// React / Packages
import React, { useState } from "react";

// Components
// ~

// Assets
// ~

// API
// ~

import { QuestionMarkCircleIcon, PencilIcon, PaperAirplaneIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

export function ToggleButton(props) {
    const { active, onClick } = props;

    return (
        <div>
            <button type="button" className={`flex w-fit items-center text-text-primary px-4 py-2 rounded ${!active ? 'bg-button-neutral' : 'bg-button-green'}`}
                onClick={onClick}>
                {!active ? <><PencilIcon className="h-4 w-4 mr-2" />Edit</> : <><PaperAirplaneIcon className="h-4 w-4 mr-2" />Submit</>}
            </button>
        </div>
    );
};

export function RectangleButton(props) {
    const { title, forForm = null, heroIcon = <QuestionMarkCircleIcon />, colour = 'bg-button-neutral', onClick = null } = props;

    return (
        <div className="align-middle">
            <button type={!forForm ? "button" : "submit"} className={`flex w-full justify-center items-center text-text-primary px-4 py-2 rounded ${colour}`}
                value={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                onClick={onClick}>
                {heroIcon && React.cloneElement(heroIcon, { className: "h-4 w-4 mr-2" })}
                {title}
            </button>
        </div>
    );
};

export function RoundedButton(props) {
    const { title, colour = 'bg-button-white', onClick } = props;

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
    const { title, titleLocation = 'side', width = 'full', bottomPadding = 4, options = ['Uninitialised!'], onChange } = props;

    function IterateOptions() {
        let formattedOptions = [];

        for (let i = 0; i < options.length; i++) {
            formattedOptions.push(
                <option className="text-text-primary font-sans bg-input-background-neutral"
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
                <div className={`flex flex-row items-center pb-${bottomPadding}`}>
                    <span className="min-w-fit grow-0 px-2 text-sm text-text-primary">{title}</span>

                    <div className="flex flex-row grow bg-input-background-neutral rounded-sm">
                        <div className="grow rounded-sm text-text-primary">
                            <select id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                                onChange={onChange}
                                className={`p-2 w-${width} bg-transparent appearance-none`}>
                                {<IterateOptions />}
                            </select>
                        </div>
                        <button className="items-center pr-2" type="button">
                            <ChevronDownIcon className="h-6 text-text-primary" />
                        </button>
                    </div>
                </div>
            );
        case 'top':
            return (
                <div className={`flex flex-col pb-${bottomPadding}`}>
                    <span className="min-w-fit grow-0 py-2 text-sm text-text-primary">{title}</span>

                    <div className="flex flex-row grow bg-input-background-neutral rounded-sm">
                        <div className="grow rounded-sm text-text-primary">
                            <select id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                                onChange={onChange}
                                className={`p-2 w-${width} bg-transparent appearance-none`}>
                                {<IterateOptions />}
                            </select>
                        </div>
                        <button className="items-center pr-2" type="button">
                            <ChevronDownIcon className="h-6 text-text-primary" />
                        </button>
                    </div>
                </div>
            );
        default:
            return (
                <div className={`flex flex-row items-center pb-${bottomPadding}`}>
                    <div className="flex flex-row grow bg-input-background-neutral rounded-sm">
                        <div className="grow rounded-sm text-text-primary">
                            <select id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                                onChange={onChange}
                                className={`p-2 w-${width} bg-transparent appearance-none`}>
                                {<IterateOptions />}
                            </select>
                        </div>
                        <button className="items-center pr-2" type="button">
                            <ChevronDownIcon className="h-6 text-text-primary" />
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
                                ${i === activeTab ? 'border-text-yellow-pineapple text-text-yellow-pineapple' :
                                'border-transparent text-text-disabled hover:border-text-green-pineapple hover:text-text-green-pineapple'}`}
                    >
                        {heroIconsArr[i] && React.cloneElement(heroIconsArr[i], { className: "w-4" })} {tabs[i]}
                    </a>
                </li>
            );
        }

        return formattedTabs;
    }

    return (
        <ul className="flex flex-wrap text-center">
            <IterateTabs />
        </ul>
    );
}
