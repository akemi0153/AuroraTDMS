import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function ClientsContent() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Clients</CardTitle>
        <CardDescription>
          Manage and view detailed client information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Acme Corp</TableCell>
              <TableCell>John Doe</TableCell>
              <TableCell>john@acme.com</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>3</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>XYZ Industries</TableCell>
              <TableCell>Jane Smith</TableCell>
              <TableCell>jane@xyz.com</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>2</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>123 Enterprises</TableCell>
              <TableCell>Bob Johnson</TableCell>
              <TableCell>bob@123.com</TableCell>
              <TableCell>Inactive</TableCell>
              <TableCell>0</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

