"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Users,
  FileCheck2,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
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
import {
  fetchSpecificAccommodations,
  getCurrentUser,
  signOut,
} from "@/services/appwrite";
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
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SettingsPage from "./settings";

export default function MariaAuroraPage() {
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
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [isDeclineModalOpen, setDeclineModalOpen] = useState(false);
  const [establishmentToDecline, setEstablishmentToDecline] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    total: { count: 0, change: 0, trend: [] },
    pending: { count: 0, change: 0, trend: [] },
    approved: { count: 0, change: 0, trend: [] },
    declined: { count: 0, change: 0, trend: [] },
  });

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          toast.error("Please log in first");
          router.push("/login");
          return;
        }

        setCurrentUser({
          name: user.name,
          role: user.role,
          municipality: user.municipality,
        });

        if (user.role !== "inspector" || user.municipality !== "Maria Aurora") {
          setIsAuthorized(false);
          setAuthChecked(true);

          setTimeout(() => {
            if (user.role === "inspector") {
              switch (user.municipality) {
                case "Baler":
                  router.push("/inspector/baler");
                  break;
                case "San Luis":
                  router.push("/inspector/sanluis");
                  break;
                case "Dipaculao":
                  router.push("/inspector/dipaculao");
                  break;
                default:
                  router.push("/login");
              }
            } else {
              switch (user.role) {
                case "admin":
                  router.push("/admin");
                  break;
                case "user":
                  router.push("/client");
                  break;
                default:
                  router.push("/login");
              }
            }
          }, 3000);
          return;
        }

        setIsAuthorized(true);
        setAuthChecked(true);
      } catch (error) {
        toast.error("Authentication error");
        router.push("/login");
      }
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    const loadAccommodations = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchSpecificAccommodations("Maria Aurora");
        setAccommodations(data);

        // Calculate counts for each status
        const pending = data.filter((acc) => acc.status === "pending").length;
        const approved = data.filter((acc) => acc.status === "approved").length;
        const declined = data.filter((acc) => acc.status === "declined").length;

        // Update analytics data
        setAnalyticsData({
          total: {
            count: data.length,
            change: 20,
            trend: generateTrend(),
          },
          pending: {
            count: pending,
            change: 5,
            trend: generateTrend(),
          },
          approved: {
            count: approved,
            change: 10,
            trend: generateTrend(),
          },
          declined: {
            count: declined,
            change: -2,
            trend: generateTrend(),
          },
        });
      } catch (err) {
        setError("Failed to fetch accommodations");
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    loadAccommodations();
  }, []);

  const generateTrend = () => {
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
  };

  const filteredAccommodations = accommodations.filter((acc) =>
    acc.establishmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout properly");
      window.location.href = "/login";
    }
  };

  const handleSetAppointment = (establishment) => {
    if (establishment.appointmentDate) {
      toast.error(
        "An appointment has already been set for this establishment."
      );
    } else {
      setSelectedEstablishment(establishment);
      setAppointmentModalOpen(true);
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
        "672cfccb002f456cb332",
        "6741d7f2000200706b21",
        selectedEstablishment.$id,
        {
          appointmentDate: formattedDate,
        }
      );

      setAccommodations(
        accommodations.map((acc) =>
          acc.$id === selectedEstablishment.$id
            ? {
                ...acc,
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
        "672cfccb002f456cb332",
        "6741d7f2000200706b21",
        id,
        { status: status }
      );
      console.log(`Status updated in database for establishment ${id}`);
    } catch (error) {
      toast.error("Failed to update status in database. Please try again.");
    }
  };

  const handleApprovalStatus = async (id, newStatus) => {
    try {
      const establishment = accommodations.find((acc) => acc.$id === id);

      if (!establishment.appointmentDate) {
        toast.error("An appointment must be set before changing the status.");
        return;
      }

      if (
        establishment.status === "approved" ||
        establishment.status === "declined"
      ) {
        toast.error(
          `Cannot change status of an establishment that is already ${establishment.status}.`
        );
        return;
      }

      if (newStatus === "declined") {
        setEstablishmentToDecline({ id, currentStatus: establishment.status });
        setDeclineModalOpen(true);
        return;
      }

      await updateStatusInDatabase(id, newStatus);
      setAccommodations(
        accommodations.map((acc) =>
          acc.$id === id ? { ...acc, status: newStatus } : acc
        )
      );
      toast.success(`Establishment status updated to ${newStatus}.`);
    } catch (error) {
      toast.error("Failed to update status. Please try again.");
    }
  };

  const handleDeclineSubmit = async () => {
    if (!declineReason.trim()) {
      toast.error("Please provide a reason for declining");
      return;
    }

    try {
      await databases.updateDocument(
        "672cfccb002f456cb332",
        "6741d7f2000200706b21",
        establishmentToDecline.id,
        {
          status: "declined",
          declineReason: declineReason,
        }
      );

      setAccommodations(
        accommodations.map((acc) =>
          acc.$id === establishmentToDecline.id
            ? { ...acc, status: "declined", declineReason }
            : acc
        )
      );

      setDeclineModalOpen(false);
      setDeclineReason("");
      setEstablishmentToDecline(null);
      toast.success("Establishment declined successfully");
    } catch (error) {
      toast.error("Failed to decline establishment");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "approved":
        return "bg-green-100 text-green-800 border border-green-300";
      case "declined":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
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
      default:
        return null;
    }
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  };

  const slideIn = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.5 },
  };

  const renderSparkline = (data, color) => (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data.map((value, index) => ({ value, index }))}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderCardContent = (title, icon, data, color, sparklineColor) => (
    <Card
      className={`bg-gradient-to-br from-${color}-500 to-${color}-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {React.cloneElement(icon, { className: "h-4 w-4" })}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.count}</div>
        <div className="flex items-center text-xs mt-1">
          {data.change > 0 ? (
            <ArrowUpRight className="mr-1 h-3 w-3 text-green-300" />
          ) : (
            <ArrowDownRight className="mr-1 h-3 w-3 text-red-300" />
          )}
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <span
                  className={
                    data.change > 0 ? "text-green-300" : "text-red-300"
                  }
                >
                  {Math.abs(data.change)}% from last period
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compared to the previous month</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
        <div className="h-10 mt-2">
          {renderSparkline(data.trend, sparklineColor)}
        </div>
      </CardContent>
    </Card>
  );

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-500 to-pink-600">
        <motion.div
          className="text-center text-white"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Checking authorization...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-red-500 to-pink-600">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-500 mb-2">
              Unauthorized Access
            </h1>
            <p className="text-gray-600 mb-4">
              You are not authorized to access the Maria Aurora dashboard.
              Redirecting you to the appropriate page...
            </p>
            <div className="animate-pulse">
              <div className="h-2 bg-red-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <motion.aside
        className="fixed inset-y-0 z-50 flex w-64 flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex h-16 items-center justify-center border-b">
          <span className="text-xl font-semibold text-purple-600">
            Maria Aurora Dashboard
          </span>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="flex flex-col space-y-1 px-3">
            <Button
              variant="ghost"
              className={`justify-start ${
                !showSettings ? "bg-purple-100 text-purple-700" : ""
              }`}
              onClick={() => setShowSettings(false)}
            >
              <Building2 className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`justify-start ${
                showSettings ? "bg-purple-100 text-purple-700" : ""
              }`}
              onClick={() => setShowSettings(true)}
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="justify-start mt-auto text-red-600 hover:bg-red-100 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </nav>
      </motion.aside>
      <main className="flex-1 overflow-auto">
        <motion.header
          className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-6 shadow-sm"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search establishments..."
                className="w-[300px] pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </motion.header>
        <div className="container mx-auto p-6">
          {showSettings ? (
            <SettingsPage />
          ) : (
            <>
              <motion.h1
                className="mb-6 text-3xl font-bold text-purple-800"
                variants={fadeIn}
                initial="initial"
                animate="animate"
              >
                Maria Aurora Overview
              </motion.h1>
              <motion.div
                className="mb-6 text-lg text-purple-600"
                variants={fadeIn}
                initial="initial"
                animate="animate"
              >
                Welcome, {currentUser?.name || "Inspector"}! You are logged in
                as an inspector for Maria Aurora.
              </motion.div>
              <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                variants={fadeIn}
                initial="initial"
                animate="animate"
              >
                <motion.div
                  variants={slideIn}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCardContent(
                    "Total Establishments",
                    <Users className="h-8 w-8 text-purple-100" />,
                    analyticsData.total,
                    "purple",
                    "#9f7aea"
                  )}
                </motion.div>
                <motion.div
                  variants={slideIn}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCardContent(
                    "Pending Review",
                    <AlertCircle className="h-8 w-8 text-yellow-100" />,
                    analyticsData.pending,
                    "yellow",
                    "#ffd700"
                  )}
                </motion.div>
                <motion.div
                  variants={slideIn}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCardContent(
                    "Approved Establishments",
                    <FileCheck2 className="h-8 w-8 text-green-100" />,
                    analyticsData.approved,
                    "green",
                    "#48bb78"
                  )}
                </motion.div>
                <motion.div
                  variants={slideIn}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCardContent(
                    "Declined Establishments",
                    <XCircle className="h-8 w-8 text-red-100" />,
                    analyticsData.declined,
                    "red",
                    "#f56565"
                  )}
                </motion.div>
              </motion.div>
              <motion.div
                className="mt-8"
                variants={fadeIn}
                initial="initial"
                animate="animate"
              >
                <h2 className="text-2xl font-semibold mb-4 text-purple-700">
                  Establishments
                </h2>
                <Card className="overflow-hidden">
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
                        <TableRow className="bg-purple-50">
                          <TableHead className="font-semibold text-purple-900">
                            Establishment Name
                          </TableHead>
                          <TableHead className="font-semibold text-purple-900">
                            Municipality
                          </TableHead>
                          <TableHead className="font-semibold text-purple-900">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold text-purple-900">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAccommodations.map((accommodation) => (
                          <TableRow
                            key={accommodation.$id}
                            className="hover:bg-gray-50"
                          >
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
                                    )} px-2 py-1 text-xs font-semibold rounded-full`}
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
                                    disabled={
                                      !accommodation.appointmentDate ||
                                      accommodation.status === "approved" ||
                                      accommodation.status === "declined"
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
                                    disabled={
                                      !accommodation.appointmentDate ||
                                      accommodation.status === "approved" ||
                                      accommodation.status === "declined"
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
                                  size="sm"
                                  onClick={() =>
                                    handleSetAppointment(accommodation)
                                  }
                                  className="text-purple-600 border-purple-600 hover:bg-purple-50"
                                >
                                  {accommodation.appointmentDate
                                    ? "Appointment Set"
                                    : "Set Appointment"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleViewEstablishment(accommodation)
                                  }
                                  className="text-pink-600 border-pink-600 hover:bg-pink-50"
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
              </motion.div>
            </>
          )}
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
                        <span>
                          {key === "declineReason" && !value ? "N/A" : value}
                        </span>
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
      <Dialog open={isDeclineModalOpen} onOpenChange={setDeclineModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Establishment</DialogTitle>
            <DialogDescription>
              Please provide a reason for declining this establishment
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4">
              <label htmlFor="declineReason" className="text-sm font-medium">
                Reason for Declining
              </label>
              <textarea
                id="declineReason"
                className="min-h-[100px] w-full rounded-md border p-3"
                placeholder="Enter reason..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeclineModalOpen(false);
                  setDeclineReason("");
                  setEstablishmentToDecline(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleDeclineSubmit}>Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
}
