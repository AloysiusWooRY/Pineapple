// React / Packages
import React, { useState, useEffect } from "react";

// Components
import { textNerfer } from "./componentUtils";
import { ToggleButton } from "./Buttons";

// Assets
import { QuestionMarkCircleIcon, ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

// API
// ~

export function InputHeader(props) {
    const { title, heroIcon = <QuestionMarkCircleIcon />, edit = false, active = true, onClick } = props;

    return (
        <div
            className="flex items-end justify-between border-b pb-2 border-divider-color"
            id={"input-header-" + textNerfer(title)}>
            <h3 className="flex w-fit text-text-primary text-3xl">
                {heroIcon && React.cloneElement(heroIcon, { className: "h-8 w-8 mr-2" })}
                {title}
            </h3>
            {edit ? <ToggleButton title={title} active={active} onClick={onClick} /> : <></>}
        </div>
    );
};

export function InputField(props) {
    const { title, errorMsg, placeholder, type, width = 'full', bottomPadding = 4, active = true, value, onChange, additionalProps } = props;

    return (
        <div className={`flex flex-col pb-${bottomPadding}`}>
            <div className="flex flex-wrap">
                <label htmlFor={"input-" + textNerfer(title)} className="shrink-0 text-text-primary pb-2">{title}</label>
                <label id={"error-input-" + textNerfer(title)} className="text-text-warn ml-auto">{errorMsg ?? ''}</label>
            </div>
            <input
                id={"input-" + textNerfer(title)}
                type={type}
                placeholder={placeholder}
                disabled={!active}
                value={value}
                onChange={onChange}
                {...additionalProps}
                className={`p-2 w-${width} min-w-fit placeholder:text-theme-placeholder 
                        ${!active ?
                        'border-l-2 border-divider-color bg-transparent cursor-not-allowed text-text-disabled' :
                        'rounded-sm bg-input-background-neutral text-text-primary'}`}
            />
        </div>
    );
};

export function InputTextBox(props) {
    const { title, errorMsg, placeholder, width = 'full', bottomPadding = 4, active = true, value, height = '32', onChange, additionalProps } = props;

    return (
        <div className={`flex flex-col pb-${bottomPadding}`}>
            <div className="flex flex-wrap">
                <label htmlFor={"input-" + textNerfer(title)} className="shrink-0 text-text-primary pb-2">{title}</label>
                <label id={"error-input-" + textNerfer(title)} className="text-text-warn ml-auto">{errorMsg ?? ''}</label>
            </div>
            <textarea
                id={"input-" + textNerfer(title)}
                placeholder={placeholder}
                disabled={!active}
                value={value}
                onChange={onChange}
                {...additionalProps}
                className={`p-2 h-${height} w-${width} placeholder:text-theme-placeholder
                        ${!active ?
                        'border-l-2 border-divider-color bg-transparent cursor-not-allowed text-text-disabled' :
                        'rounded-sm bg-input-background-neutral text-text-primary'}`}
            />
        </div>
    );
};

export function InputFile(props) {
    const { title, errorMsg, width = 'full', bottomPadding = 4, accept, active = true, onChange, additionalProps } = props;

    return (
        <div className={`flex flex-col pb-${bottomPadding}`}>
            <div className="flex flex-wrap">
                <label htmlFor={"input-" + textNerfer(title)} className="shrink-0 text-text-primary pb-2">{title}</label>
                <label id={"error-input-" + textNerfer(title)} className="text-text-warn ml-auto">{errorMsg ?? ''}</label>
            </div>
            <input
                id={"input-" + textNerfer(title)}
                type='file'
                accept={accept}
                disabled={!active}
                onChange={onChange}
                {...additionalProps}
                className={`p-2 w-${width} placeholder:text-theme-placeholder
                        ${!active ?
                        'border-l-2 border-divider-color bg-transparent cursor-not-allowed text-text-disabled' :
                        'rounded-sm bg-input-background-neutral text-text-primary'}`}
            />
        </div>
    );
};


export function InputDate(props) {
    const { title, errorMsg, width = 'full', bottomPadding = 4, active = true, value, onChange, additionalProps } = props;

    return (
        <div className={`flex flex-col pb-${bottomPadding}`}>
            <div className="flex flex-wrap">
                <label htmlFor={"input-" + textNerfer(title)} className="shrink-0 text-text-primary pb-2">{title}</label>
                <label id={"error-input-" + textNerfer(title)} className="text-text-warn ml-auto">{errorMsg ?? ''}</label>
            </div>
            <input
                id={"input-" + textNerfer(title)}
                type="datetime-local"
                disabled={!active}
                value={value}
                onChange={onChange}
                {...additionalProps}
                className={`p-2 w-${width} min-w-fit placeholder:text-theme-placeholder
                    ${!active ?
                        'border-l-2 border-divider-color bg-transparent cursor-not-allowed text-text-disabled' :
                        'rounded-sm bg-input-background-neutral text-text-primary'}`}
            />
        </div>
    );
}

export function InputMonthYear(props) {
    const { title, errorMsg, setFormattedValue, width = 'full', bottomPadding = 4, active = true,
        month, setMonth, year, setYear } = props;

    useEffect(() => {
        setFormattedValue(`${month}/${year}`);
    }, [month, year]);

    return (
        <div
            className={`flex flex-row w-${width} space-x-2 pb-${bottomPadding}`}
            >
            <div className={`flex flex-col w-1/2`}>
                <span className="min-w-fit grow-0 py-2 text-text-primary">{title + " Month"}</span>
                <div className={`flex flex-row grow text-text-primary
                 ${!active ?
                        'border-l-2 border-divider-color bg-transparent' :
                        'rounded-sm bg-input-background-neutral text-text-primary'}
                rounded-sm`}>
                    <select id={"input-" + textNerfer(title) + "-month"}
                        value={month}
                        disabled={!active}
                        onChange={(e) => {
                            setMonth(e.target.value);
                        }}
                        className={`p-2 capitalize grow appearance-none bg-transparent
                        ${!active ?
                                'cursor-not-allowed text-text-disabled' :
                                'text-text-primary'}
                        `}>
                        <option className="text-text-primary capitalize font-sans bg-input-background-neutral" value="">Select Month</option>
                        <option className="text-text-primary capitalize font-sans bg-input-background-neutral" value="01">January</option>
                        <option className="text-text-primary capitalize font-sans bg-input-background-neutral" value="02">February</option>
                        <option className="text-text-primary capitalize font-sans bg-input-background-neutral" value="03">March</option>
                        <option className="text-text-primary capitalize font-sans bg-input-background-neutral" value="04">April</option>
                        <option className="text-text-primary capitalize font-sans bg-input-background-neutral" value="05">May</option>
                        <option className="text-text-primary capitalize font-sans bg-input-background-neutral" value="06">June</option>
                        <option className="text-text-primary capitalize font-sans bg-input-background-neutral" value="07">July</option>
                        <option className="text-text-primary capitalize font-sans bg-input-background-neutral" value="08">August</option>
                        <option className="text-text-primary capitalize font-sans bg-input-background-neutral" value="09">September</option>
                        <option className="text-text-primary capitalize font-sans bg-input-background-neutral" value="10">October</option>
                        <option className="text-text-primary capitalize font-sans bg-input-background-neutral" value="11">November</option>
                        <option className="text-text-primary capitalize font-sans bg-input-background-neutral" value="12">December</option>
                    </select>

                    <button className="items-center pr-2" type="button">
                        <ChevronDownIcon className="h-6 text-text-primary" />
                    </button>
                </div>
            </div>

            <div className={`flex flex-col w-1/2`}>
                <div className="flex flex-wrap py-2">
                    <label htmlFor={"input-" + textNerfer(title) + "-year"} className="shrink-0 text-text-primary">{title + " Year"}</label>
                    <label id={"error-input-" + textNerfer(title)} className="text-text-warn ml-auto">{errorMsg ?? ''}</label>
                </div>
                <input
                    id={"input-" + textNerfer(title) + "-year"}
                    type="number"
                    placeholder="YY"
                    min="23"
                    max="99"
                    disabled={!active}
                    value={year}
                    onChange={(e) => {
                        setYear(e.target.value);
                    }}
                    className={`p-2 placeholder:text-theme-placeholder 
                        ${!active ?
                            'border-l-2 border-divider-color bg-transparent cursor-not-allowed text-text-disabled' :
                            'rounded-sm bg-input-background-neutral text-text-primary'}`}
                />
            </div>
        </div>
    );
}

export function SearchField(props) {
    const { title, width = 'full', bottomPadding = 4, active = true, value, onChange, additionalProps } = props;

    return (
        <>
            <div className={`flex flex-row
                    ${!active ?
                    'border-l-2 border-divider-color bg-black cursor-not-allowed text-text-disabled' :
                    'rounded-sm bg-input-background-neutral text-text-primary'}`}
            >
                <input
                    id={"search-" + textNerfer(title)}
                    type="search"
                    placeholder={title}
                    disabled={!active}
                    value={value}
                    onChange={onChange}
                    {...additionalProps}
                    className={`p-2 w-${width} grow bg-transparent placeholder:text-theme-placeholder`}
                />
                <button className="items-center pr-2 bg-transparent" type="button">
                    <MagnifyingGlassIcon className="h-6 text-text-primary" />
                </button>
            </div>

            <div className={`pb-${bottomPadding}`}></div>
        </>
    );
}
