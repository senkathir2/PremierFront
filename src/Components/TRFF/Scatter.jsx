import React from "react";
import { Scatter } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "chartjs-adapter-moment";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const ChartHeatmap = ({ data, timeperiod, setTimeperiod }) => {
  const handleChange = (event, newAlignment) => {
    setTimeperiod(newAlignment);
  };

  if (!data || Object.keys(data).length === 0) {
    return <div>No data available</div>;
  }

  const labels = Object.keys(data);
  const datasets = labels.map((label, index) => {
    const endpointData = data[label];
    const dataPoints = endpointData.map((item, i) => ({
      x: new Date(item.date_time),
      y: i,
      value: item.kw,
    }));

    return {
      label: label,
      data: dataPoints,
      backgroundColor: `rgba(${index * 50}, ${index * 100}, ${
        index * 150
      }, 0.5)`,
      borderColor: `rgba(${index * 50}, ${index * 100}, ${index * 150}, 1)`,
      borderWidth: 1,
    };
  });

  const chartData = {
    datasets: datasets,
  };

  const chartOptions = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: timeperiod.toLowerCase(), // Set the time unit based on the timeperiod
        },
      },
      y: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context) => {
            const dataPoint = context[0].dataset.data[context[0].dataIndex];
            return dataPoint.x.toLocaleString(); // Format the x-axis value as desired
          },
          label: (context) => {
            const dataPoint = context.dataset.data[context.dataIndex];
            return `Value: ${dataPoint.value}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <div className="card shadow mb-">
        <div className="card-header py-3" style={{ display: "flex" }}>
          <h6
            style={{ width: "10vw", display: "flex" }}
            className="m-0 font-weight-bold text-primary"
          >
            Heatmap
          </h6>
        </div>
        <div className="card-body">
          <div className="chart-area">
            <Scatter data={chartData} options={chartOptions} />
          </div>
          <hr />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam,
          debitis.
        </div>
      </div>
    </div>
  );
};

export default ChartHeatmap;
