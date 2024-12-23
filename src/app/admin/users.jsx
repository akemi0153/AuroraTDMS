import React, { useState, useEffect } from "react";
import { Client, Databases, Query } from "appwrite";
import { RefreshCcw } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      <h1 className="mb-6 text-3xl font-bold">Users</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
        />
      </div>
      <Card className="overflow-hidden dark:bg-gray-800">
        <CardHeader className="bg-sky-100 dark:bg-gray-700">
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
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
                {filteredUsers.map((user) => (
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
