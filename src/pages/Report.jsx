// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Reports = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get("http://localhost:5000/report");
        setReport(res.data);
      } catch (e) {
        setError("Failed to load predictions");
      }
    };

    fetchReport();
  }, []);

  if (error) return <div className="text-red-500 p-10">{error}</div>;
  if (!report) return <div className="text-white p-10">Loading report...</div>;

  const { summary, predictions } = report;
  const sentimentData = [
    {
      name: "Positive",
      value: summary.sentiment_distribution.positive_percent,
      color: "#00FF00",
    },
    {
      name: "Neutral",
      value: summary.sentiment_distribution.neutral_percent,
      color: "#FFFF00",
    },
    {
      name: "Negative",
      value: summary.sentiment_distribution.negative_percent,
      color: "#FF0000",
    },
  ];

  return (
    <div className="p-10 text-white max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-400 mb-8">📈 Forecast Report</h1>

      <div className="space-y-4 mb-10">
        <p><strong>Total Analyzed Reddit Posts:</strong> {summary.total_analyzed_posts}</p>
        <p><strong>Top YouTube Hashtags:</strong></p>
        <ul className="list-disc pl-6">
          {summary.top_hashtags.map((h, idx) => (
            <li key={idx}>
              <span className="text-blue-300 font-semibold">{h.hashtag}</span> — Score: {h.score}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📊 Sentiment Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sentimentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔮 Future Mentions Forecast</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="mentions"
                stroke="#00D1FF"
                name="Predicted Mentions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📌 Summary Insight</h2>
        <p className="text-gray-300">
          Based on Reddit sentiment and YouTube virality analysis, we expect a steady increase
          in topic engagement in the upcoming months. Keep an eye on trending topics like{" "}
          <span className="text-blue-300 font-semibold">
            {summary.top_hashtags[0].hashtag}
          </span>{" "}
          as they’re forecasted to lead in discussions.
        </p>
      </div>
    </div>
  );
};

export default Reports;
