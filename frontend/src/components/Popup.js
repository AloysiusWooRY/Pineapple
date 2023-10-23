// React / Packages
import React from "react";

// Components
import { RectangleButton } from './Buttons';
import { Divider } from './Miscellaneous';

// Assets
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

// API
// ~

export default function Popup(props) {
    const { title, onSubmit, children, overrideButton = false,
        setVariableThatDeterminesIfPopupIsActive = null,
        variableThatDeterminesIfPopupIsActive = null } = props;
    {/* e.currentTarget === e.target ensures that child elements dont trigger modal toggling */ }

    return (
        <div
            className="fixed inset-0 bg-background-major bg-opacity-75 overflow-y-auto h-full w-full"
            id={"popup-" + title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
            style={{ display: variableThatDeterminesIfPopupIsActive ? "block" : "none" }}>

            <div className="flex flex-col items-center justify-center min-h-full"
                onClick={(e) => e.currentTarget === e.target ? setVariableThatDeterminesIfPopupIsActive(!variableThatDeterminesIfPopupIsActive) : undefined}
            >
                <div className="mx-auto p-6 min-w-[32rem] w-fit rounded-xl bg-background-minor">
                    <div className="flex-auto px-4 py-4 pt-0 mt-6">
                        <div className="text-center mb-3">
                            <div className="text-text-primary text-3xl">
                                {title}
                            </div>
                        </div>

                        <Divider padding={2} />

                        <form className="flex flex-col py-4" onSubmit={onSubmit}>
                            {children}

                            {!overrideButton ?
                                <div className="self-end">
                                    <RectangleButton title="Submit" forForm heroIcon={<PaperAirplaneIcon />} colour="bg-button-green" />
                                </div>
                                :
                                <></>
                            }
                        </form>
                    </div>
                </div>
                <p className="mt-2 text-center text-text-primary text-sm">Click anywhere outside this popup to close it.</p>
            </div>
        </div>
    );
}