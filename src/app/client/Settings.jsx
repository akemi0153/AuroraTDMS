import React, { useState } from "react";
import { Bell, Moon, Mail, Smartphone } from "lucide-react";

const Settings = ({ user }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  });
  const [darkMode, setDarkMode] = useState(false);

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const ToggleSwitch = ({ checked, onChange, label, icon: Icon }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Icon size={20} className="mr-2" />
        <span>{label}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <div className="space-y-4">
            <ToggleSwitch
              checked={notifications.email}
              onChange={() => handleNotificationChange("email")}
              label="Email Notifications"
              icon={Mail}
            />
            <ToggleSwitch
              checked={notifications.push}
              onChange={() => handleNotificationChange("push")}
              label="Push Notifications"
              icon={Bell}
            />
            <ToggleSwitch
              checked={notifications.sms}
              onChange={() => handleNotificationChange("sms")}
              label="SMS Notifications"
              icon={Smartphone}
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Appearance</h3>
          <ToggleSwitch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            label="Dark Mode"
            icon={Moon}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Account Information</h3>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">
            Member since: {new Date(user.dateJoined).toLocaleDateString()}
          </p>
        </div>
      </div>
      <button className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
