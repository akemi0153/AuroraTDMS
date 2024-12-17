"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Building2,
  Search,
  Bell,
  Settings,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  FileCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { fetchSpecificAccommodations } from "@/services/appwrite";
import { databases } from "@/services/appwrite";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function BalerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [viewEstablishment, setViewEstablishment] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadAccommodations = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchSpecificAccommodations("Baler");
        setAccommodations(data);
      } catch (err) {
        setError("Failed to fetch accommodations");
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    loadAccommodations();
  }, []);

  const filteredAccommodations = accommodations.filter((acc) =>
    acc.establishmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleSetAppointment = (establishment) => {
    if (establishment.status === "ApprovedAttachment") {
      toast.error(
        "An appointment has already been set for this establishment."
      );
    } else if (establishment.status === "approved") {
      setSelectedEstablishment(establishment);
      setAppointmentModalOpen(true);
    } else {
      toast.error("You can only set appointments for approved establishments.");
    }
  };

  const handleAppointmentSubmit = async () => {
    if (!appointmentDate) {
      toast.error("Please select a date and time");
      return;
    }

    try {
      const formattedDate = appointmentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      await databases.updateDocument(
        "672cfccb002f456cb332", // Replace with your database ID
        "6741d7f2000200706b21", // Replace with your collection ID
        selectedEstablishment.$id,
        {
          status: "approved",
          appointmentDate: formattedDate,
        }
      );

      setAccommodations(
        accommodations.map((acc) =>
          acc.$id === selectedEstablishment.$id
            ? {
                ...acc,
                status: "ApprovedAttachment",
                appointmentDate: formattedDate,
              }
            : acc
        )
      );

      setAppointmentModalOpen(false);
      setSelectedEstablishment(null);
      setAppointmentDate(null);

      toast.success("Appointment successfully set!");
    } catch (error) {
      console.error("Error setting appointment:", error);
      toast.error("Failed to set appointment. Please try again.");
    }
  };

  const handleViewEstablishment = (establishment) => {
    setViewEstablishment(establishment);
    setViewModalOpen(true);
  };

  const updateStatusInDatabase = async (id, status) => {
    try {
      await databases.updateDocument(
        "672cfccb002f456cb332", // Replace with your database ID
        "6741d7f2000200706b21", // Replace with your collection ID
        id,
        { status: status }
      );
      console.log(`Status updated in database for establishment ${id}`);
    } catch (error) {
      console.error("Error updating status in database:", error);
      toast.error("Failed to update status in database. Please try again.");
    }
  };

  const handleApprovalStatus = async (id, status) => {
    try {
      const establishment = accommodations.find((acc) => acc.$id === id);
      if (
        establishment.status === "approved" ||
        establishment.status === "ApprovedAttachment"
      ) {
        toast.error("Cannot change status of an approved form.");
        return;
      }
      await updateStatusInDatabase(id, status);
      setAccommodations(
        accommodations.map((acc) => (acc.$id === id ? { ...acc, status } : acc))
      );
      toast.success(`Establishment status updated to ${status}.`);
    } catch (error) {
      console.error("Error updating approval status:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "declined":
        return "bg-red-500";
      case "ApprovedAttachment":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />;
      case "approved":
        return <CheckCircle className="h-5 w-5" />;
      case "declined":
        return <XCircle className="h-5 w-5" />;
      case "ApprovedAttachment":
        return <FileCheck className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="fixed inset-y-0 z-50 flex w-64 flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0">
        <div className="flex h-16 items-center justify-center border-b">
          <span className="text-xl font-semibold">Baler Dashboard</span>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="flex flex-col space-y-1 px-3">
            <Button
              variant="ghost"
              className={`justify-start ${
                pathname === "/" ? "bg-gray-100" : ""
              }`}
              asChild
            >
              <Link href="/">
                <Building2 className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`justify-start ${
                pathname === "/settings" ? "bg-gray-100" : ""
              }`}
              asChild
            >
              <Link href="/settings">
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="justify-start mt-auto"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <form className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search establishments..."
                className="w-[300px] pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <div className="container mx-auto p-6">
          <h1 className="mb-6 text-3xl font-bold">Baler Overview</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Total Establishments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {accommodations.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    accommodations.filter((acc) => acc.status === "pending")
                      .length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    accommodations.filter((acc) => acc.status === "approved")
                      .length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Appointments Set
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    accommodations.filter(
                      (acc) => acc.status === "ApprovedAttachment"
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Establishments</h2>
            <Card>
              {loading ? (
                <div className="flex h-32 items-center justify-center">
                  <p>Loading data...</p>
                </div>
              ) : error ? (
                <div className="flex h-32 items-center justify-center">
                  <p>{error}</p>
                </div>
              ) : filteredAccommodations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Establishment Name</TableHead>
                      <TableHead>Municipality</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccommodations.map((accommodation) => (
                      <TableRow key={accommodation.$id}>
                        <TableCell className="font-medium">
                          {accommodation.establishmentName}
                        </TableCell>
                        <TableCell>{accommodation.municipality}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Badge
                                className={`cursor-pointer ${getStatusColor(
                                  accommodation.status
                                )}`}
                              >
                                {getStatusIcon(accommodation.status)}
                                <span className="ml-2">
                                  {accommodation.status}
                                </span>
                              </Badge>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleApprovalStatus(
                                    accommodation.$id,
                                    "approved"
                                  )
                                }
                              >
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleApprovalStatus(
                                    accommodation.$id,
                                    "declined"
                                  )
                                }
                              >
                                Decline
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleSetAppointment(accommodation)
                              }
                              disabled={accommodation.status !== "approved"}
                            >
                              Set Appointment
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleViewEstablishment(accommodation)
                              }
                            >
                              View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-32 items-center justify-center">
                  <p>No establishments found.</p>
                </div>
              )}
            </Card>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Form Status History</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Establishment Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accommodations.map((accommodation) => (
                    <TableRow key={accommodation.$id}>
                      <TableCell className="font-medium">
                        {accommodation.establishmentName}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(accommodation.status)}>
                          {getStatusIcon(accommodation.status)}
                          <span className="ml-2">{accommodation.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(accommodation.$updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "2-digit",
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </main>
      <Sheet
        open={isAppointmentModalOpen}
        onOpenChange={setAppointmentModalOpen}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              Set Appointment for {selectedEstablishment?.establishmentName}
            </SheetTitle>
            <SheetDescription>
              Choose a date and time for the appointment
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="appointmentDate"
                className="block text-sm font-medium"
              >
                Appointment Date
              </label>
              <DatePicker
                id="appointmentDate"
                selected={appointmentDate}
                onChange={(date) => setAppointmentDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="mt-1 w-full rounded-md border p-2"
                placeholderText="Select a date"
                minDate={new Date()}
              />
            </div>
            <Button onClick={handleAppointmentSubmit} className="w-full">
              Confirm Appointment
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <Dialog open={isViewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{viewEstablishment?.establishmentName}</DialogTitle>
            <DialogDescription>Establishment Details</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Accommodations</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="cottages">Cottages</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {viewEstablishment &&
                  Object.entries(viewEstablishment)
                    .filter(
                      ([key]) =>
                        ![
                          "userId",
                          "date",
                          "time",
                          "$id",
                          "$createdAt",
                          "$updatedAt",
                          "$permissions",
                          "$databaseId",
                          "$collectionId",
                        ].includes(key)
                    )
                    .map(([key, value]) => (
                      <div key={key} className="mb-2">
                        <strong className="capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </strong>{" "}
                        <span>{value}</span>
                      </div>
                    ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="services">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {/* Add services rendering logic here */}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="rooms">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {/* Add rooms rendering logic here */}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="cottages">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {/* Add cottages rendering logic here */}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="facilities">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {/* Add facilities rendering logic here */}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="employees">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {/* Add employees rendering logic here */}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
}
