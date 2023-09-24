import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo-no-background.png"
import {
    HomeModernIcon,
    CogIcon,
    ArrowLeftOnRectangleIcon,
    ShieldExclamationIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    UserCircleIcon,
    UserGroupIcon,
    DocumentCheckIcon
} from "@heroicons/react/24/solid";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const NavSidebar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();

    const [expandAdminMenu, setExpandAdminMenu] = useState(true);

    const handleLogout = () => {
        logout();
    };


    const toggleAdminMenu = () => {
        setExpandAdminMenu((prevExpand) => !prevExpand);
    };

    return (
        <div class="h-full px-4 py-4 m-2 rounded-l-lg overflow-y-auto bg-theme-primary select-none">
            <ul class="space-y-1 font-medium text-sm">
                <li>
                    <NavLink
                        to="/"
                        className="flex items-center p-2 text-neutral-400 rounded-lg hover:text-neutral-200 transition duration-300 group"
                    >
                        <img src={Logo} />
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/organisation"
                        className="flex items-center p-2 text-neutral-400 rounded-lg hover:text-neutral-200 transition duration-300 group"
                    >
                        <HomeModernIcon className="w-5 h-5" />
                        <span class="ml-3">Organisation</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/organisation/123"
                        className="flex items-center p-2 text-neutral-400 rounded-lg hover:text-neutral-200 transition duration-300 group"
                    >
                        <ShieldExclamationIcon className="w-5 h-5" />
                        <span class="ml-3">Org (Temp)</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/organisation/123/post/new"
                        className="flex items-center p-2 text-neutral-400 rounded-lg hover:text-neutral-200 transition duration-300 group"
                    >
                        <ShieldExclamationIcon className="w-5 h-5" />
                        <span class="ml-3">Post (Temp)</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/profile"
                        className="flex items-center p-2 text-neutral-400 rounded-lg hover:text-neutral-200 transition duration-300 group"
                    >
                        <UserCircleIcon className="w-5 h-5" />
                        <span class="ml-3">Profile</span>
                    </NavLink>
                </li>

                <li
                    className="flex items-center p-2 gap-2 text-neutral-400 rounded-lg hover:cursor-pointer hover:text-neutral-200 transition duration-300 group"
                    onClick={toggleAdminMenu}
                >
                    <div className="flex items-center">
                        <CogIcon className="w-5 h-5 mr-2" />
                        Admin
                    </div>
                    {expandAdminMenu ? (
                        <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                        <ChevronUpIcon className="w-4 h-4" />
                    )}
                </li>
                {expandAdminMenu && (
                    <ul className="ml-6 space-y-2">
                        <li>
                            <NavLink
                                to="/admin/moderation"
                                className="flex items-center p-2 text-neutral-400 rounded-lg hover:text-neutral-200 transition duration-300 group"
                            >
                                <UserGroupIcon className="w-5 h-5 " />
                                <span class="ml-3 ">Moderation</span>
                            </NavLink>

                        </li>
                        <li>
                            <NavLink
                                to="/admin/application"
                                className="flex items-center p-2 text-neutral-400 rounded-lg hover:text-neutral-200 transition duration-300 group"
                            >
                                <DocumentCheckIcon className="w-5 h-5 " />
                                <span class="ml-3 ">Application</span>
                            </NavLink>
                        </li>
                    </ul>
                )}
                <li
                    className="flex items-center p-2 text-red-400 rounded-lg hover:cursor-pointer hover:text-red-600 transition duration-300 group"
                    onClick={handleLogout}
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 " />
                    <span class="ml-3 ">Logout</span>
                </li>
            </ul>

        </div>
    );
}

export default NavSidebar;
