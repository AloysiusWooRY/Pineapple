import React from "react";
import NavSidebar from "../components/NavSidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <aside className="fixed top-0 left-0 w-64 h-[calc(100vh-2rem)] transition-transform -translate-x-full sm:translate-x-0">
        <NavSidebar />
      </aside>
      <div className="flex-1 p-4 sm:ml-60 h-[calc(100vh-2rem)] rounded-lg bg-neutral-900 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
export default Layout;