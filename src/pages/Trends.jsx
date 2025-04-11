import React, { useEffect, useState } from "react";
import axios from "axios";
import RefreshButton from "../components/RefreshButton";
import VideoItem from "../components/VideoItem";
import { FaFireAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// List of countries to choose from. You can add more if needed.
const countryOptions = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  // Add more countries as desired.
];

const Trends = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Use a drop-down so region is selected by country; default is "IN"
  const [region, setRegion] = useState("IN");
  // For video URL search
  const [videoUrl, setVideoUrl] = useState("");
  const navigate = useNavigate();

  // Fetch trending videos for the selected region.
  const fetchTrendingVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/get_trending_videos?region=${region}`,
        { timeout: 10000 }
      );
      setVideos(response.data.videos || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load trending videos");
    } finally {
      setLoading(false);
    }
  };

  // Handle search submission for manual video URL analysis.
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
      navigate(`/video/analysis/${videoId}`);
    } else {
      setError("Invalid YouTube URL.");
    }
  };

  // Extracts videoId from standard YouTube URLs.
  const extractVideoId = (url) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes("youtube.com")) {
        return parsedUrl.searchParams.get("v");
      } else if (parsedUrl.hostname.includes("youtu.be")) {
        return parsedUrl.pathname.substring(1);
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  // When the region changes from the drop-down, re-fetch trending videos.
  useEffect(() => {
    fetchTrendingVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header: Title, region select drop-down, and refresh button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <FaFireAlt className="text-white" />
            <h2 className="text-3xl font-bold text-white">
              YouTube Trending Videos
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
            >
              {countryOptions.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
            <RefreshButton onClick={fetchTrendingVideos} loading={loading} />
          </div>
        </div>

        {/* Search Form for analyzing a specific video via URL */}
        <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Enter YouTube video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
          >
            Analyze
          </button>
        </form>

        {error && (
          <div className="text-red-400 mb-4 bg-gray-800 p-4 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-400 text-lg animate-pulse">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((video, index) => (
              <VideoItem key={video.id || index} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trends;
