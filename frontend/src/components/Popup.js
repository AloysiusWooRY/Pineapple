import React from 'react';

import { RectangleButton } from './Buttons';

import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export default function Popup(props) {
    const { title, onSubmit, children,
        setVariableThatDeterminesIfPopupIsActive = null,
        variableThatDeterminesIfPopupIsActive = null } = props;
    {/* e.currentTarget === e.target ensures that child elements dont trigger modal toggling */ }

    return (
        <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full"
            id={"popup-" + title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
            style={{ display: variableThatDeterminesIfPopupIsActive ? "block" : "none" }}>

            {/* <p className="mt-2 text-center text-white text-sm italic">Click outside to close this popup.</p> */}
            <div className="flex items-center justify-center min-h-full"
                onClick={(e) => e.currentTarget === e.target ? setVariableThatDeterminesIfPopupIsActive(!variableThatDeterminesIfPopupIsActive) : undefined}
            >
                <div className="mx-auto p-6 w-96 rounded-xl bg-gray-700">
                    <div className="flex-auto px-4 py-10 pt-0 mt-6">
                        <div className="text-center mb-3">
                            <div className="text-white text-3xl">
                                {title}
                            </div>
                        </div>

                        <div className="border-b border-white"></div>

                        <form className="flex flex-col py-4" onSubmit={onSubmit}>
                            {children}

                            <div className="self-end">
                                <RectangleButton title="Submit" forForm heroIcon={<PaperAirplaneIcon />} colour="bg-green-800" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}