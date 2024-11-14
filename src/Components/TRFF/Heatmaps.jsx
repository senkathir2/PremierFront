import React from "react";
import HeatMap from "@uiw/react-heat-map";

const HeatmapChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    console.log("No data available");

    return <div>No data available</div>;
  }

  // Extracting dates and total kW from the data
  const labels = Object.keys(data);
  const totalKw = data[labels[0]].map((item) => ({
    date: item.date_time, // Change this to 'date'
    count: labels.reduce((sum, label) => {
      const endpointData = data[label];
      return sum + endpointData.find((d) => d.date_time === item.date_time).kw;
    }, 0),
  }));

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
          <div>
            <HeatMap
              value={totalKw}
              weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
              startDate={new Date("2021/10/16")}
              width={"100%"}
              height={"80%"}
            />{" "}
          </div>
          <hr />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam,
          debitis.
        </div>
      </div>
    </div>
  );
};

export default HeatmapChart;
