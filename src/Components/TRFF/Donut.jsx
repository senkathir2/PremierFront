import React from "react";
import { Doughnut, Radar } from "react-chartjs-2";

const DonutChart = ({ data, bgcolor }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div>No data available</div>;
  }

  const labels = Object.keys(data);
  const totalSums = labels.map((label) => {
    const endpointData = data[label];
    return endpointData.reduce((sum, item) => sum + item.kw, 0);
  });

  const datasets = [
    {
      data: totalSums,
      backgroundColor: bgcolor, // Use bgcolor prop for background color
      borderColor: bgcolor,
      borderWidth: 1,
    },
  ];

  const chartData = {
    labels: labels,
    datasets: datasets,
  };

  const chartDataRadar = {
    labels: labels,
    datasets: datasets,
  };

  const donutChartOptions = {
    aspectRatio: 3,
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: "Cumulative OG2_kwh",
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const radarChartOptions = {
    aspectRatio: 3,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        suggestedMin: 0,
        ticks: {
          stepSize: 10000000, // Set step size to 100000000 (1cr)
          callback: function (value, index, values) {
            // Convert numeric value to "1cr" to "8cr" format
            return value / 10000000 + "cr";
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide labels in radar chart
      },
    },
  };

  return (
    <div>
      <div className="row">
        <div className="col-lg-6 mb-4" style={{ height: "500px" }}>
          <div className="card shadow mb-4 h-100">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Donut Chart</h6>
            </div>
            <div className="card-body">
              <Doughnut data={chartData} options={donutChartOptions} />
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-4" style={{ height: "500px" }}>
          <div className="card shadow mb-4 h-100">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Radar Chart</h6>
            </div>
            <div className="card-body">
              <Radar data={chartDataRadar} options={radarChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
