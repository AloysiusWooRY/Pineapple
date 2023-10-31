// React / Packages
import React, { useState } from "react";

// Components
import { textNerfer } from "./componentUtils";

// Assets
import { QuestionMarkCircleIcon, PencilIcon, PaperAirplaneIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

// API
// ~


export function ToggleButton(props) {
    const { title, active, onClick } = props;

    return (
        <>
            <button
                type="button"
                id={"toggle-button-" + textNerfer(title)}
                className={`flex w-fit items-center text-text-primary px-4 py-2 rounded ${!active ? 'bg-button-neutral' : 'bg-button-green'}`}
                onClick={onClick}>
                {!active ? <><PencilIcon className="h-4 w-4 mr-2" />Edit</> : <><PaperAirplaneIcon className="h-4 w-4 mr-2" />Submit</>}
            </button>
        </>
    );
};

export function RectangleButton(props) {
    const { title, forForm = null, heroIcon = <QuestionMarkCircleIcon />, colour = 'bg-button-neutral', onClick = null } = props;

    return (
        <>
            <button
                type={!forForm ? "button" : "submit"}
                id={"button-" + textNerfer(title)}
                className={`flex w-full justify-center items-center text-text-primary px-4 py-2 rounded ${colour}`}
                value={textNerfer(title)}
                onClick={onClick}>
                {heroIcon && React.cloneElement(heroIcon, { className: "h-4 w-4 mr-2" })}
                {title}
            </button>
        </>
    );
};

export function RoundedButton(props) {
    const { title, colour = 'bg-button-white', onClick } = props;

    return (
        <>
            <button
                type="button"
                id={"button-" + textNerfer(title)}
                className={`w-full px-2 py-1 rounded-full ${colour} border border-transparent hover:border-divider-color font-bold`}
                value={textNerfer(title)}
                onClick={onClick}>
                {title}
            </button>
        </>
    );
}

export function StandardDropdown(props) {
    const { title, titleLocation = 'side', width = 'full', bottomPadding = 4, options = ['Uninitialised!'], value, onChange } = props;

    function IterateOptions() {
        let formattedOptions = [];
        const nerfedTitle = textNerfer(title);

        for (let i = 0; i < options.length; i++) {
            formattedOptions.push(
                <option
                    className="text-text-primary capitalize font-sans bg-input-background-neutral"
                    id={"dropdown-" + nerfedTitle + "-option-" + textNerfer(options[i])}
                    key={"key-dropdown-" + nerfedTitle + "-option-" + textNerfer(options[i])}
                    value={options[i]}
                >{options[i]}</option>
            );
        }

        return formattedOptions;
    }

    switch (titleLocation) {
        case 'side':
            return (
                <div className={`flex flex-row items-center pb-${bottomPadding}`}>
                    <span className="min-w-fit grow-0 px-2 text-text-primary">{title}</span>

                    <div className="flex flex-row grow bg-input-background-neutral rounded-sm">
                        <div className="grow rounded-sm text-text-primary">
                            <select
                                id={"dropdown-" + textNerfer(title)}
                                value={value}
                                onChange={onChange}
                                className={`p-2 w-${width} capitalize bg-transparent appearance-none`}>
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
                    <span className="min-w-fit grow-0 py-2 text-text-primary">{title}</span>

                    <div className="flex flex-row grow bg-input-background-neutral rounded-sm">
                        <div className="grow rounded-sm text-text-primary">
                            <select
                                id={textNerfer(title)}
                                value={value}
                                onChange={onChange}
                                className={`p-2 w-${width} capitalize bg-transparent appearance-none`}>
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
                            <select
                                id={textNerfer(title)}
                                value={value}
                                onChange={onChange}
                                className={`p-2 w-${width} capitalize bg-transparent appearance-none`}>
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
    const { title, tabs = ['Uninitialised!'], heroIconsArr = [<QuestionMarkCircleIcon />], onClick } = props;

    const [activeTab, setActiveTab] = useState(0);

    function IterateTabs() {
        let formattedTabs = [];
        const nerfedTitle = textNerfer(title);

        for (let i = 0; i < tabs.length; i++) {
            formattedTabs.push(
                <li
                    className="mr-2"
                    id={"tab-" + nerfedTitle + "-option-" + textNerfer(tabs[i])}
                    key={"key-tab-" + nerfedTitle + "-option-" + textNerfer(tabs[i])}
                >
                    <a href="#" data-value={tabs[i]} onClick={(e) => { setActiveTab(i); onClick(e); }}
                        className={`inline-flex items-center justify-center py-2 px-4 group gap-2 text-lg border-b-2 capitalize
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
        <ul 
        className="flex flex-wrap text-center"
        id={"tab-" + textNerfer(title)}>
            <IterateTabs />
        </ul>
    );
}
