"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BarChart,
  PieChart,
  Activity,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";
import {
  fetchAccommodations,
  createUser,
  getCurrentUser,
} from "@/services/appwrite";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Overview from "./Overview";
import Establishments from "./Establishments";
import UsersPage from "./users";

const queryClient = new QueryClient();

export default function AdminDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("overview");
  const [establishments, setEstablishments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInspectorModal, setShowInspectorModal] = useState(false);
  const [inspectorForm, setInspectorForm] = useState({
    email: "",
    password: "",
    name: "",
    municipality: "",
  });
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const municipalities = ["Baler", "San Luis", "Maria Aurora", "Dipaculao"];

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          toast.error("Please log in first");
          router.push("/login");
          return;
        }

        // Strict validation for admin role
        if (currentUser.role !== "admin") {
          toast.error("Unauthorized access - Admin only area");

          // Redirect based on role
          switch (currentUser.role) {
            case "inspector":
              switch (currentUser.municipality) {
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
            case "user":
              router.push("/client");
              break;
            default:
              router.push("/login");
          }
          return;
        }

        // If we get here, the user is an admin
        setIsAuthorized(true);
        setAuthChecked(true);

        // Load admin dashboard data
        const loadEstablishments = async () => {
          setIsLoading(true);
          try {
            const data = await fetchAccommodations();
            setEstablishments(data);
          } catch (error) {
            console.error("Failed to fetch establishments:", error);
            toast.error("Failed to load establishments");
          } finally {
            setIsLoading(false);
          }
        };

        loadEstablishments();
      } catch (error) {
        console.error("Access check error:", error);
        toast.error("Authentication error");
        router.push("/login");
      }
    };

    checkAccess();
  }, [router]);

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
              You are not authorized to access the San Luis dashboard.
              Redirecting you to the appropriate page...
            </p>
            <div className="animate-pulse">
              <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  const handleCreateInspector = async (e) => {
    e.preventDefault();
    try {
      await createUser(
        inspectorForm.email,
        inspectorForm.password,
        inspectorForm.name,
        "inspector",
        { municipality: inspectorForm.municipality }
      );
      toast.success("Inspector account created successfully");
      setShowInspectorModal(false);
      setInspectorForm({ email: "", password: "", name: "", municipality: "" });
    } catch (error) {
      toast.error(error.message || "Failed to create inspector account");
    }
  };

  const renderPage = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-full"></div>;
    }

    switch (currentPage) {
      case "overview":
        return <Overview establishments={establishments} />;
      case "establishments":
        return <Establishments establishments={establishments} />;
      case "users":
        return <UsersPage />;
      default:
        return <Overview establishments={establishments} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 z-50 flex w-64 flex-col bg-white/80 backdrop-blur-sm shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-center border-b">
            <span className="text-xl font-semibold">Admin Dashboard</span>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <div className="flex flex-col space-y-1 px-3">
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => setCurrentPage("overview")}
              >
                <BarChart className="mr-2 h-5 w-5" />
                Overview
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => setCurrentPage("establishments")}
              >
                <PieChart className="mr-2 h-5 w-5" />
                Establishments
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => setCurrentPage("users")}
              >
                <Users className="mr-2 h-5 w-5" />
                Users
              </Button>
            </div>
          </nav>
          <div className="border-t p-4">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-sky-50 to-white">
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white/80 backdrop-blur-sm px-6 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-4">
              <form className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search establishments..."
                  className="w-[300px] pl-9"
                />
              </form>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowInspectorModal(true)}
              >
                Create Inspector Account
              </Button>
            </div>
          </header>

          {/* Inspector Modal */}
          {showInspectorModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-semibold mb-4">
                  Create Inspector Account
                </h2>
                <form onSubmit={handleCreateInspector} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <Input
                      type="text"
                      value={inspectorForm.name}
                      onChange={(e) =>
                        setInspectorForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={inspectorForm.email}
                      onChange={(e) =>
                        setInspectorForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <Input
                      type="password"
                      value={inspectorForm.password}
                      onChange={(e) =>
                        setInspectorForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                      minLength={8}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Municipality
                    </label>
                    <Select
                      value={inspectorForm.municipality}
                      onValueChange={(value) =>
                        setInspectorForm((prev) => ({
                          ...prev,
                          municipality: value,
                        }))
                      }
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select municipality" />
                      </SelectTrigger>
                      <SelectContent>
                        {municipalities.map((municipality) => (
                          <SelectItem key={municipality} value={municipality}>
                            {municipality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Role
                    </label>
                    <Input
                      type="text"
                      value="Inspector"
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowInspectorModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Inspector</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Page Content */}
          {renderPage()}
        </main>

        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
