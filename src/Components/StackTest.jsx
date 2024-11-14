import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";
import TimeBar from "./TRFF/TimePeriod"; // Ensure this path is correct
import ToggleButtons from "./Togglesampling"; // Import the ToggleButtons component
//import DateRangeSelector from "./Daterangeselector"; // Import the DateRangeSelector component
import "./StackedBarDGEB.css"; // Import the CSS file

const StackedBarDGEB = ({
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
          { key: "EBS10Reading_kw", label: "EB Supply" },
          { key: "DG1S12Reading_kw", label: "Diesel Generator 1" },
          { key: "DG2S3Reading_kw", label: "Diesel Generator 2" },
        ];

        // Generate x-axis labels based on selected time period
        const xAxisLabels = generateXAxisLabels(resampledData);

        // const datasets = kwKeys.map((entry, index) => ({
        //   label: entry.label,
        //   data: resampledData.map((item) => item[entry.key] || 0),
        //   backgroundColor:
        //     backgroundColors[index] ||
        //     `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        //       Math.random() * 255
        //     )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
        // }));

        const datasets = [
          {
            label: "Energy",
            data: resampledData.map((item) => item["app_energy_export"]),
            backgroundColor: resampledData.map((item) => {return item["app_energy_export"] > 1400 ? '#C72F08': '#4E46B4'})
          }
        ]

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="stacked-bar-container">
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row">
            <div className="title">Energy Consumption by Source</div>
            <div className="controls">
              <TimeBar
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                dateRange={dateRange}
                setDateRange={setDateRange}
                setTimeperiod={setTimeperiod} // Pass setTimeperiod to TimeBar
                startDate={startDate} // Pass startDate
                endDate={endDate} // Pass endDate
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
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: "bottom", // Position legend at the bottom
                      align: "start", // Align legends to the start of the container
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
                  // scales: {
                  //   x: {
                  //     stacked: true,
                  //     grid: {
                  //       color: "rgba(0, 0, 0, 0.05)", // Light gray color with 5% opacity
                  //       borderDash: [8, 4], // Dotted line style
                  //     },
                  //   },
                  //   y: {
                  //     stacked: true,
                  //   },
                  // },
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

export default StackedBarDGEB;
