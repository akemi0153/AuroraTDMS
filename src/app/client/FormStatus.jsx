import React from "react";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Home,
  User,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const FormStatus = () => {
  const router = useRouter();
  const { query } = router; // Get the query object from router
  const formData = query.formData ? JSON.parse(query.formData) : null; // Safely parse formData

  // Check if formData is null and handle accordingly
  if (!formData) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold">Error</h2>
        <p>
          No form data available. Please ensure you have submitted the form
          correctly.
        </p>
        <Button onClick={() => router.push("/")} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="text-green-500" size={24} />;
      case "In Review":
        return <Clock className="text-yellow-500" size={24} />;
      case "Rejected":
        return <AlertTriangle className="text-red-500" size={24} />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Accommodation Inspection Form</CardTitle>
          <CardDescription>Form ID: {formData.id || "N/A"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Submitted on: {formatDate(formData.submittedAt) || "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {formatDate(formData.lastUpdated) || "N/A"}
            </p>
            <div className="flex items-center">
              {getStatusIcon(formData.status)}
              <Badge
                variant={
                  formData.status === "Approved"
                    ? "success"
                    : formData.status === "In Review"
                    ? "warning"
                    : "destructive"
                }
                className="ml-2"
              >
                {formData.status || "N/A"}
              </Badge>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    <span>{formData.propertyDetails?.address || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Type:</span>
                    <span>{formData.propertyDetails?.type || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Bedrooms:</span>
                    <span>{formData.propertyDetails?.bedrooms || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Bathrooms:</span>
                    <span>{formData.propertyDetails?.bathrooms || "N /A"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Square Footage:</span>
                    <span>
                      {formData.propertyDetails?.squareFootage
                        ? `${formData.propertyDetails.squareFootage} sq ft`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inspection Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      Scheduled for:{" "}
                      {formatDate(formData.inspectionDetails?.scheduledDate) ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>
                      Inspector:{" "}
                      {formData.inspectionDetails?.inspector || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>
                      Estimated Duration:{" "}
                      {formData.inspectionDetails?.estimatedDuration || "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            {formData.timeline?.map((event, index) => (
              <li key={index} className="mb-10 ml-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  {formatDate(event.date) || "N/A"}
                </time>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  {event.event || "N/A"}
                </p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.requiredDocuments?.map((doc, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{doc.name || "N/A"}</span>
                </div>
                <Badge
                  variant={doc.status === "Submitted" ? "success" : "warning"}
                >
                  {doc.status || "N/A"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            {formData.status === "In Review"
              ? "Your accommodation inspection form is currently under review. We'll notify you if we need any additional information about the property. Please ensure all required documents are submitted before the scheduled inspection date."
              : formData.status === "Approved"
              ? "Great news! Your accommodation has passed the inspection. We'll be in touch shortly with the official certification and any recommendations for maintaining compliance."
              : "We're sorry, but your accommodation did not meet the required standards. Please review the detailed report and contact our support team for guidance on necessary improvements. You may need to schedule a re-inspection after addressing the issues."}
          </p>
          <Button onClick={() => router.push("/support")}>
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormStatus;
