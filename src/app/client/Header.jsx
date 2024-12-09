import React from "react";
import { FileText, Settings, UserCircle, LogOut } from "lucide-react";

const Header = ({ user, onLogout, setCurrentPage, currentPage }) => {
  const NavButton = ({ page, icon: Icon, label }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`flex items-center px-3 py-2 rounded-md transition-colors ${
        currentPage === page
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
    >
      <Icon size={20} className="mr-2" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Client Dashboard</h1>
        <nav className="flex items-center space-x-2">
          <NavButton page="formStatus" icon={FileText} label="Form Status" />
          <NavButton page="profile" icon={UserCircle} label="Profile" />
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
