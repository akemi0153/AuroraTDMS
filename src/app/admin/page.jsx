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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";
import { fetchAccommodations } from "@/services/appwrite";

import Overview from "./Overview";
import Establishments from "./Establishments";
import UsersPage from "./users";

const queryClient = new QueryClient();

export default function AdminDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("overview");
  const [establishments, setEstablishments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
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
  }, []);

  const handleLogout = () => {
    toast.success("You have been successfully logged out.");
    router.push("/login");
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      );
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
            </div>
          </header>

          {/* Page Content */}
          {renderPage()}
        </main>

        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
