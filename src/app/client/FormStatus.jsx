"use client";

import React, { useState, useEffect } from "react";
import { databases } from "@/services/appwrite";
import { Query } from "appwrite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const FormStatus = () => {
  const [formStatuses, setFormStatuses] = useState([]);
  const [accommodationDetails, setAccommodationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) throw new Error("No user logged in");

        // Fetch accommodation details and form statuses for the user
        const [accommodationResponse, formStatusesResponse] = await Promise.all(
          [fetchAccommodationDetails(userId), fetchFormStatuses(userId)]
        );

        setAccommodationDetails(accommodationResponse);
        setFormStatuses(formStatusesResponse);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch accommodation details
  const fetchAccommodationDetails = async (userId) => {
    const response = await databases.listDocuments(
      "672cfccb002f456cb332", // databaseId
      "6741d7f2000200706b21", // accommodationsCollectionId
      [Query.equal("userId", userId), Query.limit(1)]
    );
    return response.documents[0] || null; // Return the first document or null if none found
  };

  const fetchFormStatuses = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        console.error("No userId found in session storage");
        setError("No user logged in");
        return [];
      }

      const response = await databases.listDocuments(
        "672cfccb002f456cb332", // databaseId
        "6741d7f2000200706b21", // accommodationsCollectionId
        [
          Query.equal("userId", userId), // Use userId from sessionStorage
          Query.orderDesc("$createdAt"),
          Query.select([
            "$id",
            "$createdAt",
            "establishmentName",
            "status",
            "accommodationId",
            "appointmentDate",
          ]),
        ]
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching form statuses:", error);
      setError("Failed to fetch form statuses");
      return [];
    }
  };

  // Render status icon based on the form status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="text-green-500" size={24} />;
      case "In Review":
        return <Clock className="text-yellow-500" size={24} />;
      case "Rejected":
        return <AlertTriangle className="text-red-500" size={24} />;
      case "Pending":
        return <Clock className="text-blue-500" size={24} />;
      default:
        return <Clock className="text-gray-500" size={24} />;
    }
  };

  // Redirect to the new accommodation form page
  const handleSubmitNewForm = () => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      router.push(`/tourism-form?userId=${userId}`);
    } else {
      console.error("No userId found in session storage");
    }
  };

  // Submit a new accommodation form
  const submitAccommodationForm = async (formData) => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      console.error("No userId found in session storage");
      return;
    }

    try {
      await databases.createDocument(
        "672cfccb002f456cb332", // databaseId
        "6741d7f2000200706b21", // accommodationsCollectionId
        "unique()", // Document ID
        { ...formData, userId }
      );
    } catch (error) {
      console.error("Error creating accommodation form:", error);
    }
  };

  // Render accommodation details
  const renderAccommodationDetails = () => {
    if (!accommodationDetails) {
      return (
        <div className="text-gray-500 text-center p-4">
          No accommodation details found.
        </div>
      );
    }

    const {
      municipality,
      establishmentName,
      businessAddress,
      accreditationNumber,
      expirationDate,
      licenseNumber,
      contactPerson,
      email,
      accommodationId,
      contactNumber,
      status,
      appointmentDate,
      userId,
    } = accommodationDetails;

    return (
      <Card className="w-full max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Accommodation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Municipality</h3>
              <p>{municipality}</p>
            </div>
            <div>
              <h3 className="font-semibold">Establishment Name</h3>
              <p>{establishmentName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Business Address</h3>
              <p>{businessAddress}</p>
            </div>
            <div>
              <h3 className="font-semibold">Accreditation Number</h3>
              <p>{accreditationNumber}</p>
            </div>
            <div>
              <h3 className="font-semibold">Expiration Date</h3>
              <p>{new Date(expirationDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">License Number</h3>
              <p>{licenseNumber}</p>
            </div>
            <div>
              <h3 className="font-semibold">Contact Person</h3>
              <p>{contactPerson}</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>{email}</p>
            </div>
            <div>
              <h3 className="font-semibold">Accommodation ID</h3>
              <p>{accommodationId}</p>
            </div>
            <div>
              <h3 className="font-semibold">Contact Number</h3>
              <p>{contactNumber}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{status}</p>
            </div>
            <div>
              <h3 className="font-semibold">Appointment Date</h3>
              <p>
                {appointmentDate
                  ? new Date(appointmentDate).toLocaleString()
                  : "Not scheduled"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">User ID</h3>
              <p>{userId}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Your Accommodation Details</h2>
      {renderAccommodationDetails()}

      <h2 className="text-2xl font-bold mb-4">
        Your Accommodation Form Statuses
      </h2>
      <Button onClick={handleSubmitNewForm} className="mb-4">
        Submit New Accommodation Form
      </Button>

      {formStatuses.length === 0 ? (
        <p>You haven't submitted any accommodation forms yet.</p>
      ) : (
        formStatuses.map((form) => (
          <Card key={form.$id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{form.establishmentName}</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(form.status)}
                  <span>{form.status || "Pending"}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Submitted: {new Date(form.$createdAt).toLocaleString()}</p>
              <p>
                Appointment Date:{" "}
                {form.appointmentDate
                  ? new Date(form.appointmentDate).toLocaleString()
                  : "Not scheduled yet"}
              </p>
              <p>Form ID: {form.accommodationId || "N/A"}</p>
              <p>Status: {form.status || "Pending"}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default FormStatus;
