"use client";
import React, { useState } from "react";
import DashboardContent from "./DashboardContent";
import UsersContent from "./UsersContent";
import ClientsContent from "./ClientsContent";
import InspectorsContent from "./InspectorsContent";
import SettingsContent from "./SettingsContent";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [theme, setTheme] = useState("light");
  const [accentColor, setAccentColor] = useState("blue");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    console.log(`Theme changed to ${newTheme}`);
  };

  const handleAccentColorChange = (color) => {
    setAccentColor(color);
    console.log(`Accent color changed to ${color}`);
  };

  const tabContent = {
    dashboard: <DashboardContent />,
    users: <UsersContent />,
    clients: <ClientsContent />,
    inspectors: <InspectorsContent />,
    settings: (
      <SettingsContent
        theme={theme}
        accentColor={accentColor}
        onThemeChange={handleThemeChange}
        onAccentColorChange={handleAccentColorChange}
      />
    ),
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar activeTab={activeTab} onTabClick={handleTabClick} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:px-6 sm:py-0">
          {tabContent[activeTab] || <DashboardContent />}
        </main>
      </div>
    </div>
  );
}
