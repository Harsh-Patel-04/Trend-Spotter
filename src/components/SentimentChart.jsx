import { Doughnut } from "react-chartjs-2";

const SentimentChart = ({ data }) => (
  <Doughnut
    data={data}
    options={{
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#fff",
            font: {
              size: 14,
            },
          },
        },
      },
    }}
  />
);

export default SentimentChart;
