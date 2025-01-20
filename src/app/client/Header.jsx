import React from "react";
import { FileText, UserCircle, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const Header = ({ user, onLogout, setCurrentPage, currentPage }) => {
  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-bold text-white"
        >
          Client Dashboard
        </motion.h1>
        <nav className="flex items-center space-x-2">
          <HeaderButton
            onClick={() => setCurrentPage("formStatus")}
            isActive={currentPage === "formStatus"}
            icon={FileText}
            text="Form Status"
          />
          <HeaderButton
            onClick={() => setCurrentPage("profile")}
            isActive={currentPage === "profile"}
            icon={UserCircle}
            text="Profile"
          />
          <HeaderButton onClick={onLogout} icon={LogOut} text="Logout" />
        </nav>
      </div>
    </motion.header>
  );
};

const HeaderButton = ({ onClick, isActive, icon: Icon, text }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
      isActive ? "bg-white text-indigo-700" : "text-white hover:bg-indigo-500"
    } focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50`}
  >
    <Icon size={20} className="mr-2" />
    <span className="hidden md:inline">{text}</span>
  </motion.button>
);

export default Header;
