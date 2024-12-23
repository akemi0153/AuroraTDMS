"use client";

import { useState, useEffect } from "react";
import {
  fetchAccommodations,
  getCurrentUser,
  signOut,
} from "@/services/appwrite";
import FormStatus from "./FormStatus";
import Profile from "./Profile";
import Header from "./Header";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState("formStatus");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          toast.error("Please log in first");
          router.push("/login");
          return;
        }

        if (
          currentUser.role !== "inspector" ||
          currentUser.municipality !== "Baler"
        ) {
          setIsAuthorized(false);
          setAuthChecked(true);

          setTimeout(() => {
            if (currentUser.role === "inspector") {
              switch (currentUser.municipality) {
                case "San Luis":
                  router.push("/inspector/sanluis");
                  break;
                case "Maria Aurora":
                  router.push("/inspector/maria");
                  break;
                case "Dipaculao":
                  router.push("/inspector/dipaculao");
                  break;
                default:
                  router.push("/login");
              }
            } else {
              switch (currentUser.role) {
                case "admin":
                  router.push("/admin");
                  break;
                case "user":
                  router.push("/client");
                  break;
                default:
                  router.push("/login");
              }
            }
          }, 3000);
          return;
        }

        setIsAuthorized(true);
        setAuthChecked(true);
      } catch (error) {
        console.error("Access check error:", error);
        toast.error("Authentication error");
        router.push("/login");
      }
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setError(null);

    try {
      const userData = await getCurrentUser();
      if (!userData) {
        throw new Error("User not authenticated. Please log in again.");
      }
      setUser(userData);

      const accommodationsData = await fetchAccommodations();
      setAccommodations(accommodationsData);
    } catch (error) {
      console.error("Error fetching data:", error);

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
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout properly");
      router.push("/login");
    }
  };

  const handleContactSupport = () => {
    console.log("Contacting support...");
    // Implement your contact support logic here
  };

  const handleDeclineReasonChange = (reason) => {
    setDeclineReason(reason);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="mb-4">
          <div className="p-4 bg-red-100 rounded-lg">
            <p className="text-red-700 font-bold">Error</p>
            <p className="text-red-700">{error}</p>
            <div className="mt-4 flex space-x-4">
              <Button onClick={fetchData}>Retry</Button>
              <Button onClick={handleContactSupport} variant="outline">
                Contact Support
              </Button>
              <Button onClick={handleLogout} variant="outline">
                Log Out
              </Button>
            </div>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case "formStatus":
        return (
          <FormStatus
            accommodations={accommodations}
            declineReason={declineReason}
            onDeclineReasonChange={handleDeclineReasonChange}
          />
        );
      case "profile":
        return <Profile user={user} />;
      default:
        return <FormStatus accommodations={accommodations} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50"
    >
      <Header
        user={user}
        onLogout={handleLogout}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-lg rounded-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
            Welcome, {user?.name || "Guest"}!
          </h2>
          <p className="text-gray-600">
            View your accommodation form statuses and appointment dates below.
          </p>
        </motion.div>
        {renderContent()}
      </main>
    </motion.div>
  );
};

export default Dashboard;
