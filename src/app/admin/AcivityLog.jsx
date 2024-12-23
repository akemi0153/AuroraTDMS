import React, { useState, useEffect } from "react";
import { fetchActivityLogs } from "@/services/appwrite";
import { format } from "date-fns";

const ActivityLogs = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await fetchActivityLogs();
        setActivityLogs(logs);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      <div className="space-y-4">
        {activityLogs.map((log) => (
          <div key={log.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg">{log.eventType}</span>
              <span className="text-sm text-gray-500">
                {format(new Date(log.timestamp), "PPpp")}
              </span>
            </div>
            <p className="text-gray-700 mb-2">{log.message}</p>
            {log.userId && (
              <p className="text-sm text-gray-600">User ID: {log.userId}</p>
            )}
            {log.details && (
              <div className="mt-2 text-sm text-gray-600 bg-gray-100 p-2 rounded">
                <pre className="whitespace-pre-wrap">{log.details}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogs;
