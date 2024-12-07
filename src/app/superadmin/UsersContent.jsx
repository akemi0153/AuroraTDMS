import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function UsersContent() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          Manage and view detailed user information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Alice Johnson</TableCell>
              <TableCell>alice@example.com</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>2023-06-05 09:30 AM</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bob Smith</TableCell>
              <TableCell>bob@example.com</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>2023-06-04 02:15 PM</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Charlie Brown</TableCell>
              <TableCell>charlie@example.com</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Inactive</TableCell>
              <TableCell>2023-05-30 11:45 AM</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

