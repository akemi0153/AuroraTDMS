import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Search, Download } from "lucide-react";
import { fetchActivityLogs, getCurrentUser } from "@/services/appwrite";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const currentUser = await getCurrentUser();
        if (currentUser.role !== "admin") {
          toast.error("Unauthorized access - Admin only area");
          setError("Unauthorized access. Admin privileges required.");
          setIsLoading(false);
          return;
        }

        const fetchedLogs = await fetchActivityLogs();
        setLogs(fetchedLogs);
      } catch (err) {
        setError("Failed to fetch logs. Please try again.");
        toast.error("Failed to fetch logs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, []);

  const generateReport = async () => {
    try {
      // Group establishments by municipality
      const municipalityData = logs.reduce((acc, log) => {
        const municipality = log.municipality || "N/A";

        if (!acc[municipality]) {
          acc[municipality] = {
            total_hotel_inn_resort: 0,
            ac_rooms: 0,
            non_ac_rooms: 0,
            function_hall: 0,
            restaurant: 0,
            campsite: 0,
            total_rooms: 0,
          };
        }

        // Count based on status and type
        if (
          log.status === "Inspection Complete" ||
          log.status === "Inspection Completed"
        ) {
          // Increment establishment type counters
          switch (log.establishmentType?.toLowerCase()) {
            case "hotel":
            case "inn":
            case "resort":
            case "lodge":
              acc[municipality].total_hotel_inn_resort++;
              break;
            case "function hall":
              acc[municipality].function_hall++;
              break;
            case "restaurant":
              acc[municipality].restaurant++;
              break;
            case "campsite":
              acc[municipality].campsite++;
              break;
          }

          // Add room counts if available
          if (log.roomCount) {
            if (log.hasAircon) {
              acc[municipality].ac_rooms += parseInt(log.roomCount) || 0;
            } else {
              acc[municipality].non_ac_rooms += parseInt(log.roomCount) || 0;
            }
            acc[municipality].total_rooms += parseInt(log.roomCount) || 0;
          }
        }

        return acc;
      }, {});

      // Prepare Excel data
      const reportData = [
        ["HOTEL/INN/LODGE/RESORT", "", "", "", "", "", "", ""],
        [`${new Date().getFullYear()}`, "", "", "", "", "", "", ""],
        [
          "NO.",
          "TOWN/MUNICIPALITIES",
          "Total number of Hotel/Inn/Lodge/Resort",
          "Total Number of Rooms",
          "Function Hall",
          "Restaurant",
          "Campsite",
          "Total",
        ],
        // Add municipality rows
        ...Object.entries(municipalityData).map(
          ([municipality, data], index) => [
            index + 1,
            municipality,
            data.total_hotel_inn_resort,
            data.total_rooms,
            data.function_hall,
            data.restaurant,
            data.campsite,
            data.total_hotel_inn_resort +
              data.function_hall +
              data.restaurant +
              data.campsite,
          ]
        ),
        // Add total row
        [
          "",
          "TOTAL",
          Object.values(municipalityData).reduce(
            (sum, data) => sum + data.total_hotel_inn_resort,
            0
          ),
          Object.values(municipalityData).reduce(
            (sum, data) => sum + data.total_rooms,
            0
          ),
          Object.values(municipalityData).reduce(
            (sum, data) => sum + data.function_hall,
            0
          ),
          Object.values(municipalityData).reduce(
            (sum, data) => sum + data.restaurant,
            0
          ),
          Object.values(municipalityData).reduce(
            (sum, data) => sum + data.campsite,
            0
          ),
          Object.values(municipalityData).reduce(
            (sum, data) =>
              sum +
              data.total_hotel_inn_resort +
              data.function_hall +
              data.restaurant +
              data.campsite,
            0
          ),
        ],
      ];

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Establishments Report");

      // Add data to worksheet
      reportData.forEach((row) => {
        worksheet.addRow(row);
      });

      // Generate & Download Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const fileName = `Establishments_Report_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, fileName);

      toast.success("Report generated successfully");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-red-500 mb-2">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-gray-500 mb-2">No logs found.</p>
          <p className="text-gray-400 text-sm">
            Try refreshing or check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Activity Logs</CardTitle>
        <Button onClick={generateReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Municipality</TableHead>
              <TableHead>Appointment Date</TableHead>
              <TableHead>Decline Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Status Updated</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.municipality}</TableCell>
                <TableCell>{log.appointmentDate}</TableCell>
                <TableCell>{log.declineReason}</TableCell>
                <TableCell>{log.status}</TableCell>
                <TableCell>
                  {log.statusTimestamp &&
                  (log.status === "Inspection Complete" ||
                    log.status === "Requires Follow-up")
                    ? new Date(log.statusTimestamp).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )
                    : "N/A"}
                </TableCell>
                <TableCell>{log.name}</TableCell>
                <TableCell>{log.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ActivityLogs;
