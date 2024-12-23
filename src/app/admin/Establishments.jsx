import React, { useState, useEffect } from "react";
import { Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fetchAccommodations } from "@/services/appwrite";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Establishments() {
  const [establishments, setEstablishments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMunicipality, setSelectedMunicipality] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadEstablishments = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAccommodations();
        setEstablishments(data || []); // Ensure we always set an array
      } catch (error) {
        console.error("Failed to fetch establishments:", error);
        toast.error("Failed to load establishments");
        setEstablishments([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    loadEstablishments();
  }, []);

  const filteredEstablishments = establishments.filter(
    (establishment) =>
      selectedMunicipality === "All" ||
      establishment.municipality === selectedMunicipality
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEstablishments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEstablishments.length / itemsPerPage);

  const handleViewEstablishment = (establishment) => {
    setSelectedEstablishment(establishment);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Establishments</h2>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedMunicipality}
            onValueChange={setSelectedMunicipality}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Municipality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Municipalities</SelectItem>
              {Array.from(
                new Set(establishments.map((e) => e.municipality))
              ).map((municipality) => (
                <SelectItem key={municipality} value={municipality}>
                  {municipality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card className="dark:bg-gray-800">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading establishments...</p>
          </div>
        ) : establishments && establishments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-sky-50 hover:bg-sky-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200">
                <TableHead className="font-semibold">
                  Establishment Name
                </TableHead>
                <TableHead className="font-semibold">Municipality</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((establishment) => (
                <TableRow
                  key={establishment.$id}
                  className="hover:bg-sky-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <TableCell className="font-medium">
                    {establishment.establishmentName}
                  </TableCell>
                  <TableCell>{establishment.municipality}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        establishment.status === "Approved" ||
                        establishment.status === "Approve"
                          ? "bg-blue-100 text-blue-800"
                          : establishment.status === "Pending"
                          ? "bg-orange-100 text-orange-800"
                          : establishment.status === "Rejected"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {establishment.status === "Approve"
                        ? "Approved"
                        : establishment.status || ""}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewEstablishment(establishment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p>No establishments found.</p>
          </div>
        )}
        {establishments && establishments.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 bg-sky-50 dark:bg-gray-700 rounded-b-lg">
            <p className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredEstablishments.length)} of{" "}
              {filteredEstablishments.length} entries
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-24"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-24"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </Card>
      {selectedEstablishment && (
        <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
          <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-gray-100">
            <DialogHeader>
              <DialogTitle>
                {selectedEstablishment.establishmentName}
              </DialogTitle>
              <DialogDescription>Establishment details</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4 dark:border-gray-700">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Municipality</h4>
                  <p>{selectedEstablishment.municipality}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Business Address</h4>
                  <p>{selectedEstablishment.businessAddress}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Accreditation Number</h4>
                  <p>{selectedEstablishment.accreditationNumber}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Expiration Date</h4>
                  <p>
                    {new Date(
                      selectedEstablishment.expirationDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Status</h4>
                  <p>{selectedEstablishment.status}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Contact Person</h4>
                  <p>{selectedEstablishment.contactPerson}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Contact Number</h4>
                  <p>{selectedEstablishment.contactNumber}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p>{selectedEstablishment.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Website</h4>
                  <p>{selectedEstablishment.website}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Facebook</h4>
                  <p>{selectedEstablishment.facebook}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Instagram</h4>
                  <p>{selectedEstablishment.instagram}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Twitter</h4>
                  <p>{selectedEstablishment.twitter}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Booking Company</h4>
                  <p>{selectedEstablishment.bookingCompany}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Designation</h4>
                  <p>{selectedEstablishment.designation}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Appointment Date</h4>
                  <p>
                    {new Date(
                      selectedEstablishment.appointmentDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">License Number</h4>
                  <p>{selectedEstablishment.licenseNumber}</p>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
