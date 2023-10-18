// React / Packages
import React from "react";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

// Components
// ~

// Assets
// ~

// API
// ~

export default function SteppedProgressBar(props) {
    const { title, steps, currentPhase, setCurrentPhase } = props;

    return (
        <div>
            <ProgressBar
                id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                filledBackground="#fbbf24"
                percent={Math.round((currentPhase - 1) / (steps - 1) * 100)}>
                {Array.from({ length: steps }).map((_, i) => (
                    <Step key={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + "-" + i} transition="scale">
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