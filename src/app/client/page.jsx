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
import { XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState("formStatus");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const userRole = sessionStorage.getItem("userRole");

        if (!userRole) {
          toast.error("Please log in first");
          router.push("/login");
          return;
        }

        // Strict validation for user role
        if (userRole !== "user") {
          setIsAuthorized(false);
          setAuthChecked(true);

          // Show unauthorized message and redirect after delay
          setTimeout(() => {
            switch (userRole) {
              case "admin":
                router.push("/admin");
                break;
              case "inspector":
                const municipality = sessionStorage.getItem("userMunicipality");
                switch (municipality) {
                  case "Baler":
                    router.push("/inspector/baler");
                    break;
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
                break;
              default:
                router.push("/login");
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
    if (isAuthorized) {
      fetchData();
    }
  }, [isAuthorized]);

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
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout properly");
      window.location.href = "/login";
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

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-500 mb-2">
              Unauthorized Access
            </h1>
            <p className="text-gray-600 mb-4">
              You are not authorized to access the Client dashboard. Redirecting
              you to the appropriate page...
            </p>
            <div className="animate-pulse">
              <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
