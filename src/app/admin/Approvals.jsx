import React, { useState, useEffect } from "react";
import { fetchAccommodations, updateApprovalStatus } from "@/services/appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";

export default function Approvals() {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPendingApprovals = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAccommodations();
        const pending = data.filter(
          (establishment) => establishment.approvalStatus === "pending"
        );
        setPendingApprovals(pending);
      } catch (error) {
        console.error("Failed to fetch pending approvals:", error);
        toast.error("Failed to load pending approvals");
      } finally {
        setIsLoading(false);
      }
    };

    loadPendingApprovals();
  }, []);

  const handleApproval = async (id, status) => {
    try {
      await updateApprovalStatus(id, status);
      setPendingApprovals((prevApprovals) =>
        prevApprovals.filter((approval) => approval.$id !== id)
      );
      toast.success(
        `Establishment ${
          status === "approved" ? "approved" : "rejected"
        } successfully`
      );
    } catch (error) {
      console.error("Failed to update approval status:", error);
      toast.error("Failed to update approval status");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Approvals</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading pending approvals...</p>
            </div>
          ) : pendingApprovals.length === 0 ? (
            <p>No pending approvals at the moment.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Establishment Name</TableHead>
                  <TableHead>Municipality</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApprovals.map((establishment) => (
                  <TableRow key={establishment.$id}>
                    <TableCell>{establishment.establishmentName}</TableCell>
                    <TableCell>{establishment.municipality}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleApproval(establishment.$id, "approved")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleApproval(establishment.$id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </div>
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
