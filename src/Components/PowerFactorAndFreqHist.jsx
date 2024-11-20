import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";
import TimeBar from "./TRFF/TimePeriod"; // Ensure this path is correct
import ToggleButtons from "./Togglesampling"; // Import the ToggleButtons component
//import DateRangeSelector from "./Daterangeselector"; // Import the DateRangeSelector component
import "./StackedBarDGEB.css"; // Import the CSS file

const PowerfactorAndFreqHistorical = ({
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

        const datasets = [
            {
              label: "Powerfactor",
              data: resampledData.map((item) =>
                item["avg_power_factor"]
              ),
              borderColor: "#D33030",
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 0,
              tension: 0.4, // Smooth line
              yAxisID: 'y'
            },
            {
              label: "Frequency",
              data: resampledData.map((item) =>
                item["frequency"]
              ),
              borderColor: "#FFB319",
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 0,
              tension: 0.4, // Smooth line
              yAxisID: 'y1'
            },
            
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

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5],
        },
      },
      y: {
        title: {
          display: true,
          text: "Powerfactor",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5],
        },
        position: 'left'
      },
      y1: {
        title: {
          display: true,
          text: "Frequency (Hz)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5],
        },
        position: 'right'
      },
    },
    plugins: {
      legend: {
        display: false, // Hide default legend
      },
    },
  };

  return (
    <div className="stacked-bar-container">
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row">
            <div className="title">Power Factor & Frequency</div>
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
              <Line
                data={chartData}
                options={options}
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

export default PowerfactorAndFreqHistorical;
