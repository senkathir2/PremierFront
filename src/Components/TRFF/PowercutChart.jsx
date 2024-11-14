import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const PowercutChart = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => new Date(entry.time)),
    datasets: [
      {
        label: "Power Status",
        data: data.map((entry) => entry.status),
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        fill: true,
        stepped: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return value === 1 ? "On" : "Off";
          },
        },
        title: {
          display: true,
          text: "Power Status (On/Off)",
        },
        grid: {
          display: false,
        },
      },
      x: {
        type: "time",
        time: {
          unit: "hour",
          tooltipFormat: "HH:mm", // Correct format for tooltip
        },
        title: {
          display: true,
          text: "Time",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.raw === 1 ? "Power On" : "Power Off";
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "auto" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

const sampleData = [
  { time: "2024-07-01T00:00:00", status: 1 },
  { time: "2024-07-01T01:00:00", status: 1 },
  { time: "2024-07-01T02:00:00", status: 0 },
  { time: "2024-07-01T03:00:00", status: 0 },
  { time: "2024-07-01T04:00:00", status: 1 },
  { time: "2024-07-01T05:00:00", status: 1 },
];

const Powercut = () => (
  <div>
    <h1>Power Cuts Timeline</h1>
    <PowercutChart data={sampleData} />
  </div>
);

export default Powercut;
