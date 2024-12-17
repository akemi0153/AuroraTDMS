"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAccommodations();
        setEstablishments(data);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredEstablishments =
    filterType === "all"
      ? establishments
      : establishments.filter((e) => e.accommodationType === filterType);

  const totalEstablishments = filteredEstablishments.length;
  const totalMunicipalities = new Set(
    filteredEstablishments.map((e) => e.municipality)
  ).size;
  const pendingApprovals = filteredEstablishments.filter(
    (e) => e.approvalStatus === "pending"
  ).length;

  const accommodationTypes = Array.from(
    new Set(establishments.map((e) => e.accommodationType))
  );

  // Generate cumulative growth data for accommodation types
  const growthData = Array(12)
    .fill()
    .map((_, month) => {
      const dataPoint = { month: month + 1 };
      let total = 0;
      accommodationTypes.forEach((type, index) => {
        // Simulate growth with random increments
        const increment = Math.floor(Math.random() * 10) + 1;
        total += increment;
        dataPoint[type] = total;
      });
      return dataPoint;
    });

  const municipalityData = Object.entries(
    filteredEstablishments.reduce((acc, e) => {
      acc[e.municipality] = (acc[e.municipality] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {accommodationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatCard
          key="establishments"
          title="Total Establishments"
          value={totalEstablishments}
          description="Filtered establishments"
          icon={<Home className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          key="municipalities"
          title="Municipalities"
          value={totalMunicipalities}
          description="With registered establishments"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          key="pending"
          title="Pending Approvals"
          value={pendingApprovals}
          description="Awaiting review"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
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
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accommodation Growth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {accommodationTypes.map((type, index) => (
                  <Area
                    key={type}
                    type="monotone"
                    dataKey={type}
                    stackId="1"
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, description, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
