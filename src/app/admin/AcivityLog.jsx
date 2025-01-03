"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchActivityLogs } from "@/services/appwrite";
import { toast } from "react-hot-toast";
import { RefreshCw, Search } from "lucide-react";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const logsPerPage = 10;

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedLogs = await fetchActivityLogs();
      setLogs(fetchedLogs);
      setFilteredLogs(fetchedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setError("Failed to fetch activity logs. Please try again later.");
      toast.error("Failed to fetch activity logs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    const filtered = logs.filter(
      (log) =>
        log.eventType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.municipality?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [logs, searchTerm]);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  const pageCount = Math.ceil(filteredLogs.length / logsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-700 mb-2">Error</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadLogs}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Activity Logs</h2>
        <Button onClick={loadLogs} className="flex items-center">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Logs
        </Button>
      </div>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>
      {filteredLogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <p className="text-gray-500 mb-2">No activity logs found.</p>
            <p className="text-gray-400 text-sm">
              Try adjusting your search term or refreshing the logs.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Municipality</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{log.userId}</TableCell>
                    <TableCell>{log.eventType}</TableCell>
                    <TableCell>{log.municipality}</TableCell>
                    <TableCell>{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>aa
        </Card>
      )}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Showing {indexOfFirstLog + 1} to{" "}
          {Math.min(indexOfLastLog, filteredLogs.length)} of{" "}
          {filteredLogs.length} entries
        </p>
        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pageCount))
            }
            disabled={currentPage === pageCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
