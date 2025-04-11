import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Activity, AlertCircle, Search, BarChart3 } from "lucide-react";

const TrendSpotter = () => {
  const [region, setRegion] = useState("");
  const [trends, setTrends] = useState([]);
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { region: urlRegion } = useParams();

  const handleAnalyze = () => {
    if (region.trim()) {
      navigate(`/trend-spotter/${encodeURIComponent(region.trim())}`);
    }
  };

  useEffect(() => {
    if (urlRegion) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:5000/api/analyze/${encodeURIComponent(urlRegion)}`
          );
          setTrends(response.data.trends);
          setValidation(response.data.validation);
        } catch (error) {
          console.error("Error fetching trends:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [urlRegion]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Activity className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Trend Spotter</h1>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Enter region/subreddit"
              className="bg-gray-700 text-white rounded-lg px-4 py-2 flex-grow"
              onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Search className="w-5 h-5" />
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {trends.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                {/* <TrendUp className="w-6 h-6 text-green-400" /> */}
                Top Trends in r/{urlRegion}
              </h2>
              <div className="space-y-4">
                {trends.map((trend, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{trend.keyword}</span>
                      <span className="text-blue-400 text-sm">
                        {trend.count} mentions
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm">Sentiment:</span>
                      <span
                        className={`text-sm ${
                          trend.sentiment >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {trend.sentiment.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {validation && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                  Validation Report
                </h2>
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Engagement Score</h3>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                      <span className="text-2xl font-bold">
                        {validation.engagement}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Bot Likelihood</h3>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-2xl font-bold">
                        {validation.bot_likelihood}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendSpotter;
