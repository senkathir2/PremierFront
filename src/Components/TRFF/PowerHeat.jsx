import React from "react";
import { Chart, registerables } from "chart.js";
import { Bubble } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

Chart.register(...registerables);

const HeatmapChart = ({ data }) => {
  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Power Cuts",
        data: data.map((entry) => ({
          x: entry.hour,
          y: entry.day,
          r: entry.status * 10, // use radius to visually indicate status
        })),
        backgroundColor: data.map((entry) =>
          entry.status ? "rgba(255,0,0,0.8)" : "rgba(0,255,0,0.8)"
        ),
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Hour",
        },
        type: "linear",
        position: "bottom",
      },
      y: {
        title: {
          display: true,
          text: "Day",
        },
        type: "linear",
        ticks: {
          stepSize: 1,
          beginAtZero: true,
          max: Math.max(...data.map((entry) => entry.day)),
        },
      },
    },
  };

  return <Bubble data={chartData} options={options} />;
};

const sampleHeatmapData = [
  { hour: 0, day: 1, status: 1 },
  { hour: 1, day: 1, status: 1 },
  { hour: 2, day: 1, status: 0 },
  { hour: 3, day: 1, status: 0 },
  { hour: 4, day: 1, status: 1 },
  { hour: 5, day: 1, status: 1 },
  { hour: 0, day: 2, status: 1 },
  { hour: 1, day: 2, status: 1 },
  { hour: 2, day: 2, status: 0 },
  { hour: 3, day: 2, status: 0 },
  { hour: 4, day: 2, status: 1 },
  { hour: 5, day: 2, status: 1 },
];

const Powerheat = () => (
  <div>
    <h1>Power Cuts Heatmap</h1>
    <HeatmapChart data={sampleHeatmapData} />
  </div>
);

export default Powerheat;
