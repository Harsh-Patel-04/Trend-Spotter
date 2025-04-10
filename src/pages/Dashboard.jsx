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

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrend, setSelectedTrend] = useState(null);

  useEffect(() => {
    const fetchRedditData = async () => {
      try {
        const response = await axios.get(
          "https://www.reddit.com/r/technology/top.json?limit=8"
        );

        const posts = response.data.data.children.map((post) => ({
          title: post.data.title,
          upvotes: post.data.ups,
          comments: post.data.num_comments,
          created: post.data.created_utc,
          author: post.data.author,
          url: `https://reddit.com${post.data.permalink}`,
          sentiment: Math.random() * 100, // Simulated sentiment score
        }));

        // Generate sentiment distribution
        const sentimentData = posts.reduce(
          (acc, post) => {
            if (post.sentiment > 70) acc.positive++;
            else if (post.sentiment > 40) acc.neutral++;
            else acc.negative++;
            return acc;
          },
          { positive: 0, neutral: 0, negative: 0 }
        );

        setData({
          trends: posts,
          sentiment: [
            {
              name: "Positive",
              value: sentimentData.positive,
              color: "#4CAF50",
            },
            { name: "Neutral", value: sentimentData.neutral, color: "#FFC107" },
            {
              name: "Negative",
              value: sentimentData.negative,
              color: "#F44336",
            },
          ],
          bubbleData: posts.map((post) => ({
            x: post.comments,
            y: post.upvotes,
            z: Math.sqrt(post.upvotes) * 2,
            name: post.title,
            time: Date.now() / 1000 - post.created,
          })),
        });
      } catch (err) {
        setError("Failed to fetch real-time data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRedditData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">
          Real-time Tech Trends Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reddit Trends List */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
              Trending Tech Discussions
            </h2>
            <div className="space-y-4">
              {data.trends.map((trend, index) => (
                <a
                  key={index}
                  href={trend.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                  onMouseEnter={() => setSelectedTrend(index)}
                  onMouseLeave={() => setSelectedTrend(null)}
                >
                  <div
                    className={`flex justify-between items-center bg-gray-700 p-4 rounded-lg transition-all
                    ${
                      selectedTrend === index
                        ? "bg-gray-600 transform scale-101"
                        : "hover:bg-gray-600"
                    }`}
                  >
                    <span className="font-medium truncate">{trend.title}</span>
                    <span className="text-blue-400 font-mono">
                      {trend.upvotes.toLocaleString()} ↑
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
              Discussion Sentiment Distribution
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
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {data.sentiment.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  formatter={(value) => (
                    <span className="text-gray-300">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Virality Bubble Chart */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl col-span-full">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
              Post Engagement Analysis
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Comments"
                  unit=" comments"
                  tick={{ fill: "#ccc" }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Upvotes"
                  unit=" upvotes"
                  tick={{ fill: "#ccc" }}
                />
                <ZAxis dataKey="z" range={[50, 500]} name="Engagement Score" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ payload }) => (
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                      <p className="font-semibold">
                        {payload?.[0]?.payload?.name}
                      </p>
                      <p>Comments: {payload?.[0]?.payload?.x}</p>
                      <p>Upvotes: {payload?.[0]?.payload?.y}</p>
                      <p>Engagement: {Math.round(payload?.[0]?.payload?.z)}</p>
                    </div>
                  )}
                />
                <Scatter
                  name="Posts"
                  data={data.bubbleData}
                  fill="#00D1FF"
                  opacity={0.8}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
