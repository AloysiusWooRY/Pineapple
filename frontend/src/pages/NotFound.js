import React from "react";
import { useNavigate } from "react-router-dom";

import { RectangleButton } from "../components/Buttons";
import { GlobeAltIcon } from "@heroicons/react/24/solid";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div
            id="not-found"
            className="flex flex-col items-center justify-center space-y-8 min-h-screen bg-[#161618]"
        >
            <h1 className="text-white text-6xl">🍍404 - Pineapple Not Found🍍</h1>
            <RectangleButton title="Back to Civilisation" heroIcon={<GlobeAltIcon />} onClick={() => navigate('../')} />
        </div>
    );
}
