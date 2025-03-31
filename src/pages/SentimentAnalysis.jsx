// import React, { useState } from "react";
// import axios from "axios";

// const SentimentAnalysis = () => {
//   const [subreddit, setSubreddit] = useState("technology");
//   const [limit, setLimit] = useState(10);
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const sanitizeHTML = (text) => {
//     return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
//   };

//   const fetchSentimentData = async () => {
//     try {
//       // Clear previous results and errors
//       setResults([]);
//       setError(null);

//       // Validate inputs
//       if (!subreddit.trim()) {
//         setError("Please enter a valid subreddit name");
//         return;
//       }
//       if (limit < 1 || limit > 100) {
//         setError("Number of posts must be between 1-100");
//         return;
//       }

//       setIsLoading(true);

//       const response = await axios.post(
//         "http://127.0.0.1:5000/analyze_sentiment",
//         {
//           subreddit: subreddit.trim().toLowerCase(),
//           limit: limit,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           timeout: 30000, // 30 seconds timeout
//         }
//       );

//       if (!response.data || response.data.length === 0) {
//         throw new Error("No data received from the server");
//       }

//       setResults(response.data);
//     } catch (error) {
//       let errorMessage = "Failed to analyze sentiment. Please try again.";

//       if (error.response) {
//         // Server responded with status code outside 2xx
//         errorMessage = error.response.data.error || errorMessage;
//       } else if (error.request) {
//         // Request was made but no response received
//         errorMessage = "No response from server. Check your connection.";
//       } else {
//         // Other errors
//         errorMessage = error.message || errorMessage;
//       }

//       setError(errorMessage);
//       console.error("API Error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 max-w-4xl">
//       <h1 className="text-3xl font-bold mb-6 text-gray-100">
//         Sentiment Analysis Dashboard
//       </h1>

//       <div className="mb-6 space-y-4">
//         <div>
//           <label htmlFor="subreddit-input" className="block mb-2 text-gray-300">
//             Subreddit:
//           </label>
//           <input
//             id="subreddit-input"
//             type="text"
//             value={subreddit}
//             onChange={(e) => setSubreddit(e.target.value)}
//             placeholder="Enter Subreddit (e.g., 'technology')"
//             className="p-3 border border-gray-600 rounded-lg w-full bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             disabled={isLoading}
//           />
//         </div>

//         <div>
//           <label htmlFor="post-limit" className="block mb-2 text-gray-300">
//             Number of Posts (1-100):
//           </label>
//           <input
//             id="post-limit"
//             type="number"
//             value={limit}
//             min="1"
//             max="100"
//             onChange={(e) =>
//               setLimit(Math.max(1, Math.min(100, Number(e.target.value))))
//             }
//             className="p-3 border border-gray-600 rounded-lg w-full bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             disabled={isLoading}
//           />
//         </div>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-800/30 text-red-300 rounded-lg border border-red-800">
//           ⚠️ {error}
//         </div>
//       )}

//       <button
//         onClick={fetchSentimentData}
//         disabled={isLoading}
//         className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {isLoading ? (
//           <span className="flex items-center justify-center">
//             <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//                 fill="none"
//               />
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               />
//             </svg>
//             Analyzing...
//           </span>
//         ) : (
//           "Analyze Sentiment"
//         )}
//       </button>

//       {results.length > 0 && (
//         <div className="mt-8 space-y-4">
//           <h2 className="text-2xl font-semibold text-gray-100 mb-6">
//             Analysis Results
//           </h2>
//           <div className="space-y-4">
//             {results.map((post, index) => (
//               <div key={index} className="p-4 bg-gray-800 rounded-xl shadow-lg">
//                 <h3
//                   className="text-lg font-medium mb-3 text-gray-100"
//                   dangerouslySetInnerHTML={{
//                     __html: sanitizeHTML(post.title),
//                   }}
//                 />
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                   <div className="bg-gray-700/50 p-3 rounded-lg">
//                     <span className="block text-gray-400 mb-1">
//                       Title Sentiment
//                     </span>
//                     <span className="font-medium text-blue-400">
//                       {post.sentiment_title?.compound?.toFixed(2) || "N/A"}
//                     </span>
//                   </div>
//                   <div className="bg-gray-700/50 p-3 rounded-lg">
//                     <span className="block text-gray-400 mb-1">
//                       Content Sentiment
//                     </span>
//                     <span className="font-medium text-purple-400">
//                       {post.sentiment_content?.compound?.toFixed(2) || "N/A"}
//                     </span>
//                   </div>
//                   <div className="bg-gray-700/50 p-3 rounded-lg">
//                     <span className="block text-gray-400 mb-1">
//                       Average Sentiment
//                     </span>
//                     <span
//                       className={`font-medium ${
//                         post.avg_sentiment > 0
//                           ? "text-green-400"
//                           : post.avg_sentiment < 0
//                           ? "text-red-400"
//                           : "text-gray-400"
//                       }`}
//                     >
//                       {post.avg_sentiment?.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SentimentAnalysis;

import React, { useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const SentimentAnalysis = () => {
  const [subreddit, setSubreddit] = useState("technology");
  const [limit, setLimit] = useState(5);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeSentiment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/analyze_sentiment",
        {
          subreddit: subreddit.trim(),
          limit: parseInt(limit),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
        }
      );

      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to analyze sentiment");
    } finally {
      setLoading(false);
    }
  };
  const chartData = results
    ? {
        labels: ["Positive", "Neutral", "Negative"],
        datasets: [
          {
            data: Object.values(results.sentiment_distribution),
            backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
            hoverOffset: 4,
          },
        ],
      }
    : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Reddit Sentiment Analyzer
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subreddit
            </label>
            <input
              type="text"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter subreddit name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Posts
            </label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              min="1"
              max="20"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <button
          onClick={analyzeSentiment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Analyzing..." : "Analyze Sentiment"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {results && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            r/{results.subreddit} Analysis Results
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Sentiment Distribution
              </h3>
              <div className="max-w-xs mx-auto">
                {chartData && <Doughnut data={chartData} />}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Statistics</h3>
              <div className="space-y-2">
                <p>Total Posts Analyzed: {results.total_posts}</p>
                <p>
                  Positive Comments: {results.sentiment_distribution.positive}
                </p>
                <p>
                  Neutral Comments: {results.sentiment_distribution.neutral}
                </p>
                <p>
                  Negative Comments: {results.sentiment_distribution.negative}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Analyzed Posts</h3>
            <div className="space-y-4">
              {results.posts.map((post, index) => (
                <div key={index} className="border p-4 rounded-md">
                  <h4 className="font-medium mb-2">{post.title}</h4>
                  <a
                    href={post.url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Post
                  </a>

                  <div className="mt-2 space-y-2">
                    {post.comments.map((comment, idx) => (
                      <div key={idx} className="text-sm p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">{comment.text}</p>
                        <span
                          className={`font-medium ${
                            comment.sentiment === "positive"
                              ? "text-green-600"
                              : comment.sentiment === "negative"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {comment.sentiment} ({comment.score.toFixed(2)})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;
