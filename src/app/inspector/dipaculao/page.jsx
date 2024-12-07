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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { fetchSpecificAccommodations } from "@/services/appwrite";

export default function DipaculaoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [accommodations, setAccommodations] = useState([]);
  const [approvedList, setApprovedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadAccommodations = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchSpecificAccommodations("Dipaculao");
        setAccommodations(data); // Set the fetched accommodations
      } catch (err) {
        setError("Failed to fetch accommodations");
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    loadAccommodations();
  }, []);

  // Filtered accommodations based on search
  const filteredAccommodations = accommodations.filter((acc) =>
    acc.establishmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleSetAppointment = (establishment) => {
    setSelectedEstablishment(establishment);
    setAppointmentModalOpen(true);
  };

  const handleAppointmentSubmit = () => {
    if (!appointmentDate) {
      toast.error("Please select a date and time");
      return;
    }

    // Move establishment to approved list
    setApprovedList((prev) => [...prev, selectedEstablishment]);
    setAccommodations((prev) =>
      prev.filter((item) => item.$id !== selectedEstablishment.$id)
    );

    // Reset modal state
    setAppointmentModalOpen(false);
    setSelectedEstablishment(null);
    setAppointmentDate(null);

    toast.success("Appointment successfully set!");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={`fixed inset-y-0 z-50 flex w-64 flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}
      >
        <div className="flex h-16 items-center justify-center border-b">
          <span className="text-xl font-semibold">Dipaculao Dashboard</span>
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
          <h1 className="mb-6 text-3xl font-bold">Dipaculao Overview</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Total Establishments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "Loading..." : accommodations.length + approvedList.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Pending List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accommodations.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Approved List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedList.length}</div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Pending Establishments</h2>
            <Card className="mt-4">
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccommodations.map((accommodation) => (
                      <TableRow
                        key={
                          accommodation.$id || accommodation.establishmentName
                        }
                      >
                        <TableCell className="font-medium">
                          {accommodation.establishmentName}
                        </TableCell>
                        <TableCell>{accommodation.municipality}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            onClick={() => handleSetAppointment(accommodation)}
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
      <Sheet open={isAppointmentModalOpen} onOpenChange={setAppointmentModalOpen}>
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
      <ToastContainer />
    </div>
  );
}
