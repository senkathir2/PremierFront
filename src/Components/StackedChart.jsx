import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";
import TimeBar from "./TRFF/TimePeriod"; // Ensure this path is correct
import ToggleButtons from "./Togglesampling"; // Import the ToggleButtons component
//import DateRangeSelector from "./Daterangeselector"; // Import the DateRangeSelector component
import BarChartLoad from "./ChartLoading";
import "./StackedBarDGEB.css"; // Import the CSS file for styling

const StackedBarChart = ({
  data,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  timeperiod,
  setTimeperiod,
  dateRange,
  setDateRange,
  backgroundColors = [], // Add backgroundColors prop
}) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data && data["resampled data"]) {
      try {
        const resampledData = data["resampled data"];

        // Define the keys to include manually and their custom labels
        const kwKeys = [
          { key: "Skyd1Reading_kw_eb", label: "Skyde" },
          { key: "Utility1st2ndFS2Reading_kw_eb", label: "Utility" },
          { key: "SpareStation3Reading_kw_eb", label: "Spare Station 3" },
          { key: "ThirdFloorZohoS4Reading_kw_eb", label: "Zoho" },
          { key: "SixthFloorS5Reading_kw_eb", label: "Sixth Floor" },
          { key: "SpareS6Reading_kw_eb", label: "Spare S6" },
          { key: "SpareS7Reading_kw_eb", label: "Spare S7" },
          { key: "ThirdFifthFloorKotakReading_kw_eb", label: "Kotak" },
        ];

        // Generate x-axis labels based on selected time period
        const xAxisLabels = generateXAxisLabels(resampledData);

        const datasets = kwKeys
          .map((entry, index) => ({
            label: entry.label,
            data: resampledData.map((item) => item[entry.key] || 0),
            backgroundColor:
              backgroundColors[index] ||
              `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                Math.random() * 255
              )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
          }))
          .filter((dataset) =>
            dataset.data.some((value) => value !== null && value !== 0)
          ); // Filter out datasets with only null or zero values

        setChartData({
          labels: xAxisLabels,
          datasets: datasets,
        });
      } catch (error) {
        console.error("Error processing data", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError("No resampled data available");
    }
  }, [data, timeperiod, backgroundColors]);

  // Function to generate x-axis labels based on timeperiod
  const generateXAxisLabels = (resampledData) => {
    if (!resampledData || resampledData.length === 0) return [];

    switch (timeperiod) {
      case "H": // Hourly
        return resampledData.map((item) =>
          dayjs(item.timestamp).format("MMM D, H:mm")
        );
      case "D": // Daily
        return resampledData.map((item) =>
          dayjs(item.timestamp).format("MMM D, YYYY")
        );
      case "W": // Weekly
        return resampledData.map((item, index) => {
          const weekNumber = dayjs(item.timestamp).week();
          return `Week ${weekNumber} - ${dayjs(item.timestamp).format("MMM")}`;
        });
      case "M": // Monthly
        return resampledData.map((item) =>
          dayjs(item.timestamp).format("MMM YYYY")
        );
      case "Q": // Quarterly
        return resampledData.map((item) => {
          const month = dayjs(item.timestamp).month();
          const quarter = Math.floor(month / 3) + 1;
          return `Q${quarter} ${dayjs(item.timestamp).format("YYYY")}`;
        });
      case "Y": // Yearly
        return resampledData.map((item) =>
          dayjs(item.timestamp).format("YYYY")
        );
      default:
        return resampledData.map((item) =>
          dayjs(item.timestamp).format("MMM D, YYYY")
        );
    }
  };

  if (loading) {
    return (
      <div>
        <BarChartLoad />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="stacked-bar-container">
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row">
            <div className="title">Energy Consumption by Feeders</div>
            <div className="controls">
              <TimeBar
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                dateRange={dateRange}
                setDateRange={setDateRange}
                setTimeperiod={setTimeperiod}
                startDate={startDate}
                endDate={endDate}
              />
              {/* <DateRangeSelector
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              /> */}
            </div>
          </div>
          <div className="row">
            <ToggleButtons
              dateRange={dateRange}
              timeperiod={timeperiod}
              setTimeperiod={setTimeperiod}
            />
          </div>

          {chartData && chartData.labels && chartData.labels.length > 0 ? (
            <div className="chart-size">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // Allow full width and height to be controlled by CSS

                  plugins: {
                    legend: {
                      display: true,
                      position: "bottom",
                      align: "start",
                      labels: {
                        boxWidth: 15,
                        boxHeight: 15,
                        padding: 20,
                        font: {
                          size: 14,
                          family: "DM Sans",
                        },
                        usePointStyle: true,
                        color: "#333",
                      },
                    },
                  },
                  scales: {
                    x: {
                      stacked: true,
                      grid: {
                        color: "rgba(0, 0, 0, 0.05)",
                        borderDash: [8, 4],
                      },
                    },
                    y: {
                      stacked: true,
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div>No data available for the selected range.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StackedBarChart;
