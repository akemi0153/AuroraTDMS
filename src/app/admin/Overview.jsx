import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
  Area,
  AreaChart,
} from "recharts";
import {
  Home,
  Users,
  Activity,
  TrendingUp,
  Download,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Client, Databases, Query } from "appwrite";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchAccommodations } from "@/services/appwrite";
import { Button } from "@/components/ui/button";
import ExcelJS from "exceljs";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("672cfc4e003a4709c911");

const databases = new Databases(client);

const CHART_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
];

function InspectionCompleteChart({ data }) {
  const chartData = data.reduce((acc, item) => {
    const date = new Date(item.$createdAt).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = { date, count: 0 };
    }
    if (item.status === "Inspection Complete") {
      acc[date].count += 1;
    }
    return acc;
  }, {});

  const sortedData = Object.values(chartData).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <ChartContainer
      config={{
        inspectionComplete: {
          label: "Inspection Complete",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={sortedData}>
          <defs>
            <linearGradient
              id="colorInspectionComplete"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-3))"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--chart-3))"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--chart-3))"
            fillOpacity={1}
            fill="url(#colorRequiresFollowUp)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function RequiresFollowUpChart({ data }) {
  const chartData = data.reduce((acc, item) => {
    const date = new Date(item.$createdAt).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = { date, count: 0 };
    }
    if (item.status === "Requires Follow-Up") {
      acc[date].count += 1;
    }
    return acc;
  }, {});

  const sortedData = Object.values(chartData).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <ChartContainer
      config={{
        requiresFollowUp: {
          label: "Requires Follow-Up",
          color: "hsl(var(--chart-4))",
        },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={sortedData}>
          <defs>
            <linearGradient
              id="colorRequiresFollowUp"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-4))"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--chart-4))"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--chart-4))"
            fillOpacity={1}
            fill="url(#colorRequiresFollowUp)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function StatCard({ title, value, description, icon, trend }) {
  const trendColor = parseFloat(trend) >= 0 ? "text-green-500" : "text-red-500";

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </h3>
          </div>
          <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
          <p className={`text-sm font-medium ${trendColor} flex items-center`}>
            {trend}
            <TrendingUp className="ml-1 h-4 w-4" />
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [accommodations, setAccommodations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("90d");

  useEffect(() => {
    async function loadData() {
      try {
        const [accommodationsData, usersResponse] = await Promise.all([
          fetchAccommodations(),
          databases.listDocuments(
            "672cfccb002f456cb332", // databaseId
            "672cfcd0003c114264cd", // userCollectionId
            [Query.limit(100)]
          ),
        ]);
        setAccommodations(accommodationsData);
        setUsers(usersResponse.documents);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 dark:text-red-400">Error: {error}</div>;
  }

  const totalEstablishments = accommodations.length;
  const totalMunicipalities = new Set(accommodations.map((e) => e.municipality))
    .size;
  const awaitingInspection = accommodations.filter(
    (e) => e.status === "Awaiting Inspection"
  ).length;

  const inspectionComplete = accommodations.filter(
    (e) => e.status === "Inspection Complete"
  ).length;
  const requiresFollowUp = accommodations.filter(
    (e) => e.status === "Requires Follow-Up"
  ).length;

  const municipalityData = Object.entries(
    accommodations.reduce((acc, e) => {
      acc[e.municipality] = (acc[e.municipality] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  const userRoleData = Object.entries(
    users.reduce((acc, user) => {
      const role = user.role || "N/A";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value], index) => ({
    name,
    value,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const submissionData = accommodations.reduce((acc, item) => {
    const date = new Date(item.$createdAt);
    const dateString = date.toISOString().split("T")[0];
    if (!acc[dateString]) {
      acc[dateString] = { date: dateString, count: 0 };
    }
    acc[dateString].count += 1;
    return acc;
  }, {});

  const formSubmissions = Object.values(submissionData).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const filteredSubmissions = formSubmissions.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const pieChartConfig = userRoleData.reduce((config, item) => {
    config[item.name] = {
      label: item.name,
      color: item.fill,
    };
    return config;
  }, {});

  const areaChartConfig = {
    submissions: {
      label: "Submissions",
      color: CHART_COLORS[2],
    },
  };

  const generateReport = async () => {
    // Prepare data for the report
    const reportData = [
      // Header row
      ["Accommodations Report", "", "", ""],
      ["Generated on:", new Date().toLocaleString(), "", ""],
      ["", "", "", ""],

      // Statistics
      ["Key Metrics", "", "", ""],
      ["Total Establishments", totalEstablishments, "", ""],
      ["Total Municipalities", totalMunicipalities, "", ""],
      ["Pending Approvals", awaitingInspection, "", ""],
      ["Total Users", users.length, "", ""],
      ["", "", "", ""],

      // Municipality Data
      ["Establishments per Municipality", "", "", ""],
      ["Municipality", "Count", "", ""],
      ...municipalityData.map((item) => [item.name, item.count, "", ""]),
      ["", "", "", ""],

      // User Roles Data
      ["User Role Distribution", "", "", ""],
      ["Role", "Count", "", ""],
      ...userRoleData.map((item) => [item.name, item.value, "", ""]),
    ];

    try {
      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Accommodations Report");

      // Add data to worksheet
      reportData.forEach((row) => {
        worksheet.addRow(row);
      });

      // Generate & Download Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Accommodations_Report_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h2>
        <Button onClick={generateReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Establishments"
          value={totalEstablishments}
          description="Registered establishments"
          icon={<Home className="h-6 w-6 text-blue-500" />}
          trend={`${((totalEstablishments / 100) * 100).toFixed(2)}%`}
        />
        <StatCard
          title="Municipalities"
          value={totalMunicipalities}
          description="With registered establishments"
          icon={<Users className="h-6 w-6 text-green-500" />}
          trend={`${((totalMunicipalities / 4) * 100).toFixed(2)}%`}
        />
        <StatCard
          title="Awaiting Inspection"
          value={awaitingInspection}
          description="Establishments to inspect"
          icon={<Activity className="h-6 w-6 text-yellow-500" />}
          trend={`${((awaitingInspection / totalEstablishments) * 100).toFixed(
            2
          )}%`}
        />
        <StatCard
          title="Total Users"
          value={users.length}
          description="Registered users"
          icon={<Users className="h-6 w-6 text-purple-500" />}
          trend={`${((users.length / 100) * 100).toFixed(2)}%`}
        />
        <StatCard
          title="Inspection Complete"
          value={inspectionComplete}
          description="Establishments inspected"
          icon={<CheckCircle className="h-6 w-6 text-green-500" />}
          trend={`${((inspectionComplete / totalEstablishments) * 100).toFixed(
            2
          )}%`}
        />
        <StatCard
          title="Requires Follow-Up"
          value={requiresFollowUp}
          description="Establishments needing follow-up"
          icon={<AlertTriangle className="h-6 w-6 text-yellow-500" />}
          trend={`${((requiresFollowUp / totalEstablishments) * 100).toFixed(
            2
          )}%`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Establishments per Municipality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={municipalityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    color: "#F9FAFB",
                    border: "none",
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill={CHART_COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              User Roles
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Distribution of user roles
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={pieChartConfig}
              className="mx-auto aspect-square h-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Pie
                  data={userRoleData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {userRoleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      const { cx, cy } = viewBox;
                      return (
                        <text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          <tspan
                            x={cx}
                            y={cy}
                            className="text-2xl font-bold fill-gray-900 dark:fill-white"
                          >
                            {users.length}
                          </tspan>
                          <tspan
                            x={cx}
                            y={cy + 20}
                            className="text-sm fill-gray-500 dark:fill-gray-400"
                          >
                            Total Users
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-gray-900 dark:text-white">
                Form Submissions Over Time
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Showing total submissions for the selected period
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={areaChartConfig}
              className="h-[300px] w-full"
            >
              <AreaChart data={filteredSubmissions}>
                <defs>
                  <linearGradient
                    id="fillSubmissions"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS[2]}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS[2]}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  stroke="#6B7280"
                />
                <YAxis stroke="#6B7280" />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={CHART_COLORS[2]}
                  fillOpacity={1}
                  fill="url(#fillSubmissions)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Inspection Complete Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InspectionCompleteChart data={accommodations} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Requires Follow-Up Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RequiresFollowUpChart data={accommodations} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
