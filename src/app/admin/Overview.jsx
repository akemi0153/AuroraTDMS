"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Home, Users, Activity } from "lucide-react";
import { fetchAccommodations } from "@/services/appwrite";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function Overview() {
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formSubmissions, setFormSubmissions] = useState([]); // Added state for form submissions

  // Fetch data on load
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAccommodations();
        setEstablishments(data || []); // Ensure data is always an array

        // Process form submission data
        const submissionData = data.reduce((acc, item) => {
          const date = new Date(item.createdAt);
          const monthYear = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;

          if (!acc[monthYear]) {
            acc[monthYear] = { month: monthYear, count: 0 };
          }
          acc[monthYear].count += 1;

          return acc;
        }, {});

        const sortedSubmissions = Object.values(submissionData).sort((a, b) =>
          a.month.localeCompare(b.month)
        );
        setFormSubmissions(sortedSubmissions);

        setError(null);
      } catch (error) {
        console.error("Failed to fetch accommodations:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Ensure unique accommodation types
  const accommodationTypes = Array.from(
    new Set(
      establishments.map((e) => e.accommodationType).filter((type) => type) // Remove undefined/null values
    )
  );

  // Filter establishments based on selected type
  const filteredEstablishments = establishments;

  // Derived statistics
  const totalEstablishments = filteredEstablishments.length;
  const totalMunicipalities = new Set(
    filteredEstablishments.map((e) => e.municipality)
  ).size;
  const pendingApprovals = filteredEstablishments.filter(
    (e) => e.approvalStatus === "pending"
  ).length;

  // Data for cumulative growth chart (removed)

  // Data for establishments per municipality
  const municipalityData = Object.entries(
    filteredEstablishments.reduce((acc, e) => {
      acc[e.municipality] = (acc[e.municipality] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatCard
          key="establishments"
          title="Total Establishments"
          value={totalEstablishments}
          description="Filtered establishments"
          icon={<Home className="h-4 w-4 text-sky-600" />}
          color="bg-sky-600"
        />
        <StatCard
          key="municipalities"
          title="Municipalities"
          value={totalMunicipalities}
          description="With registered establishments"
          icon={<Users className="h-4 w-4 text-emerald-600" />}
          color="bg-emerald-600"
        />
        <StatCard
          key="pending"
          title="Pending Approvals"
          value={pendingApprovals}
          description="Awaiting review"
          icon={<Activity className="h-4 w-4 text-amber-600" />}
          color="bg-amber-600"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Establishments per Municipality</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={municipalityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="hsl(201, 96%, 32%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Replaced Total Accommodation Growth Over Time chart */}
        <Card>
          <CardHeader>
            <CardTitle>Form Submissions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formSubmissions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => {
                    const [year, month] = value.split("-");
                    return `${month}/${year.slice(2)}`;
                  }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => {
                    const [year, month] = value.split("-");
                    return `${month}/${year}`;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Submissions"
                  stroke="hsl(201, 96%, 32%)"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ title, value, description, icon, color }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader
        className={`flex flex-row items-center justify-between space-y-0 pb-2 ${color}`}
      >
        <CardTitle className="text-sm font-medium text-white">
          {title}
        </CardTitle>
        <div className="bg-white rounded-full p-2">{icon}</div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
