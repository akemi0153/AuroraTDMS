"use client";
import React, { useState, useEffect } from "react";
import Profile from "./profile";
import FormStatus from "./FormStatus";
import Settings from "./settings";
import Header from "./header";
import { getCurrentUser, fetchAccommodations } from "@/services/appwrite"; // Import your Appwrite functions

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState("formStatus");
  const [user, setUser] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);

        const accommodationsData = await fetchAccommodations();
        setAccommodations(accommodationsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(); // Call the signOut function from your Appwrite service
      setUser(null); // Clear user state
      console.log("User  logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case "formStatus":
        return <FormStatus accommodations={accommodations} />;
      case "settings":
        return <Settings />;
      case "profile":
        return <Profile user={user} />;
      default:
        return <FormStatus accommodations={accommodations} />;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header
        user={user}
        onLogout={handleLogout}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      {renderContent()}
    </div>
  );
};

export default Dashboard;
