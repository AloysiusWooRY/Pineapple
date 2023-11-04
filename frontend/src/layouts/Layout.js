// React / Packages
import React from "react";

// Components
import NavSidebar from "../components/NavSidebar";

// Assets
// ~

// API
// ~

export default function Layout(props) {
    const { children } = props;

    return (
        <div className="flex">
            <aside className="fixed top-0 left-0 w-56 bg-background-major h-[calc(100vh-1rem)] transition-transform -translate-x-[120%] sm:translate-x-0">
                <NavSidebar />
            </aside>
            <div className="flex-1 sm:ml-56 m-2">
                {children}
            </div>
        </div>
    );
}
