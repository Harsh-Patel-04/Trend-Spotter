import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/dashboard");
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">
          Trend Spotter Analytics
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Real-time Trends Section */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
              Current Trends
            </h2>
            <div className="space-y-4">
              {data.trends.map((trend, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <span className="font-medium">{trend.name}</span>
                  <span className="text-blue-400 font-mono">
                    {trend.count.toLocaleString()} mentions
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment Analysis Section */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
              Sentiment Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.sentiment}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.sentiment.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Timeline Section */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl col-span-full">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
              Trend Timeline
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.timeline}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#9CA3AF" }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis tick={{ fill: "#9CA3AF" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="mentions"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
