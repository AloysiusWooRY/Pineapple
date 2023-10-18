// React / Packages
import React from "react";

// Components
import { ToggleButton } from "./Buttons";

// Assets
import { QuestionMarkCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

// API
// ~

export function InputHeader(props) {
    const { title, heroIcon = <QuestionMarkCircleIcon />, edit = false, active = true, onClick } = props;

    return (
        <div className="flex items-end justify-between border-b pb-2 border-divider-color">
            <h3 className="flex w-fit text-text-primary text-3xl">
                {heroIcon && React.cloneElement(heroIcon, { className: "h-8 w-8 mr-2" })}
                {title}
            </h3>
            {edit ? <ToggleButton active={active} onClick={onClick} /> : <></>}
        </div>
    );
};

export function InputField(props) {
    const { title, errorMsg, placeholder, type, width = 'full', bottomPadding = 4, active = true, value, onChange, additionalProps } = props;

    return (
        <div className={`flex flex-col pb-${bottomPadding}`}>
            <div className="flex flex-wrap">
                <label htmlFor={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="shrink-0 text-text-primary pb-2">{title}</label>
                <label className="text-text-warn ml-auto">{errorMsg ?? ''}</label>
            </div>
            <input
                id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                type={type}
                placeholder={placeholder}
                disabled={!active}
                value={value}
                onChange={onChange}
                {...additionalProps}
                className={`p-2 w-${width} placeholder:text-theme-placeholder 
                        ${!active ?
                        'border-l-2 border-divider-color bg-black cursor-not-allowed text-text-disabled' :
                        'rounded-sm bg-input-background-neutral text-text-primary'}`}
            />
        </div>
    );
};

export function InputTextBox(props) {
    const { title, errorMsg, placeholder, width = 'full', bottomPadding = 4, active = true, value, height = 32, onChange, additionalProps } = props;

    return (
        <div className={`flex flex-col pb-${bottomPadding}`}>
            <div className="flex flex-wrap">
                <label htmlFor={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="shrink-0 text-text-primary pb-2">{title}</label>
                <label className="text-text-warn ml-auto">{errorMsg ?? ''}</label>
            </div>
            <textarea
                id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                placeholder={placeholder}
                disabled={!active}
                value={value}
                onChange={onChange}
                {...additionalProps}
                className={`p-2 h-${height} w-${width} placeholder:text-theme-placeholder
                        ${!active ?
                        'border-l-2 border-divider-color bg-black cursor-not-allowed text-text-disabled' :
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
                <label htmlFor={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="shrink-0 text-text-primary pb-2">{title}</label>
                <label className="text-text-warn ml-auto">{errorMsg ?? ''}</label>
            </div>
            <input
                id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                type='file'
                accept={accept}
                disabled={!active}
                onChange={onChange}
                {...additionalProps}
                className={`p-2 w-${width} placeholder:text-theme-placeholder
                        ${!active ?
                        'border-l-2 border-divider-color bg-black cursor-not-allowed text-text-disabled' :
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
                <label htmlFor={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="shrink-0 text-text-primary pb-2">{title}</label>
                <label className="text-text-warn ml-auto">{errorMsg ?? ''}</label>
            </div>
            <input
                id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                type="date"
                disabled={!active}
                value={value}
                onChange={onChange}
                {...additionalProps}
                className={`p-2 w-${width} placeholder:text-theme-placeholder
                    ${!active ?
                        'border-l-2 border-divider-color bg-black cursor-not-allowed text-text-disabled' :
                        'rounded-sm bg-input-background-neutral text-text-primary'}`}
            />
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
                    id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
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
