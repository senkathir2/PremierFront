import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "./realtimestyle.css"; // Import the shared CSS file
import sidbarInfo from "../sidbarInfo";

const RealTimeCurrentChart = ({ apiKey }) => {
  const [data, setData] = useState([]);
  const [powerStatus, setPowerStatus] = useState("Loading...");

  const fetchData = async () => {
    const currentTime = new Date().toISOString();
    const params = {
      start_date_time: new Date(Date.now() - 60000).toISOString(), // last one minute
      end_date_time: currentTime,
      resample_period: "T", // per minute
    };
    try {
      const response = await axios.get(sidbarInfo.apiUrls[apiKey]?.apiUrl);

      const timestamp = response.data["recent data"]["timestamp"];
      const avgCurrent = response.data["recent data"]["avg_current"];
      const rCurrent = response.data["recent data"]["r_current"];
      const yCurrent = response.data["recent data"]["y_current"];
      const bCurrent = response.data["recent data"]["b_current"];

      updateChartData(timestamp, avgCurrent, rCurrent, yCurrent, bCurrent);
      //updatePowerStatus(ebRecent, dg1Recent, dg2Recent);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateChartData = (
    timestamp,
    avgCurrent,
    rCurrent,
    yCurrent,
    bCurrent
  ) => {
    const newEntry = {
      time: timestamp,
      avgCurrent: avgCurrent,
      rCurrent: rCurrent,
      yCurrent: yCurrent,
      bCurrent: bCurrent,
    };

    setData((prevData) => {
      const updatedData = [...prevData, newEntry];
      return updatedData.length > 15
        ? updatedData.slice(updatedData.length - 15)
        : updatedData;
    });
  };

  const updatePowerStatus = (ebRecent, dg1Recent, dg2Recent) => {
    if (
      ebRecent.phase_1_current > 0 ||
      ebRecent.phase_2_current > 0 ||
      ebRecent.phase_3_current > 0
    ) {
      setPowerStatus("Running on EB");
    } else if (
      dg1Recent.phase_1_current > 0 ||
      dg1Recent.phase_2_current > 0 ||
      dg1Recent.phase_3_current > 0
    ) {
      setPowerStatus("Running on DG1");
    } else if (
      dg2Recent.phase_1_current > 0 ||
      dg2Recent.phase_2_current > 0 ||
      dg2Recent.phase_3_current > 0
    ) {
      setPowerStatus("Running on DG2");
    } else {
      setPowerStatus("No Power");
    }
  };

  useEffect(() => {
    setData([]);
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // polling every 5 seconds

    return () => clearInterval(interval);
  }, [apiKey]);

  // const activeData = data
  //   .filter(
  //     (item) =>
  //       item.ebR > 0 ||
  //       item.ebY > 0 ||
  //       item.ebB > 0 ||
  //       item.dg1R > 0 ||
  //       item.dg1Y > 0 ||
  //       item.dg1B > 0 ||
  //       item.dg2R > 0 ||
  //       item.dg2Y > 0 ||
  //       item.dg2B > 0
  //   )
  //   .slice(-15);

  const labels = data.map((item) => item.time);

  const currentChartData = {
    labels,
    datasets: [
      {
        label: "Avg Current",
        data: data.map((item) => item.avgCurrent),
        borderColor: "#6036D4",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "R Current",
        data: data.map((item) => item.rCurrent),
        borderColor: "#D33030",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Y Current",
        data: data.map((item) => item.yCurrent),
        borderColor: "#FFB319",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "B Current",
        data: data.map((item) => item.bCurrent),
        borderColor: "#017EF3",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5],
        },
      },
      y: {
        title: {
          display: true,
          text: "Current (A)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5],
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide default legend
      },
    },
  };

  return (
    <div className="containerchart">
      <div className="chart-cont">
        <div className="title">Current</div>
        <div className="legend-container-two">
          <div className="legend-item">
            <span className="legend-color-box v1" />
            <span>Avg Current</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box v1" />
            <span>R phase</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box v2" />
            <span>Y phase</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box v3" />
            <span>B phase</span>
          </div>
        </div>
        <div className="chart-size">
          <Line data={currentChartData} options={options} />
        </div>
      </div>
      {/* <div className="value-cont">
        <div className="value-heading">Current</div>
        <div className="current-value">Current Value</div>
        <div className="legend-container">
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box v1" /> R phase
            </div>
            <div className="value">
              {activeData.length > 0
                ? activeData[activeData.length - 1].ebR.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">A</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box v2" />Y phase
            </div>
            <div className="value">
              {activeData.length > 0
                ? activeData[activeData.length - 1].ebY.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">A</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box v3" />B phase
            </div>
            <div className="value">
              {activeData.length > 0
                ? activeData[activeData.length - 1].ebB.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">A</span>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default RealTimeCurrentChart;
