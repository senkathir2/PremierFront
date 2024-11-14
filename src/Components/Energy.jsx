import React from "react";
import { PieChart, Pie, Sector, Cell } from "recharts";

const EnergyMeter = ({ value }) => {
  const maxValue = 2500; // Set the maximum value your gauge can represent in kWh

  // Calculate the percentage of the current value relative to the maxValue
  const percentageValue = (value / maxValue) * 100;

  const data = [
    { name: "Active", value: percentageValue },
    { name: "Inactive", value: 100 - percentageValue },
  ];

  // Render the custom needle as an SVG path
  const renderNeedle = (percentage, color) => {
    const degrees = (percentage / 100) * 180; // Convert percentage to degrees (0 - 180)
    const radians = (degrees * Math.PI) / 180;
    const radius = 70; // Adjust based on the outer radius of the Pie chart
    // Calculate the position of the needle tip
    const x = 100 + radius * Math.cos(Math.PI - radians);
    const y = 100 - radius * Math.sin(Math.PI - radians);
    // Path for the needle shape
    const path = `M100,100 L${x},${y} L100,20 Z`;
    return <path d={path} fill={color} stroke="black" strokeWidth="1" />;
  };

  return (
    <PieChart width={200} height={100}>
      <Pie
        data={data}
        cx={100}
        cy={100}
        startAngle={180}
        endAngle={0}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
        isAnimationActive={false}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={index === 0 ? "#82ca9d" : "#d0d0d0"}
          />
        ))}
        <Sector
          cx={100}
          cy={100}
          innerRadius={90}
          outerRadius={100}
          startAngle={180}
          endAngle={180 - (percentageValue / 100) * 180}
          fill="black"
        />
      </Pie>
      {renderNeedle(percentageValue, "red")}
    </PieChart>
  );
};

export default EnergyMeter;
