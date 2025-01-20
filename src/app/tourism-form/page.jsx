"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from "@/components/modal";
import { useAuthUserStore } from "@/services/user";
import { createDocument, signOut, uploadImage } from "@/services/appwrite";
import BasicInfo from "./BasicInfo";
import Facilities from "./Facilities";
import Rooms from "./Rooms";
import Cottages from "./Cottages";
import Services from "./Services";
import Employees from "./Employees";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function TourismForm() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm();

  const { authUser, clearAuthUser } = useAuthUserStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      clearAuthUser();
      toast.success("Successfully logged out.");
      router.push("/login");
    } catch (error) {
      toast.error("Error logging out. Please try again.");
    }
  };

  const normalizeUrl = (url) => {
    if (!/^https?:\/\//.test(url)) {
      return `http://${url}`;
    }
    return url;
  };

  const onSubmit = async (data) => {
    const accommodationId = uuidv4();
    setIsLoading(true);
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        throw new Error("User is not logged in.");
      }

      // Upload images if they exist
      let lguLicenseFileId = null;
      let dotAccreditationFileId = null;

      // Get files from form data
      const lguLicenseFile = data.lguLicenseFile;
      const dotAccreditationFile = data.dotAccreditationFile;

      // Upload LGU License image
      if (lguLicenseFile) {
        try {
          lguLicenseFileId = await uploadImage(
            lguLicenseFile,
            "6789e834002216f21c5c" // Storage Bucket ID
          );
        } catch (error) {
          console.error("Error uploading LGU License:", error);
          toast.error("Failed to upload LGU License image");
        }
      }

      // Upload DOT Accreditation image
      if (dotAccreditationFile) {
        try {
          dotAccreditationFileId = await uploadImage(
            dotAccreditationFile,
            "6789e834002216f21c5c" // Storage Bucket ID
          );
        } catch (error) {
          console.error("Error uploading DOT Accreditation:", error);
          toast.error("Failed to upload DOT Accreditation image");
        }
      }

      // Check for existing submission
      try {
        const response = await fetch(
          `/app/api/check-submission?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to check submission status");
        }
        const existingSubmission = await response.json();

        if (existingSubmission.exists) {
          toast.error(
            "You have already submitted a form. Only one submission is allowed."
          );
          router.push("/client");
          return;
        }
      } catch (error) {
        console.error("Error checking submission:", error);
      }

      // Normalize website URL
      const normalizedWebsite = data.website ? normalizeUrl(data.website) : "";

      // Validate email format
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error("Invalid email address format");
      }

      // Create basic info document with image IDs
      const basicInfoResult = await createDocument("6741d7f2000200706b21", {
        accommodationId,
        municipality: data.municipality,
        establishmentName: data.establishmentName,
        businessAddress: data.businessAddress,
        contactNumber: data.contactNumber,
        accreditationNumber: data.accreditationNumber,
        expirationDate: data.expirationDate,
        licenseNumber: data.licenseNumber,
        contactPerson: data.contactPerson,
        designation: data.designation,
        email: data.email,
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter,
        website: normalizedWebsite,
        bookingCompany: data.bookingCompany,
        lguLicenseImageId: lguLicenseFileId,
        dotAccreditationImageId: dotAccreditationFileId,
        status: "Awaiting Inspection",
        userId,
        declineReason: "",
      });

      if (!basicInfoResult) {
        throw new Error("Failed to create basic info document");
      }

      // Create facilities document
      const facilitiesData = {
        accommodationId,
        // ... rest of your facilities data
      };
      await createDocument("6741e31a0022f8e43fb3", facilitiesData);

      // Create rooms document if rooms data exists
      if (data.acRooms?.length || data.fanRooms?.length) {
        const roomsData = {
          accommodationId,
          acRoomtype: data.acRooms?.map((room) => room.type || "") || [],
          acRoomnum:
            data.acRooms?.map((room) => parseInt(room.number) || 0) || [],
          acBedtype: data.acRooms?.map((room) => room.bedType || "") || [],
          acRoomcapacity:
            data.acRooms?.map((room) => parseInt(room.capacity) || 0) || [],
          acRoomrate:
            data.acRooms?.map((room) => parseFloat(room.rate) || 0.0) || [],
          acRoomamenities:
            data.acRooms?.map((room) => room.amenities || "") || [],
          fanRoomtype: data.fanRooms?.map((room) => room.type || "") || [],
          fanRoomnum:
            data.fanRooms?.map((room) => parseInt(room.number) || 0) || [],
          fanBedtype: data.fanRooms?.map((room) => room.bedType || "") || [],
          fanRoomcapacity:
            data.fanRooms?.map((room) => parseInt(room.capacity) || 0) || [],
          fanRoomrate:
            data.fanRooms?.map((room) => parseFloat(room.rate) || 0.0) || [],
          fanRoomamenities:
            data.fanRooms?.map((room) => room.amenities || "") || [],
        };
        await createDocument("6742f65c003e2169aa2b", roomsData);
      }

      // Create cottages document if cottages data exists
      if (
        data.acCottages?.length ||
        data.nonAcCottages?.length ||
        data.tents?.length
      ) {
        const cottagesData = {
          accommodationId,
          acCottagesname:
            data.acCottages?.map((cottage) => cottage.name || "") || [],
          acCottagessize:
            data.acCottages?.map((cottage) => cottage.size || "") || [],
          acCottagescapacity:
            data.acCottages?.map(
              (cottage) => parseInt(cottage.capacity) || 0
            ) || [],
          acCottagesrate:
            data.acCottages?.map(
              (cottage) => parseFloat(cottage.rate) || 0.0
            ) || [],
          acCottagesamenities:
            data.acCottages?.map((cottage) => cottage.amenities || "") || [],
          nonacCottagesname:
            data.nonAcCottages?.map((cottage) => cottage.name || "") || [],
          nonacCottagessize:
            data.nonAcCottages?.map((cottage) => cottage.size || "") || [],
          nonacCottagescapacity:
            data.nonAcCottages?.map(
              (cottage) => parseInt(cottage.capacity) || 0
            ) || [],
          nonacCottagesrate:
            data.nonAcCottages?.map(
              (cottage) => parseFloat(cottage.rate) || 0.0
            ) || [],
          nonacCottagesamenities:
            data.nonAcCottages?.map((cottage) => cottage.amenities || "") || [],
          tentsName: data.tents?.map((tent) => tent.name || "") || [],
          tentSize: data.tents?.map((tent) => tent.size || "") || [],
          tentCapacity:
            data.tents?.map((tent) => parseInt(tent.capacity) || 0) || [],
          tentRate:
            data.tents?.map((tent) => parseFloat(tent.rate) || 0.0) || [],
          tentAmenities: data.tents?.map((tent) => tent.amenities || "") || [],
        };
        await createDocument("674342ba0017b324fb03", cottagesData);
      }

      // Create services document
      const servicesData = {
        accommodationId,
        // ... services data
      };
      await createDocument("6743c72d003a2d3b298d", servicesData);

      // Create employees document
      const employeesData = {
        accommodationId,
        localmaleNum: parseInt(data.localmaleNum) || 0,
        localfemaleNum: parseInt(data.localfemaleNum) || 0,
        foreignmaleNum: parseInt(data.foreignmaleNum) || 0,
        foreignfemaleNum: parseInt(data.foreignfemaleNum) || 0,
      };
      await createDocument("67432e7e00241eb80e40", employeesData);

      // Success handling
      sessionStorage.setItem("formSubmitted", "true");
      toast.success("Form submitted successfully!");
      router.push("/client");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to submit form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Map the tab order for navigation
  const tabOrder = [
    "basic",
    "facilities",
    "rooms",
    "cottages",
    "services",
    "employees",
  ];

  // Function to navigate to the next tab
  const handleNext = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    } else {
      methods.handleSubmit(onSubmit)();
    }
  };

  // Function to navigate to the previous tab
  const handlePrevious = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  return authUser ? (
    <FormProvider {...methods}>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Tourism Accommodation Inspection Form</CardTitle>
              <Button variant="outline" onClick={() => router.push("/client")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="facilities">Facilities</TabsTrigger>
                  <TabsTrigger value="rooms">Rooms</TabsTrigger>
                  <TabsTrigger value="cottages">Cottages & Villas</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="employees">Employees</TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                  <BasicInfo />
                </TabsContent>
                <TabsContent value="facilities">
                  <Facilities />
                </TabsContent>
                <TabsContent value="rooms">
                  <Rooms />
                </TabsContent>
                <TabsContent value="cottages">
                  <Cottages />
                </TabsContent>
                <TabsContent value="services">
                  <Services />
                </TabsContent>
                <TabsContent value="employees">
                  <Employees />
                </TabsContent>
              </Tabs>
              <div className="flex justify-between">
                {activeTab !== "basic" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                  >
                    Previous
                  </Button>
                )}
                <Button type="button" onClick={handleNext} disabled={isLoading}>
                  {isLoading
                    ? "Submitting..."
                    : activeTab === "employees"
                    ? "Submit"
                    : "Next"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  ) : (
    <Modal isOpen={true} onClose={() => router.push("/login")}>
      <div>
        <h2 className="text-lg font-semibold">Login Required</h2>
        <p className="mt-2">You must be logged in to access this page.</p>
      </div>
    </Modal>
  );
}
