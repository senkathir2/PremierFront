import React from "react";
import HeatMap from "@uiw/react-heat-map";

const HeatmapChart2 = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    console.log("No data available");
    return <div>No data available</div>;
  }

  // Extracting dates and total kW from the data
  const labels = Object.keys(data);
  const totalKw = data[labels[0]].map((item) => ({
    date: item.date_time,
    count: labels.reduce((sum, label) => {
      const endpointData = data[label];
      return sum + endpointData.find((d) => d.date_time === item.date_time).kw;
    }, 0),
  }));

  // Calculate the average total kW
  const averageTotalKw =
    totalKw.reduce((sum, item) => sum + item.count, 0) / totalKw.length;

  // Determine the color for each cell based on its value relative to the average
  const colorScheme = totalKw.map((item) => {
    if (item.count > averageTotalKw) {
      return "#FF0000"; // Red
    } else if (item.count < averageTotalKw) {
      return "#00FF00"; // Green
    } else {
      return "#FFFF00"; // Yellow
    }
  });

  return (
    <div className="card-body">
      <HeatMap
        value={totalKw}
        weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
        startDate={new Date("2021/10/16")}
        width={"100%"}
        height={"80%"}
        colors={colorScheme}
      />
    </div>
  );
};

export default HeatmapChart2;
