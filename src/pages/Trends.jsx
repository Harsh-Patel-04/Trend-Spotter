import React, { useEffect, useState } from "react";
import axios from "axios";
import RefreshButton from "../components/RefreshButton";
import VideoItem from "../components/VideoItem";
import { FaFireAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Trends = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const navigate = useNavigate();

  const fetchTrendingVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/get_trending_videos", { timeout: 10000 });
      setVideos(response.data.videos || []);
    } catch (err) {
      setError(err.message || "Failed to load trending videos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
      navigate(`/video/analysis/${videoId}`);
    } else {
      setError("Invalid YouTube URL.");
    }
  };

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

  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-yellow-400 flex items-center gap-2">
            <FaFireAlt /> YouTube Trending Videos
          </h2>
          <RefreshButton onClick={fetchTrendingVideos} loading={loading} />
        </div>

        {/* Search Form */}
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

        {error && <div className="text-red-400 mb-4 bg-gray-800 p-4 rounded-lg">{error}</div>}

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
