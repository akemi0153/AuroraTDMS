import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { Query } from "appwrite";
import { databases, getCurrentUser } from "@/services/appwrite";

const FormStatus = () => {
  const router = useRouter();
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAccommodations = async () => {
      try {
        // Get current user
        const user = await getCurrentUser();

        if (!user) {
          setError("No user logged in");
          setLoading(false);
          return;
        }

        // Fetch accommodations specifically for this user
        const response = await databases.listDocuments(
          "672cfccb002f456cb332",
          "6741d7f2000200706b21",
          [
            Query.equal("userId", user.$id), // Filter by current user's ID
            Query.orderDesc("$createdAt"), // Optional: order by most recent first
          ]
        );

        setAccommodations(response.documents);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching accommodations:", err);
        setError("Failed to fetch accommodations");
        setLoading(false);
      }
    };

    fetchUserAccommodations();
  }, []);

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
        return null;
    }
  };

  const renderNextSteps = (status) => {
    switch (status) {
      case "In Review":
        return "Your accommodation inspection form is currently under review. We'll notify you if we need any additional information.";
      case "Approved":
        return "Great news! Your accommodation has passed the inspection. We'll be in touch shortly with the official certification.";
      case "Rejected":
        return "We're sorry, but your accommodation did not meet the required standards. Please review the detailed report and contact our support team.";
      case "pending":
        return "Your form is being processed. Please wait for further instructions.";
      default:
        return "No current status available. Please submit your form.";
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Accommodation Form Status</h2>

      {accommodations.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p>No accommodation forms have been submitted yet.</p>
            <Button
              onClick={() => router.push("/tourism-form")}
              className="mt-4"
            >
              Submit Accommodation Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        accommodations.map((accommodation) => (
          <Card key={accommodation.$id} className="mb-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{accommodation.establishmentName}</CardTitle>
                  <CardDescription>
                    Form ID: {accommodation.accommodationId || "N/A"}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(accommodation.status)}
                  <span>{accommodation.status || "No Status"}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {renderNextSteps(accommodation.status || "Pending")}
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/tourism-form")}
                >
                  Update Form
                </Button>
                <Button onClick={() => router.push("/support")}>
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default FormStatus;
