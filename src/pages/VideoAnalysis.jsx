import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import RefreshButton from "../components/RefreshButton";
// Chart imports
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const VideoAnalysis = () => {
  const { videoId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionDuration, setPredictionDuration] = useState("week");

  // Fetch video analysis from the backend
  const fetchVideoAnalysis = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/video_analysis?video_id=${videoId}&duration=${predictionDuration}`,
        { timeout: 10000 }
      );
      setAnalysis(response.data);
    } catch (err) {
      setError(err.message || "Failed to load video analysis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, predictionDuration]);

  // Prepare data for the Pie chart (Sentiment Analysis)
  const sentimentChartData = analysis && {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        label: "Sentiment Analysis",
        data: [
          analysis.analysis.sentiment_analysis.positive,
          analysis.analysis.sentiment_analysis.neutral,
          analysis.analysis.sentiment_analysis.negative,
        ],
        backgroundColor: ["#00FF00", "#FFFF00", "#FF0000"],
        hoverOffset: 4,
      },
    ],
  };

  // Prepare data for the Line Chart (Future Predictions from backend)
  const lineChartData = analysis && {
    labels: analysis.analysis.future_prediction.map((pred) => pred.timeframe),
    datasets: [
      {
        label: "Future Views Prediction",
        data: analysis.analysis.future_prediction.map((pred) => pred.predicted_views),
        fill: false,
        borderColor: "#4FD1C5",
        tension: 0.1,
      },
    ],
  };

  // Function to open the video on YouTube in a new tab
  const openVideoOnYouTube = () => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {loading && (
          <div className="text-gray-400 animate-pulse">
            Loading video analysis...
          </div>
        )}
        {error && (
          <div className="text-red-400 bg-gray-800 p-4 rounded-lg">
            {error}
          </div>
        )}

        {analysis && !loading && (
          <>
            {/* Header Section: Video details and sentiment chart */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold mb-2">{analysis.title}</h2>
                <p className="mt-2">{analysis.description}</p>
                <p className="mt-2">
                  Published: {new Date(analysis.publishedAt).toLocaleDateString()}
                </p>
                <p>Views: {analysis.viewCount}</p>
                <p>Likes: {analysis.likeCount}</p>
                <p>Comments: {analysis.commentCount}</p>
                <p className="mt-2">Click Ratio: {analysis.analysis.click_ratio}%</p>
                
                {/* Button to open video on YouTube */}
                <button
                  onClick={openVideoOnYouTube}
                  className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white"
                >
                  Watch on YouTube
                </button>
              </div>
              {/* Sentiment Chart on the right */}
              <div className="md:w-1/3 mt-6 md:mt-0 flex justify-center">
                {sentimentChartData && (
                  <Pie
                    data={sentimentChartData}
                    options={{ maintainAspectRatio: false }}
                    width={150}
                    height={150}
                  />
                )}
              </div>
            </div>

            {/* Refresh Button */}
            <RefreshButton onClick={fetchVideoAnalysis} loading={loading} />

            {/* Additional YouTube Analytics */}
            <div className="mt-8 bg-gray-800 p-4 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Additional Analytics</h3>
              <p><strong>Impressions:</strong> {analysis.analytics.impressions}</p>
              <p><strong>CTR:</strong> {analysis.analytics.ctr}%</p>
              <p className="mt-2"><strong>How Viewers Find this Video:</strong></p>
              <ul className="list-disc pl-5">
                {Object.entries(analysis.analytics.viewer_sources).map(([source, percent]) => (
                  <li key={source}>
                    <strong>{source}:</strong> {percent}
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                <strong>Average View Duration:</strong> {analysis.analytics.average_view_duration}
              </p>
              <p className="mt-2">
                <strong>Watch Time:</strong> {analysis.analytics.watch_time}
              </p>
              <p className="mt-2"><strong>Audience:</strong></p>
              <ul className="list-disc pl-5">
                {Object.entries(analysis.analytics.audience).map(([group, value]) => (
                  <li key={group}>
                    <strong>{group}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>

            {/* Future Predictions Section */}
            <div className="mt-8 bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Future View Predictions</h3>
                <select
                  value={predictionDuration}
                  onChange={(e) => setPredictionDuration(e.target.value)}
                  className="bg-gray-700 p-2 rounded"
                >
                  <option value="week">Next 1 Week</option>
                  <option value="month">Next 1 Month</option>
                </select>
              </div>
              <div className="mt-4">
                {lineChartData && <Line data={lineChartData} />}
              </div>
            </div>

            {/* Top 10 Comments Section */}
            <div className="mt-10 bg-gray-800 p-4 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Top 10 Comments</h3>
              {analysis.top_comments && analysis.top_comments.length > 0 ? (
                <ul className="space-y-3">
                  {analysis.top_comments.map((comment, index) => (
                    <li key={index} className="border-b border-gray-700 pb-2">
                      <p className="text-blue-300 font-semibold">
                        {comment.author} 
                        <span className="text-gray-500 text-sm"> ({comment.likes} likes)</span>
                      </p>
                      <p>{comment.text}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoAnalysis;
