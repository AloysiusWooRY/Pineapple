import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    HomeIcon,
    InformationCircleIcon,
    CogIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    QuestionMarkCircleIcon,
    ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const NavSidebar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();

    const handleLogout = () => {
        logout();
    };

    return (
        <div class="h-full px-4 py-4 m-4 rounded-lg overflow-y-auto bg-neutral-900">
            <ul class="space-y-2 font-medium">
                <li>
                    <NavLink
                        to="/"
                        className="flex items-center p-2 text-neutral-400 rounded-lg hover:text-neutral-200 transition duration-300 group"
                    >
                        <HomeIcon className="w-5 h-5 " />
                        <span class="ml-3">Home</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default NavSidebar;
