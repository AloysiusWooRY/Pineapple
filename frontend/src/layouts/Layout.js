import React from "react";
import NavSidebar from "../components/NavSidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <aside className="fixed top-0 left-0 w-56 bg-black h-[calc(100vh-1rem)] transition-transform -translate-x-[120%] sm:translate-x-0">
        <NavSidebar />
      </aside>
      <div className="flex-1 sm:ml-56 m-2">
        {children}
      </div>
    </div>
  );
};
export default Layout;