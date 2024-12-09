"use client";
import React, { useState, useEffect } from "react";
import {
  getCurrentUser,
  fetchAccommodations,
  signOut,
} from "@/services/appwrite";
import FormStatus from "./FormStatus";
import Profile from "./Profile";
import Header from "./Header";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthUserStore } from "@/services/user";

const Dashboard = () => {
  const router = useRouter(); // Initialize useRouter
  const searchParams = useSearchParams(); // Use useSearchParams to access query params
  const [currentPage, setCurrentPage] = useState("formStatus");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittedFormData, setSubmittedFormData] = useState(null); // State to hold submitted form data
  const { authUser, clearAuthUser } = useAuthUserStore();

  // Fetch user and accommodations data
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

  // Handle query params for formData
  useEffect(() => {
    const formDataParam = searchParams.get("formData"); // Retrieve 'formData' from query params
    if (formDataParam) {
      try {
        const formData = JSON.parse(formDataParam); // Parse JSON safely
        setSubmittedFormData(formData);
        setCurrentPage("formStatus");
      } catch (error) {
        console.error("Invalid formData in query params:", error);
      }
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await signOut(); // Call the signOut function from your Appwrite service
      setUser(null); // Clear user state
      console.log("User logged out");
      router.push("/"); // Redirect to the home page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case "formStatus":
        return <FormStatus accommodations={accommodations} />;
      case "profile":
        return <Profile user={user} />;
      default:
        return <FormStatus accommodations={accommodations} />;
    }
  };

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
