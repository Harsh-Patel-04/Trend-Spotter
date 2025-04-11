import React from 'react';
import { Link } from 'react-router-dom';
import { FaVideo } from 'react-icons/fa';

const VideoItem = ({ video }) => (
  <div className="bg-gray-800 p-4 rounded-xl shadow hover:bg-gray-700 transition-all">
    <Link to={`/video/analysis/${video.id}`}>
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold text-blue-300 flex items-center gap-2">
          <FaVideo /> {video.title}
        </span>
      </div>
      <div className="text-gray-400 text-sm mt-2">
        Views: {video.viewCount} | Published: {new Date(video.publishedAt).toLocaleDateString()}
      </div>
    </Link>
  </div>
);

export default VideoItem;
