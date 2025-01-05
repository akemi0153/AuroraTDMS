import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Search } from "lucide-react";
import { fetchActivityLogs, getCurrentUser } from "@/services/appwrite";
import { toast } from "react-hot-toast";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const currentUser = await getCurrentUser();
        if (currentUser.role !== "admin") {
          toast.error("Unauthorized access - Admin only area");
          setError("Unauthorized access. Admin privileges required.");
          setIsLoading(false);
          return;
        }

        const fetchedLogs = await fetchActivityLogs();
        setLogs(fetchedLogs);
      } catch (err) {
        setError("Failed to fetch logs. Please try again.");
        toast.error("Failed to fetch logs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, []);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filtered = logs.filter(
    (log) =>
      log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.municipality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.role && log.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-red-500 mb-2">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-gray-500 mb-2">No logs found.</p>
          <p className="text-gray-400 text-sm">
            Try refreshing or check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={handleChange}
            className="pl-10"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Municipality</TableHead>
              <TableHead>Appointment Date</TableHead>
              <TableHead>Decline Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.municipality}</TableCell>
                <TableCell>{log.appointmentDate}</TableCell>
                <TableCell>{log.declineReason}</TableCell>
                <TableCell>{log.status}</TableCell>
                <TableCell>{log.name}</TableCell>
                <TableCell>{log.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ActivityLogs;
