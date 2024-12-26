"use client";

import React, { useState, useEffect } from "react";
import { fetchActivityLogs, getCurrentUser } from "@/services/appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, RefreshCw, AlertCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

export default function InspectorActivityLogsPage() {
  const [activityLogs, setActivityLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const municipalities = ["Baler", "San Luis", "Dipaculao", "Maria Aurora"];

  useEffect(() => {
    checkAuthorization();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchLogs();
    }
  }, [isAuthorized]);

  useEffect(() => {
    filterLogs();
  }, [activityLogs, selectedMunicipality, searchTerm]);

  const checkAuthorization = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || user.role !== "admin") {
        setIsAuthorized(false);
        setError("You are not authorized to view this page.");
        toast.error("Unauthorized access. Redirecting to home page.");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      setError("Failed to verify authorization. Please try again.");
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const logs = await fetchActivityLogs();
      const inspectorLogs = logs.filter(
        (log) =>
          log.eventType.toLowerCase().includes("inspector") ||
          log.message.toLowerCase().includes("inspector")
      );
      setActivityLogs(inspectorLogs);
      setFilteredLogs(inspectorLogs);
    } catch (error) {
      setError("Failed to fetch activity logs. Please try again.");
      toast.error("Failed to fetch activity logs");
    } finally {
      setIsLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...activityLogs];
    if (selectedMunicipality !== "All") {
      filtered = filtered.filter(
        (log) => log.municipality === selectedMunicipality
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.eventType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredLogs(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  if (!isAuthorized || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-700 mb-2">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-4">
          {error || "You are not authorized to view this page."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Inspector Activity Logs</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="municipality"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Municipality:
            </label>
            <select
              id="municipality"
              className="w-full p-2 border rounded-md"
              value={selectedMunicipality}
              onChange={(e) => setSelectedMunicipality(e.target.value)}
            >
              <option value="All">All Municipalities</option>
              {municipalities.map((municipality) => (
                <option key={municipality} value={municipality}>
                  {municipality}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search:
            </label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredLogs.length === 0 ? (
        <p className="text-center text-gray-500">
          No inspector activities found for the selected criteria.
        </p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Inspector ID</TableHead>
                    <TableHead>Municipality</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {log.eventType}
                      </TableCell>
                      <TableCell>{log.userId}</TableCell>
                      <TableCell>{log.municipality || "N/A"}</TableCell>
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{log.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
