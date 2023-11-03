import React, { useState, useEffect } from "react";

import Popup from './Popup';

import useIdle from "../hooks/useIdleTimer"
import { useLogout } from "../hooks/useLogout";


export default function IdleTimerComponent() {
    const [remainingTime, setRemainingTime] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const { logout } = useLogout();

    // Logout functions
    const handleLogout = () => {
        logout();
    };

    // set states when user becomes idle
    const handleIdle = () => {
        setShowModal(true); // Show modal only if not interacting with it
        setRemainingTime(30); // Set 30 seconds as time remaining
    };

    const handleStayLoggedIn = () => {
        setShowModal(false);
    };

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    // idleTime sets how long user idles before prompting that auto logout is imminent (time in minutes)
    const { isIdle } = useIdle({ onIdle: handleIdle, idleTime: 30 });

    useEffect(() => {
        let interval;

        if (isIdle && showModal) {
            interval = setInterval(() => {
                setRemainingTime(
                    (prevRemainingTime) =>
                        prevRemainingTime > 0 ? prevRemainingTime - 1 : 0 //reduces the second by 1
                );
            }, 1000);
        }

        if (remainingTime === 0 && showModal) {
            setShowModal(false);
            handleLogout();
        }

        return () => {
            clearInterval(interval);
        };
    }, [isIdle, remainingTime, showModal]);

    return (
        <Popup
            title="Are you still here?"
            onSubmit={handleStayLoggedIn}
            variableThatDeterminesIfPopupIsActive={showModal && isIdle}
            setVariableThatDeterminesIfPopupIsActive={setShowModal}
        >
            <div className="text-text-primary text-m">
                Time remaining: {millisToMinutesAndSeconds(remainingTime * 1000)}
            </div>
        </Popup>
    )
}
