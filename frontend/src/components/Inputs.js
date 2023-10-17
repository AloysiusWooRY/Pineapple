import React from "react";

import { ToggleButton } from "./Buttons";

import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

export function InputHeader(props) {
    const { title, heroIcon = <QuestionMarkCircleIcon />, edit = false, active = true, onClick } = props;

    return (
        <div className="flex items-end justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
            <h3 className="flex w-fit text-white text-3xl">
                {heroIcon && React.cloneElement(heroIcon, { className: "h-8 w-8 mr-2" })}
                {title}
            </h3>
            {edit ? <ToggleButton active={active} onClick={onClick} /> : <></>}
        </div>
    );
};

export function InputField(props) {
    const { title, errorMsg, placeholder, type, width = '2/3', active = true, value, onChange, additionalProps } = props;

    return (
        <div className="flex flex-col pb-4">
            <div className="flex flex-wrap">
                <label htmlFor={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="shrink-0 text-white pb-2">{title}</label>
                <label className="text-red-600 ml-auto">{errorMsg ?? ''}</label>
            </div>
            <input
                id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                type={type}
                placeholder={placeholder}
                disabled={!active}
                value={value}
                onChange={onChange}
                {...additionalProps}
                className={`${!active ? 'border-l border-gray-500 cursor-not-allowed text-gray-400' : 'rounded-sm bg-white/10 text-white'}
                p-2 bg-black w-${width} placeholder:text-theme-placeholder`}
            />
        </div>
    );
};

export function InputTextBox(props) {
    const { title, errorMsg, placeholder, width = '2/3', active = true, value, height = 32, onChange, additionalProps } = props;

    return (
        <div className="flex flex-col pb-4">
            <div className="flex flex-wrap">
                <label htmlFor={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="shrink-0 text-white pb-2">{title}</label>
                <label className="text-red-600 ml-auto">{errorMsg ?? ''}</label>
            </div>
            <textarea
                id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                placeholder={placeholder}
                disabled={!active}
                value={value}
                onChange={onChange}
                {...additionalProps}
                className={`${!active ? 'border-l border-gray-500 cursor-not-allowed text-gray-400' : 'rounded-sm bg-white/10 text-white'} 
                 p-2 h-${height} bg-black w-${width} placeholder:text-theme-placeholder`}
            />
        </div>
    );
};

export function InputFile(props) {
    const { title, errorMsg, width = '2/3', accept, active = true, onChange, additionalProps } = props;

    return (
        <div className="flex flex-col pb-4">
            <div className="flex flex-wrap">
                <label htmlFor={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="shrink-0 text-white pb-2">{title}</label>
                <label className="text-red-600 ml-auto">{errorMsg ?? ''}</label>
            </div>
            <input
                id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                type='file'
                accept={accept}
                disabled={!active}
                onChange={onChange}
                {...additionalProps}
                className={`${!active ? 'border-l border-gray-500 cursor-not-allowed text-gray-400' : 'rounded-sm bg-white/10 text-white'} 
                p-2  bg-black w-${width} placeholder:text-theme-placeholder`}
            />
        </div>
    );
};


export function InputDate(props) {
    const { title, errorMsg, width = '2/3', active = true, value, onChange, additionalProps } = props;

    return (
        <div className="flex flex-col pb-4">
            <div className="flex flex-wrap">
                <label htmlFor={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="shrink-0 text-white pb-2">{title}</label>
                <label className="text-red-600 ml-auto">{errorMsg ?? ''}</label>
            </div>
            <input
                id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                type="date"
                disabled={!active}
                value={value}
                onChange={onChange}
                {...additionalProps}
                className={`${!active ? 'border-l border-gray-500 cursor-not-allowed text-gray-400' : 'rounded-sm bg-white/10 text-white'} 
                p-2  bg-black w-${width} placeholder:text-theme-placeholder`}
            />
        </div>
    );
}
