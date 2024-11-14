import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({ data, bgcolor }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div>No data available</div>;
  }

  const labels = Object.keys(data);
  const chartData = {
    labels: data[labels[0]].map((item) => item.date_time),
    datasets: labels.map((label, index) => ({
      label: label,
      data: data[label].map((item) => item.kw),
      fill: true,
      backgroundColor: bgcolor[index], // Set background color dynamically
      borderColor: bgcolor[index],
      borderWidth: 1,
    })),
  };

  const chartOptions = {
    aspectRatio: 4, // Set the aspect ratio here
    scales: {
      x: {
        type: "time",
      },
      y: {
        title: {
          display: true,
          text: "KW",
        },
        stacked: true, // Enable stacking on y-axis
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
            Stacked Line Chart
          </h6>
        </div>
        <div className="card-body">
          <div className="chart-area">
            <Line data={chartData} options={chartOptions} />
          </div>
          <hr />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam,
          debitis.
        </div>
      </div>
    </div>
  );
};

export default LineChart;
