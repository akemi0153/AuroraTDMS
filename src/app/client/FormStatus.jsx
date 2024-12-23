"use client";

import React, { useState, useEffect } from "react";
import { databases } from "@/services/appwrite";
import { Query } from "appwrite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
} from "lucide-react";

const FormStatus = () => {
  const [formStatuses, setFormStatuses] = useState([]);
  const [accommodationDetails, setAccommodationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) throw new Error("No user logged in");

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

  const fetchAccommodationDetails = async (userId) => {
    const response = await databases.listDocuments(
      "672cfccb002f456cb332",
      "6741d7f2000200706b21",
      [Query.equal("userId", userId), Query.limit(1)]
    );
    return response.documents[0] || null;
  };

  const fetchFormStatuses = async (userId) => {
    try {
      const response = await databases.listDocuments(
        "672cfccb002f456cb332",
        "6741d7f2000200706b21",
        [
          Query.equal("userId", userId),
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

  const handleSubmitNewForm = () => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      router.push(`/tourism-form?userId=${userId}`);
    } else {
      console.error("No userId found in session storage");
    }
  };

  const renderAccommodationDetails = () => {
    if (!accommodationDetails) {
      return (
        <Card className="w-full max-w-2xl mx-auto mb-8">
          <CardContent className="p-6">
            <p className="text-gray-500 text-center">
              No accommodation details found.
            </p>
          </CardContent>
        </Card>
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
    } = accommodationDetails;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl mx-auto mb-8 overflow-hidden">
          <CardHeader className="bg-indigo-600 text-white">
            <CardTitle className="text-2xl">Accommodation Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem
                icon={Building}
                label="Establishment"
                value={establishmentName}
              />
              <DetailItem
                icon={MapPin}
                label="Municipality"
                value={municipality}
              />
              <DetailItem
                icon={MapPin}
                label="Address"
                value={businessAddress}
              />
              <DetailItem
                icon={FileText}
                label="License Number"
                value={licenseNumber}
              />
              <DetailItem
                icon={FileText}
                label="Accreditation Number"
                value={accreditationNumber}
              />
              <DetailItem
                icon={Calendar}
                label="Expiration Date"
                value={new Date(expirationDate).toLocaleDateString()}
              />
              <DetailItem
                icon={Phone}
                label="Contact Number"
                value={contactNumber}
              />
              <DetailItem icon={Mail} label="Email" value={email} />
              <DetailItem
                icon={FileText}
                label="Accommodation ID"
                value={accommodationId}
              />
              <DetailItem icon={Clock} label="Status" value={status} />
              <DetailItem
                icon={Calendar}
                label="Appointment Date"
                value={
                  appointmentDate
                    ? new Date(appointmentDate).toLocaleString()
                    : "Not scheduled"
                }
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-2">
      <Icon className="text-indigo-500" size={20} />
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-sm text-gray-900">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {renderAccommodationDetails()}

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-indigo-700 mb-6"
      >
        Your Accommodation Form Statuses
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          onClick={handleSubmitNewForm}
          className="mb-6 bg-indigo-600 hover:bg-indigo-700"
        >
          Submit New Accommodation Form
        </Button>
      </motion.div>

      {formStatuses.length === 0 ? (
        <p className="text-gray-500 text-center">
          You haven't submitted any accommodation forms yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {formStatuses.map((form, index) => (
            <motion.div
              key={form.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center text-lg">
                    <span className="truncate">{form.establishmentName}</span>
                    <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                      {getStatusIcon(form.status)}
                      <span className="text-sm font-medium">
                        {form.status || "Pending"}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-1">
                    Submitted: {new Date(form.$createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    Appointment:{" "}
                    {form.appointmentDate
                      ? new Date(form.appointmentDate).toLocaleString()
                      : "Not scheduled yet"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Form ID: {form.accommodationId || "N/A"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormStatus;
