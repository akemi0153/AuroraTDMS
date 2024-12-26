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
  Building,
  CheckCircle,
  ChevronRight,
  Sun,
  Moon,
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
import { Switch } from "@/components/ui/switch";

import Overview from "./Overview";
import Establishments from "./Establishments";
import UsersPage from "./users";
import ActivityLogs from "./AcivityLog";

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [approvedEstablishments, setApprovedEstablishments] = useState(0);
  const [totalEstablishments, setTotalEstablishments] = useState(0);

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

        if (currentUser.role !== "admin") {
          toast.error("Unauthorized access - Admin only area");

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

        setIsAuthorized(true);
        setAuthChecked(true);

        const loadEstablishments = async () => {
          setIsLoading(true);
          try {
            const data = await fetchAccommodations();
            setEstablishments(data);
            setTotalEstablishments(data.length);
            setApprovedEstablishments(
              data.filter(
                (e) => e.status === "Approved" || e.status === "Approve"
              ).length
            );
          } catch (error) {
            toast.error("Failed to load establishments");
          } finally {
            setIsLoading(false);
          }
        };

        loadEstablishments();
      } catch (error) {
        toast.error("Authentication error");
        router.push("/login");
      }
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Checking authorization...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-500 mb-2">
              Unauthorized Access
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You are not authorized to access the admin dashboard. Redirecting
              you to the appropriate page...
            </p>
            <div className="animate-pulse">
              <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded w-3/4 mx-auto"></div>
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
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      );
    }

    switch (currentPage) {
      case "overview":
        return (
          <Overview
            establishments={establishments}
            approvedEstablishments={approvedEstablishments}
            totalEstablishments={totalEstablishments}
          />
        );
      case "establishments":
        return <Establishments establishments={establishments} />;
      case "users":
        return <UsersPage />;
      case "activity":
        return <ActivityLogs />;
      default:
        return (
          <Overview
            establishments={establishments}
            approvedEstablishments={approvedEstablishments}
            totalEstablishments={totalEstablishments}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={`flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 ${
          isDarkMode ? "dark" : ""
        }`}
      >
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 z-50 flex w-64 flex-col bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-4 border-b dark:border-gray-700">
            <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">
              Admin Dashboard
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <XCircle className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <div className="flex flex-col space-y-1 px-3">
              {[
                { name: "Overview", icon: BarChart },
                { name: "Establishments", icon: Building },
                { name: "Users", icon: Users },
                { name: "Activity", icon: Activity },
              ].map((item) => (
                <Button
                  key={item.name}
                  variant={
                    currentPage === item.name.toLowerCase()
                      ? "default"
                      : "ghost"
                  }
                  className={`justify-start ${
                    currentPage === item.name.toLowerCase()
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setCurrentPage(item.name.toLowerCase())}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Button>
              ))}
            </div>
          </nav>
          <div className="border-t dark:border-gray-700 p-4">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white dark:bg-gray-800 px-6 shadow-sm transition-colors duration-200">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        Dashboard
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        {currentPage.charAt(0).toUpperCase() +
                          currentPage.slice(1)}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <form className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search establishments..."
                  className="w-[300px] pl-9 rounded-full bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 transition-colors duration-200"
                />
              </form>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowInspectorModal(true)}
                className="rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
              >
                Create Inspector Account
              </Button>
              <div className="flex items-center space-x-2">
                <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200"
                />
                <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </header>

          {/* Inspector Modal */}
          {showInspectorModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-xl">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Create Inspector Account
                </h2>
                <form onSubmit={handleCreateInspector} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <Input
                      type="text"
                      value="Inspector"
                      disabled
                      className="w-full bg-gray-100 dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowInspectorModal(false)}
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Create Inspector
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Page Content */}
          <div className="p-6">{renderPage()}</div>
        </main>

        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
