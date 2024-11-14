import React from "react";
import { Bar } from "react-chartjs-2";

const ChartStack = ({ data, timeperiod, setTimeperiod, bgcolor }) => {
  const handleChange = (event, newAlignment) => {
    setTimeperiod(newAlignment);
  };

  if (!data || Object.keys(data).length === 0) {
    return <div>No data available</div>;
  }

  const labels = Object.keys(data);
  const datasets = labels.map((label, index) => {
    const endpointData = data[label];
    const actPowValues = endpointData.map((item) => item.kw);
    return {
      label: label,
      data: actPowValues,
      backgroundColor: bgcolor[index % bgcolor.length], // Use bgcolor prop
      borderColor: bgcolor[index % bgcolor.length], // Use bgcolor prop
      borderWidth: 1,
    };
  });

  const chartData = {
    labels: data[labels[0]].map((item) => item.date_time),
    datasets: datasets,
  };

  const chartOptions = {
    aspectRatio: 4,
    responsive: true,
    scales: {
      x: {
        stacked: true,
        type: "time",
      },
      y: {
        stacked: true,
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
            Area Chart
          </h6>
        </div>
        <div className="card-body">
          <div className="chart-area">
            <Bar data={chartData} options={chartOptions} />
          </div>
          <hr />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam,
          debitis.
        </div>
      </div>
    </div>
  );
};

export default ChartStack;
