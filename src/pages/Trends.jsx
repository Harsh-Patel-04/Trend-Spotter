import React, { useEffect, useState } from "react";
import axios from "axios";
import RefreshButton from "../components/RefreshButton";
import { FaHashtag, FaFireAlt } from "react-icons/fa";

const Trends = () => {
  const [hashtags, setHashtags] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHashtags = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/get_trending_hashtags",
        { timeout: 10000 }
      );
      setHashtags(response.data.hashtags || []);
    } catch (err) {
      setError(err.message || "Failed to load trends");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHashtags();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-yellow-400 flex items-center gap-2">
            <FaFireAlt /> YouTube Trending Hashtags
          </h2>
          <RefreshButton onClick={fetchHashtags} loading={loading} />
        </div>

        {error && (
          <div className="text-red-400 mb-4 bg-gray-800 p-4 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-400 text-lg animate-pulse">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hashtags.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-xl shadow hover:bg-gray-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-blue-300 flex items-center gap-2">
                    <FaHashtag />
                    {item.hashtag}
                  </span>
                  <span className="text-sm text-gray-400">
                    Score: {Number(item.score).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trends;
