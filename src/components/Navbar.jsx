import React from "react";
import { Link } from "react-router-dom";
import {
  ChartBarIcon,
  FireIcon,
  MapIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
    { name: "Trends", href: "/trends", icon: FireIcon },
    { name: "Analysis", href: "/sentiment-analysis", icon: MapIcon },
    { name: "Reports", href: "/reports", icon: DocumentChartBarIcon },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-400">
              Trend Spotter
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md"
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
