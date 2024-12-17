import React from "react";
import { FileText, UserCircle, LogOut } from "lucide-react";

const Header = ({ user, onLogout, setCurrentPage, currentPage }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Client Dashboard</h1>
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage("formStatus")}
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              currentPage === "formStatus"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            <FileText size={20} className="mr-2" />
            <span className="hidden md:inline">Form Status</span>
          </button>
          <button
            onClick={() => setCurrentPage("profile")}
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              currentPage === "profile"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            <UserCircle size={20} className="mr-2" />
            <span className="hidden md:inline">Profile</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <LogOut size={20} className="mr-2" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
