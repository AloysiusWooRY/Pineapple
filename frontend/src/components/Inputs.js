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
    const { title, placeholder, type, width = '2/3', active = true, value, onChange, pattern = '' } = props;

    return (
        <div className="flex flex-col pb-4">
            <label for={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="text-white pb-2">{title}</label>
            <input
                id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                type={type}
                placeholder={placeholder}
                disabled={!active}
                value={value}
                onChange={onChange}
                className={`${!active ? 'border-l border-gray-500 cursor-not-allowed' : 'rounded-sm bg-white/10'} 
                p-2 text-gray-400 bg-black w-${width} placeholder:text-theme-placeholder`}
            />
        </div>
    );
};

export function InputTextBox(props) {
    const { title, placeholder, width = '2/3', active = true, value, height = 32, onChange } = props;

    return (
        <div className="flex flex-col pb-4">
            <label for={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="text-white pb-2">{title}</label>
            <textarea
                id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                placeholder={placeholder}
                disabled={!active}
                value={value}
                onChange={onChange}
                className={`${!active ? 'border-l border-gray-500 cursor-not-allowed' : 'rounded-sm bg-white/10'} 
                 p-2 h-${32} text-gray-400 bg-black w-${width} placeholder:text-theme-placeholder`}
            />
        </div>
    );
};

export function InputFile(props) {
    const { title, width = '2/3', accept, active = true, onChange } = props;

    return (
        <div className="flex flex-col pb-4">
            <label for={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="text-white pb-2">{title}</label>
            <input
                id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                type='file'
                accept={accept}
                disabled={!active}
                onChange={onChange}
                className={`${!active ? 'border-l border-gray-500 cursor-not-allowed' : 'rounded-sm bg-white/10'} 
                p-2 text-gray-400 bg-black w-${width} placeholder:text-theme-placeholder`}
            />
        </div>
    );
};
