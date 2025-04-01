// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Trends = () => {
//   const [hashtags, setHashtags] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchHashtags = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/get_trending_hashtags"
//         );
//         setHashtags(response.data.hashtags);
//       } catch (err) {
//         setError("Error fetching trending hashtags");
//       }
//     };

//     fetchHashtags();
//   }, []);

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">
//         Trending Hashtags
//       </h2>
//       {error && (
//         <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">{error}</div>
//       )}
//       <ul className="divide-y divide-gray-200">
//         {hashtags.map((item, index) => (
//           <li key={index} className="py-2 flex justify-between items-center">
//             <span className="text-lg font-medium text-blue-600">
//               {item.hashtag}
//             </span>
//             <span className="text-sm text-gray-500">
//               Score: {Number(item.score).toFixed(1)}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Trends;

import React, { useEffect, useState } from "react";
import axios from "axios";
import RefreshButton from "../components/RefreshButton";

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
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-2xl shadow-md mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Trending Hashtags</h2>
        <RefreshButton onClick={fetchHashtags} loading={loading} />
      </div>

      {/* Error & Loading states... */}

      <ul className="divide-y divide-gray-700">
        {hashtags.map((item, index) => (
          <li key={index} className="py-3 flex justify-between items-center">
            <span className="text-lg font-medium text-blue-400">
              {item.hashtag}
            </span>
            <span className="text-sm text-gray-400">
              {Number(item.score).toFixed(1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Trends;
