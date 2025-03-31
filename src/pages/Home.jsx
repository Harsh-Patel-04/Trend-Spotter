import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">AI-Powered Social Media</h1>
        <h2 className="text-3xl text-blue-200 mb-8">
          Trend Prediction Platform
        </h2>

        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-xl text-gray-300 mb-8">
            Discover emerging trends in real-time across social platforms with
            advanced AI analysis and predictive capabilities.
          </p>

          <Link
            to="/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg 
            text-lg font-semibold transition-all transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            "Real-time Analytics",
            "Sentiment Analysis",
            "Trend Prediction",
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/10 p-6 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              <h3 className="text-xl font-semibold mb-4">{feature}</h3>
              <p className="text-gray-300">
                AI-powered insights and visualization for comprehensive trend
                analysis
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
