// React / Packages
import React from "react";
import { useNavigate } from "react-router-dom";

// Components
import { RectangleButton } from "../components/Buttons";

// Assets
import { GlobeAltIcon } from "@heroicons/react/24/solid";

// API
// ~

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div
            id="not-found"
            className="flex flex-col items-center justify-center space-y-8 min-h-screen bg-[#161618]"
        >
            <h1 className="text-text-primary text-6xl text-center">🍍404 - Pineapple Not Found🍍</h1>
            <RectangleButton title="Back to Civilisation" width="fit" heroIcon={<GlobeAltIcon />} onClick={() => navigate('../')} />
        </div>
    );
}
