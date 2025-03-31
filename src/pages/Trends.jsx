import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import GeoMap from "../components/GeoMap";

Chart.register(...registerables);

const Trends = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Trend Volume",
        data: data.values,
        backgroundColor: "#3B82F6",
        borderRadius: 8,
        hoverBackgroundColor: "#2563EB",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Trend Analysis</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-6">
              Category Distribution
            </h2>
            <Bar data={chartData} options={options} />
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-6">Regional Trends</h2>
            <GeoMap data={data.regional} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;
