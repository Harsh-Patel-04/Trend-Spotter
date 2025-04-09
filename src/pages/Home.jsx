// import React from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   SparklesIcon,
//   ChartBarIcon,
//   LightBulbIcon,
//   ArrowRightIcon,
// } from "@heroicons/react/24/outline";
// import {
//   BarChart3,
//   Youtube,
//   MessageSquareText,
//   Brain,
//   TrendingUp,
//   LineChart,
//   Activity,
//   Share2,
//   ArrowRight,
// } from "lucide-react";
// import { Database, Cpu, BarChart } from "lucide-react";

// const Home = () => {
//   const steps = [
//     {
//       icon: <Database className="w-12 h-12 text-trend-blue" />,
//       title: "Data Collection",
//       description: "We gather data from multiple social platforms in real-time",
//     },
//     {
//       icon: <Cpu className="w-12 h-12 text-trend-blue" />,
//       title: "AI Processing",
//       description: "Our advanced AI algorithms process and analyze the data",
//     },
//     {
//       icon: <TrendingUp className="w-12 h-12 text-trend-blue" />,
//       title: "Trend Identification",
//       description: "Emerging trends are identified before they go mainstream",
//     },
//     {
//       icon: <BarChart className="w-12 h-12 text-trend-blue" />,
//       title: "Actionable Insights",
//       description: "Get clear insights and predictions to inform your strategy",
//     },
//   ];
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 opacity-20">
//         <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
//         <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
//       </div>

//       <div className="container mx-auto px-4 py-20 text-center relative z-10">
//         <div className="relative">
//           <div className="max-w-6xl mx-auto text-center text-white">
//             <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
//               AI-Powered Social Media
//             </h1>
//             <h2
//               className="text-3xl md:text-5xl font-bold mb-8 animate-fade-in"
//               style={{ animationDelay: "0.2s" }}
//             >
//               Trend Prediction Platform
//             </h2>
//             <p
//               className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white/90 animate-fade-in"
//               style={{ animationDelay: "0.4s" }}
//             >
//               Discover emerging trends in real-time across social platforms with
//               advanced AI analysis and predictive capabilities.
//             </p>
//             <button
//               className="button-primary text-lg py-6 px-8 animate-fade-in"
//               style={{ animationDelay: "0.6s" }}
//             >
//               Get Started <ArrowRight className="ml-2 w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4 text-trend-darkblue">
//               How It Works
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Our platform uses cutting-edge AI technology to predict trends
//               before they go viral. Here's how we make it happen:
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {steps.map((step, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-8 rounded-xl shadow-lg text-center animate-fade-in"
//                 style={{ animationDelay: `${0.2 * index}s` }}
//               >
//                 <div className="mb-4 flex justify-center">{step.icon}</div>
//                 <h3 className="text-xl font-bold mb-2 text-trend-purple">
//                   {step.title}
//                 </h3>
//                 <p className="text-gray-600">{step.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Features Grid */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center transform transition-all hover:scale-105">
//               <div className="flex justify-center mb-6">
//                 <Activity className="w-12 h-12 text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-bold text-white mb-4">
//                 Real-time Analytics
//               </h3>
//               <p className="text-gray-300">
//                 Monitor social media trends as they happen with our advanced
//                 real-time analytics engine.
//               </p>
//             </div>

//             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center transform transition-all hover:scale-105">
//               <div className="flex justify-center mb-6">
//                 <Brain className="w-12 h-12 text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-bold text-white mb-4">
//                 Sentiment Analysis
//               </h3>
//               <p className="text-gray-300">
//                 Understand public opinion and emotional context with our
//                 AI-powered sentiment analysis.
//               </p>
//             </div>

//             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center transform transition-all hover:scale-105">
//               <div className="flex justify-center mb-6">
//                 <Share2 className="w-12 h-12 text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-bold text-white mb-4">
//                 Trend Prediction
//               </h3>
//               <p className="text-gray-300">
//                 Stay ahead of the curve with predictive analytics that forecast
//                 upcoming trends.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  Database,
  Cpu,
  TrendingUp,
  BarChart,
  Activity,
  Brain,
  Share2,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  const steps = [
    {
      icon: <Database className="w-12 h-12 text-blue-400" />,
      title: "Data Collection",
      description: "We gather data from multiple social platforms in real-time",
    },
    {
      icon: <Cpu className="w-12 h-12 text-blue-400" />,
      title: "AI Processing",
      description: "Our advanced AI algorithms process and analyze the data",
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-blue-400" />,
      title: "Trend Identification",
      description: "Emerging trends are identified before they go mainstream",
    },
    {
      icon: <BarChart className="w-12 h-12 text-blue-400" />,
      title: "Actionable Insights",
      description: "Get clear insights and predictions to inform your strategy",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
            AI-Powered Social Media
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-blue-200">
            Trend Prediction Platform
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-blue-100/90">
            Discover emerging trends in real-time across social platforms with
            advanced AI analysis and predictive capabilities.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="w-5 h-5 mt-1" />
            </Link>
          </motion.div>
        </motion.div>

        {/* How It Works Section */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-blue-200">
              How It Works
            </h2>
            <p className="text-xl text-blue-100/90 max-w-3xl mx-auto">
              Our platform uses cutting-edge AI technology to predict trends
              before they go viral. Here's how we make it happen:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-blue-400/30 transition-all"
              >
                <div className="mb-4 flex justify-center">{step.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-blue-400">
                  {step.title}
                </h3>
                <p className="text-blue-100/90">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Grid */}

        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-blue-200">Features</h2>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Activity className="w-12 h-12 text-blue-400" />,
                title: "Real-time Analytics",
                description:
                  "Monitor social media trends as they happen with our advanced real-time analytics engine.",
              },
              {
                icon: <Brain className="w-12 h-12 text-blue-400" />,
                title: "Sentiment Analysis",
                description:
                  "Understand public opinion and emotional context with our AI-powered sentiment analysis.",
              },
              {
                icon: <Share2 className="w-12 h-12 text-blue-400" />,
                title: "Trend Prediction",
                description:
                  "Stay ahead of the curve with predictive analytics that forecast upcoming trends.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-blue-400/30 transition-all"
              >
                <div className="flex justify-center mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-blue-400 mb-4">
                  {feature.title}
                </h3>
                <p className="text-blue-100/90">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
