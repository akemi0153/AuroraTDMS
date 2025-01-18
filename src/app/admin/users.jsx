import React, { useState, useEffect } from "react";
import { Client, Databases, Query } from "appwrite";
import { RefreshCcw, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("672cfc4e003a4709c911");

const databases = new Databases(client);

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching users...");
      const response = await databases.listDocuments(
        "672cfccb002f456cb332", // databaseId
        "672cfcd0003c114264cd", // userCollectionId
        [Query.limit(100)] // Adjust the limit as needed
      );
      console.log("Fetched users response:", response);
      if (response && response.documents) {
        setUsers(response.documents);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null) {
        setError(JSON.stringify(err));
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateUserReport = async () => {
    try {
      // Prepare data for the report
      const reportData = [
        // Header row
        ["Users Report", "", ""],
        ["Generated on:", new Date().toLocaleString(), ""],
        ["", "", ""],

        // Users data
        ["Name", "Email", "Role"],
        ...users.map((user) => [user.name, user.email, user.role || "N/A"]),
      ];

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Users Report");

      // Add data to worksheet
      reportData.forEach((row) => {
        worksheet.addRow(row);
      });

      // Generate & Download Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const fileName = `Users_Report_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center">
        <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <br />
            Please check the console for more details.
          </AlertDescription>
        </Alert>
        <Button onClick={loadUsers} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button
          onClick={generateUserReport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Users Report
        </Button>
      </div>
      <Card className="overflow-hidden dark:bg-gray-800">
        <CardHeader className="bg-sky-100 dark:bg-gray-700">
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-sky-50 hover:bg-sky-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.$id}
                    className="hover:bg-sky-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role || "N/A"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
