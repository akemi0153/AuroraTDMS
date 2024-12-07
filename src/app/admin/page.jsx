"use client";

import React, { useEffect, useState } from "react";
import {
  fetchAccommodations,
  fetchMunicipalityData,
} from "@/services/appwrite";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/modal";
import { useAuthUserStore } from "@/services/user";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  XIcon,
  LogOut,
  Calendar,
  Building2,
  Search,
  Menu,
  User,
  Bell,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addDays } from "date-fns";

export default function MunicipalityInspectorDashboard() {
  const [accommodations, setAccommodations] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { authUser, clearAuthUser } = useAuthUserStore();
  const [municipalityTotals, setMunicipalityTotals] = useState({});

  const calculateTotals = (data) => {
    const totals = data.reduce((acc, item) => {
      const municipality = item.municipality;
      if (!acc[municipality]) {
        acc[municipality] = 0;
      }
      acc[municipality] += 1;
      return acc;
    }, {});
    return totals;
  };

  useEffect(() => {
    if (!authUser) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [authUser]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const accommodationsData = await fetchAccommodations();
        setAccommodations(accommodationsData);
        const totals = calculateTotals(accommodationsData);
        setMunicipalityTotals(totals);
      } catch (error) {
        toast.error("Failed to load accommodations.");
        setAccommodations([]);
        setMunicipalityTotals({});
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    clearAuthUser();
    toast.success("You have been successfully logged out.");
    router.push("/login");
  };

  const handleSetAppointment = (establishment) => {
    if (establishment) {
      setSelectedEstablishment(establishment);
      setAppointmentModalOpen(true);
    } else {
      toast.error("Establishment data is missing.");
    }
  };

  const handleAppointmentSubmit = () => {
    if (appointmentDate && appointmentDate >= new Date()) {
      toast.success(
        `Appointment set for ${
          selectedEstablishment.establishmentName
        } on ${appointmentDate.toLocaleString()}`
      );
      setAppointmentModalOpen(false);
    } else if (appointmentDate < new Date()) {
      toast.error(
        "Cannot set an appointment in the past. Please select a future date."
      );
    } else {
      toast.error("Please select a valid date.");
    }
  };

  const filteredAccommodations = accommodations.filter(
    (accommodation) =>
      (selectedMunicipality === "All" ||
        accommodation.municipality === selectedMunicipality) &&
      (accommodation.establishmentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        accommodation.municipality
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  if (!authUser) {
    return (
      <Modal isOpen={isModalOpen} onClose={handleLogout} title="Login Required">
        <div className="mt-2">
          <p>You must be logged in to access this page.</p>
        </div>
        <div className="mt-5 flex justify-center">
          <Button onClick={handleLogout}>Close</Button>
        </div>
      </Modal>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={`fixed inset-y-0 z-50 flex w-64 flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-center border-b">
          <span className="text-xl font-semibold">Inspector Dashboard</span>
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
                pathname === "/appointments" ? "bg-gray-100" : ""
              }`}
              asChild
            >
              <Link href="/appointments">
                <Calendar className="mr-2 h-5 w-5" />
                Appointments
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
          </div>
        </nav>
        <div className="border-t p-4">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-6 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="container mx-auto p-6">
          <h1 className="mb-6 text-3xl font-bold">Municipality Overview</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Establishments
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {accommodations.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across all municipalities
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Municipalities
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {Object.keys(municipalityTotals).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      With registered establishments
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Inspections
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">
                  Data not available
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Inspections
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">
                  Data not available
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Establishments</h2>
              <Select
                value={selectedMunicipality}
                onValueChange={setSelectedMunicipality}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Municipality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Municipalities</SelectItem>
                  {Object.keys(municipalityTotals).map((municipality) => (
                    <SelectItem key={municipality} value={municipality}>
                      {municipality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Card className="mt-4">
              {isLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <p>Loading establishments...</p>
                </div>
              ) : filteredAccommodations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Establishment Name</TableHead>
                      <TableHead>Municipality</TableHead>
                      <TableHead>Business Address</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccommodations.map((accommodation) => (
                      <TableRow key={accommodation.$id}>
                        <TableCell className="font-medium">
                          {accommodation.establishmentName}
                        </TableCell>
                        <TableCell>{accommodation.municipality}</TableCell>
                        <TableCell>{accommodation.businessAddress}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleSetAppointment(accommodation)}
                            size="sm"
                          >
                            Set Appointment
                          </Button>
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
                filterDate={(date) => date >= new Date()}
              />
            </div>
            <Button onClick={handleAppointmentSubmit} className="w-full">
              Confirm Appointment
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <ToastContainer />
    </div>
  );
}
