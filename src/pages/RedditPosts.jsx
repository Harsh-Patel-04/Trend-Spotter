import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
} from "recharts";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const RedditPosts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/reddit-posts");
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

  const bubbleData = data.trends.map((trend, index) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: trend.count / 50,
    name: trend.name,
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">
          Reddit Posts Analysis
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Reddit Trends */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
              Current Reddit Trends
            </h2>
            <div className="space-y-4">
              {data.trends.map((trend, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <span className="font-medium">{trend.name}</span>
                  <span className="text-blue-400 font-mono">
                    {trend.count.toLocaleString()} upvotes
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
              Sentimental Analysis of Comments
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

          {/* Virality Bubble Chart */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl col-span-full">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
              Topic Virality Clustering
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid />
                <XAxis
                  dataKey="x"
                  name="Time to Detect"
                  unit="s"
                  tick={{ fill: "#ccc" }}
                />
                <YAxis
                  dataKey="y"
                  name="Engagement"
                  unit="%"
                  tick={{ fill: "#ccc" }}
                />
                <ZAxis dataKey="z" range={[50, 300]} name="Mentions" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) =>
                    typeof value === "number" ? value.toFixed(0) : value
                  }
                  labelFormatter={(value, index) =>
                    bubbleData[index]?.name || "Topic"
                  }
                />
                <Scatter name="Topics" data={bubbleData} fill="#00D1FF" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedditPosts;
