import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function InspectorsContent() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inspectors</CardTitle>
        <CardDescription>
          Manage and view detailed inspector information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completed Inspections</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Emma Wilson</TableCell>
              <TableCell>Electrical</TableCell>
              <TableCell>emma@example.com</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>42</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Assign
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Michael Brown</TableCell>
              <TableCell>Structural</TableCell>
              <TableCell>michael@example.com</TableCell>
              <TableCell>On Assignment</TableCell>
              <TableCell>38</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" disabled>
                  Assign
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sarah Lee</TableCell>
              <TableCell>Plumbing</TableCell>
              <TableCell>sarah@example.com</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>27</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Assign
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

