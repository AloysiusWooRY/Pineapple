// React / Packages
import React from "react";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

// Components
import { textNerfer } from "./componentUtils";

// Assets
// ~

// API
// ~

export function SteppedProgressBar(props) {
    const { title, steps, currentPhase, setCurrentPhase } = props;

    return (
        <div>
            <ProgressBar
                id={"progress-bar-stepped-" + textNerfer(title)}
                filledBackground="#fbbf24"
                percent={Math.round((currentPhase - 1) / (steps - 1) * 100)}>
                {Array.from({ length: steps }).map((_, i) => (
                    <Step key={"key-" + textNerfer(title) + "-" + i} transition="scale">
                        {({ accomplished }) => (
                            <div
                                className={`indexedStep ${accomplished ? 'accomplished' : null}
                                flex items-center justify-center w-6 h-6 rounded-full bg-button-blue border-1 border-text-yellow-pineapple 
                                ${setCurrentPhase ? 'cursor-pointer' : ''}`}
                                onClick={() => setCurrentPhase && setCurrentPhase(i + 1)}
                            >
                                <p>{i + 1}</p>
                            </div>
                        )}
                    </Step>
                ))}
            </ProgressBar>
        </div>
    );
};

export function SmoothProgressBar(props) {
    const { title, floorValue, ceilingValue } = props;

    return (
        <div>
            <ProgressBar
                id={"progress-bar-" + textNerfer(title)}
                filledBackground="#fbbf24"
                percent={Math.round(floorValue / ceilingValue * 100)}>
            </ProgressBar>
        </div>
    );
}
