import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import TimeDrop from "./Timedrop";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import styled from "styled-components";
import "./EnergyComp.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Title = styled.div`
  color: var(--Gray---Typography-700, #242f3e);
  font-feature-settings: "liga" off, "clig" off;
  font-family: "DM Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
`;

const CombinedChart = ({
  data,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  timeperiod,
  setTimeperiod,
  dateRange,
  setDateRange,
  backgroundColors = [],
}) => {
  const [barChartData, setBarChartData] = useState(null);
  const [doughnutChartData, setDoughnutChartData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data["recent data"]) {
      const recentData = data["recent data"];

      const labels = [];
      const barValues = [];
      const doughnutValues = [];
      const links = [];

      // Populate the data arrays
      if (recentData.Skyd1Reading_kwh_eb > 0) {
        labels.push("Skyde");
        barValues.push(recentData.Skyd1Reading_kwh_eb / 1e6); // Bar chart in MWh
        doughnutValues.push(recentData.Skyd1Reading_kwh_eb);
        links.push("/skyd1");
      }
      if (recentData.Utility1st2ndFS2Reading_kwh_eb > 0) {
        labels.push("Utility");
        barValues.push(recentData.Utility1st2ndFS2Reading_kwh_eb / 1e6);
        doughnutValues.push(recentData.Utility1st2ndFS2Reading_kwh_eb);
        links.push("/utility1st2ndfs2");
      }
      if (recentData.SpareStation3Reading_kwh_eb > 0) {
        labels.push("Spare S3");
        barValues.push(recentData.SpareStation3Reading_kwh_eb / 1e6);
        doughnutValues.push(recentData.SpareStation3Reading_kwh_eb);
        links.push("/sparestation3");
      }
      if (recentData.ThirdFloorZohoS4Reading_kwh_eb > 0) {
        labels.push("Zoho");
        barValues.push(recentData.ThirdFloorZohoS4Reading_kwh_eb / 1e6);
        doughnutValues.push(recentData.ThirdFloorZohoS4Reading_kwh_eb);
        links.push("/thirdfloorzohos4");
      }
      if (recentData.SixthFloorS5Reading_kwh_eb > 0) {
        labels.push("Spare S5");
        barValues.push(recentData.SixthFloorS5Reading_kwh_eb / 1e6);
        doughnutValues.push(recentData.SixthFloorS5Reading_kwh_eb);
        links.push("/sixthfloors5");
      }
      if (recentData.SpareS6Reading_kwh_eb > 0) {
        labels.push("Spare S6");
        barValues.push(recentData.SpareS6Reading_kwh_eb / 1e6);
        doughnutValues.push(recentData.SpareS6Reading_kwh_eb);
        links.push("/spares6");
      }
      if (recentData.SpareS7Reading_kwh_eb > 0) {
        labels.push("Spare S7");
        barValues.push(recentData.SpareS7Reading_kwh_eb / 1e6);
        doughnutValues.push(recentData.SpareS7Reading_kwh_eb);
        links.push("/spares7");
      }
      if (recentData.ThirdFifthFloorKotakReading_kwh_eb > 0) {
        labels.push("Third Fifth Floor Kotak");
        barValues.push(recentData.ThirdFifthFloorKotakReading_kwh_eb / 1e6);
        doughnutValues.push(recentData.ThirdFifthFloorKotakReading_kwh_eb);
        links.push("/thirdfifthfloorkotak");
      }

      // Update bar chart data
      setBarChartData({
        labels,
        datasets: [
          {
            label: "Energy Sources (MWh)",
            data: barValues,
            backgroundColor: backgroundColors.length
              ? backgroundColors
              : [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                  "#FFCD56",
                  "#C9CBCF",
                ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
              "#FFCD56",
              "#C9CBCF",
            ],
            links, // Add links to the dataset for navigation
          },
        ],
      });

      // Update doughnut chart data
      setDoughnutChartData({
        labels,
        datasets: [
          {
            label: "Energy Sources",
            data: doughnutValues,
            backgroundColor: backgroundColors.length
              ? backgroundColors
              : [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                  "#FFCD56",
                  "#C9CBCF",
                ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
              "#FFCD56",
              "#C9CBCF",
            ],
            links, // Add links to the dataset for navigation
          },
        ],
      });
    } else {
      console.error("No recent data available");
    }
  }, [data, backgroundColors]);

  if (!barChartData || !doughnutChartData) {
    return <div>Loading data...</div>;
  }

  const barChartOptions = {
    indexAxis: "y", // Make the bar chart horizontal
    responsive: true,
    maintainAspectRatio: false, // Allow full width and height to be controlled by CSS
    plugins: {
      legend: {
        display: true,
        position: "bottom", // Position the legend at the bottom
        align: "center", // Align the legend items
        labels: {
          generateLabels: (chart) => {
            return chart.data.labels.map((label, i) => ({
              text: label,
              fillStyle: chart.data.datasets[0].backgroundColor[i],
            }));
          },
          boxWidth: 15, // Box size for legend color
          boxHeight: 15,
          padding: 20, // Padding between legend items
          font: {
            size: 14, // Font size for legend text
            family: "DM Sans", // Font family for legend text
          },
          usePointStyle: true, // Use point style for legends
          color: "#333", // Text color for legend
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(3)} MWh`; // Display value in MWh with 3 decimal places
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Energy Consumption (MWh)",
          font: {
            family: "DM Sans",
            size: 14,
          },
          color: "#666",
        },
        ticks: {
          stepSize: 0.1, // Adjust the step size for better readability
          callback: function (value) {
            return value.toFixed(2) + " MWh"; // Format x-axis labels to display in MWh
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)", // Set grid line opacity to 5%
        },
      },
      y: {
        title: {
          display: true,
          text: "Sources",
          font: {
            family: "DM Sans",
            size: 14,
          },
          color: "#666",
        },
        grid: {
          display: false, // Optional: Hide grid lines for y-axis
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const datasetIndex = elements[0].datasetIndex;
        const index = elements[0].index;
        const link = barChartData.datasets[datasetIndex].links[index];
        if (link) {
          navigate(link);
        }
      }
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom", // Position the legend at the bottom
        align: "center", // Align the legend items
        labels: {
          boxWidth: 15, // Box size for legend color
          boxHeight: 15,
          padding: 20, // Padding between legend items
          font: {
            size: 14, // Font size for legend text
            family: "DM Sans", // Font family for legend text
          },
          usePointStyle: true, // Use point style for legends
          color: "#333", // Text color for legend
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}K`; // Display value with "K"
          },
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const datasetIndex = elements[0].datasetIndex;
        const index = elements[0].index;
        const link = doughnutChartData.datasets[datasetIndex].links[index];
        if (link) {
          navigate(link);
        }
      }
    },
  };

  return (
    <div className="container">
      <div className="top">
        <div className="title">Energy Consumption Overview</div>
        <div className="menubar">
          <TimeDrop
            dateRange={dateRange}
            setStartDate={setStartDate}
            setDateRange={setDateRange}
            setEndDate={setEndDate}
            setTimeperiod={setTimeperiod}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "5vh",
          height: "60vh",
          width: "100%",
        }}
      >
        <div style={{ width: "45%" }}>
          <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
        </div>
        <div style={{ width: "45%" }}>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default CombinedChart;
