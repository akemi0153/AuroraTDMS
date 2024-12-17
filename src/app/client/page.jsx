"use client";
import { useState, useEffect } from "react";
import {
  fetchAccommodations,
  getCurrentUser,
  signOut,
} from "@/services/appwrite";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import FormStatus from "./FormStatus";
import Profile from "./Profile";
import Header from "./Header";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState("formStatus");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setError(null);
    setLoading(true);

    try {
      // Fetch current user
      const userData = await getCurrentUser();
      if (!userData) {
        throw new Error("User not authenticated. Please log in again.");
      }
      setUser(userData);

      // Fetch accommodations data
      const accommodationsData = await fetchAccommodations();
      setAccommodations(accommodationsData);
    } catch (error) {
      console.error("Error fetching data:", error);

      // Handle specific errors more cleanly
      if (error.message?.includes("missing scope")) {
        setError(
          "Permission denied: Your account doesn't have the required permissions. Please contact support."
        );
      } else if (error.message?.includes("not authenticated")) {
        setError("Session expired. Please log in again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to log out. Please try again.");
    }
  };

  const handleContactSupport = () => {
    console.log("Contacting support...");
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-8">Loading...</div>;
    }
    if (error) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <div className="mt-4 flex space-x-4">
            <Button onClick={fetchData}>Retry</Button>
            <Button onClick={handleContactSupport} variant="outline">
              Contact Support
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Log Out
            </Button>
          </div>
        </Alert>
      );
    }
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
    <div className="min-h-screen bg-gray-100">
      <Header
        user={user}
        onLogout={handleLogout}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome, {user?.name || "User"}!
          </h2>
          <p className="text-gray-600">
            View your accommodation form statuses and appointment dates below.
          </p>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
