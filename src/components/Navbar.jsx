// import React from "react";
// import {
//   BarChart3,
//   Youtube,
//   LineChart,
//   FileText,
//   TrendingUp,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//   return (
//     <header className="bg-trend-darkblue py-6 px-6 md:px-10 text-white top-0 z-50 shadow-lg">
//       <nav className="max-w-7xl mx-auto flex items-center justify-between">
//         <TrendingUp className="w-8 h-8 text-blue-400" />
//         <Link to="/" className="ml-2 text-3xl font-bold text-white">
//           Trend Spotter
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-8">
//           <Link
//             to="/dashboard"
//             className="flex flex-col items-center gap-1 hover:bg-blue-800/20 px-4 py-2 rounded-lg transition-all"
//           >
//             <BarChart3 className="w-6 h-6" />
//             <span className="text-sm">Reddit Posts</span>
//           </Link>
//           <Link
//             to="/trends"
//             className="flex flex-col items-center gap-1 hover:bg-blue-800/20 px-4 py-2 rounded-lg transition-all"
//           >
//             <Youtube className="w-6 h-6" />
//             <span className="text-sm">Youtube Hashtags</span>
//           </Link>
//           <Link
//             to="/sentiment-analysis"
//             className="flex flex-col items-center gap-1 hover:bg-blue-800/20 px-4 py-2 rounded-lg transition-all"
//           >
//             <LineChart className="w-6 h-6" />
//             <span className="text-sm">Analysis</span>
//           </Link>
//           <Link
//             to="/report"
//             className="flex flex-col items-center gap-1 hover:bg-blue-800/20 px-4 py-2 rounded-lg transition-all"
//           >
//             <FileText className="w-6 h-6" />
//             <span className="text-sm">Report</span>
//           </Link>
//         </div>

//         {/* Mobile Menu Button */}
//         <div className="md:hidden flex items-center">
//           <button className="text-white p-2 hover:bg-blue-800/20 rounded-lg">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 6h16M4 12h16m-7 6h7"
//               />
//             </svg>
//           </button>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;

import React from "react";
import {
  BarChart3,
  Youtube,
  LineChart,
  FileText,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-gray-900 py-4 px-6 md:px-10 text-white top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <TrendingUp className="w-8 h-8 text-blue-400" />
          <span className="ml-2 text-2xl font-bold text-white">
            Trend Spotter
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/reddit-posts"
            className="flex flex-col items-center gap-1 hover:bg-blue-800/20 px-4 py-2 rounded-lg transition-all group"
          >
            <BarChart3 className="w-6 h-6 group-hover:text-blue-300" />
            <span className="text-sm">Reddit Posts</span>
          </Link>
          <Link
            to="/trends"
            className="flex flex-col items-center gap-1 hover:bg-blue-800/20 px-4 py-2 rounded-lg transition-all group"
          >
            <Youtube className="w-6 h-6 group-hover:text-blue-300" />
            <span className="text-sm">YouTube Hashtags</span>
          </Link>
          <Link
            to="/sentiment-analysis"
            className="flex flex-col items-center gap-1 hover:bg-blue-800/20 px-4 py-2 rounded-lg transition-all group"
          >
            <LineChart className="w-6 h-6 group-hover:text-blue-300" />
            <span className="text-sm">Analysis</span>
          </Link>
          <Link
            to="/report"
            className="flex flex-col items-center gap-1 hover:bg-blue-800/20 px-4 py-2 rounded-lg transition-all group"
          >
            <FileText className="w-6 h-6 group-hover:text-blue-300" />
            <span className="text-sm">Report</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            className="text-white p-2 hover:bg-blue-800/20 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
