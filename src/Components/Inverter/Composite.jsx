import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  registerables,
} from "chart.js";
import axios from "axios";
import "../realtimestyle.css"; // Import the shared CSS file
import "chartjs-adapter-date-fns";
import sidbarInfo from "../../sidbarInfo";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  ...registerables
);

const RealTimeChart = ({ apiKey }) => {
  const [data, setData] = useState([]);
  const [powerStatus, setPowerStatus] = useState("Loading...");
  const [activeData, setActiveData] = useState([]);
  const location = useLocation();
  // Fetch data from APIs
  const fetchData = async () => {
    const currentTime = new Date().toISOString();
    const params = {
      start_date_time: new Date(Date.now() - 60000).toISOString(), // last one minute
      end_date_time: currentTime,
      resample_period: "T", // per minute
    };
    try {
      if (sidbarInfo.apiUrls[apiKey]?.apiUrl) {
        const response = await axios.get(sidbarInfo.apiUrls[apiKey]?.apiUrl);

        const timestamp = response.data["recent data"]["timestamp"];
        const bActiveRecent = response.data["recent data"]["b_ac_power"];
        const rActiveRecent = response.data["recent data"]["r_ac_power"];
        const yActiveRecent = response.data["recent data"]["y_ac_power"];
        const bAppRecent = response.data["recent data"]["dc_power"];

        updateChartData(
          timestamp,
          bActiveRecent,
          rActiveRecent,
          yActiveRecent,
          bAppRecent,
        );
        //updatePowerStatus(ebRecent, dgRecent, dg1s12Recent);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Update chart data
  const updateChartData = (
    timestamp,
    bActiveRecent,
    rActiveRecent,
    yActiveRecent,
    bAppRecent,
  ) => {
    const newEntry = {
      time: timestamp,
      bActiveRecent: bActiveRecent,
      rActiveRecent: rActiveRecent,
      yActiveRecent: yActiveRecent,
      bAppRecent: bAppRecent,
    };

    setData((prevData) => {
      const updatedData = [...prevData, newEntry];
      return updatedData.length > 15
        ? updatedData.slice(updatedData.length - 15)
        : updatedData;
    });

    // setActiveData((prevData) => {
    //   let activeEntry = { time: newEntry.time, kwh: 0 };
    //   if (newEntry.ebCurrent > 0) {
    //     activeEntry = { time: newEntry.time, kwh: newEntry.ebKw, source: "EB" };
    //   } else if (newEntry.dgCurrent > 0) {
    //     activeEntry = {
    //       time: newEntry.time,
    //       kwh: newEntry.dgKw,
    //       source: "DG2S3",
    //     };
    //   } else if (newEntry.dg1s12Current > 0) {
    //     activeEntry = {
    //       time: newEntry.time,
    //       kwh: newEntry.dg1s12Kw,
    //       source: "DG1S12",
    //     };
    //   }
    //   const updatedActiveData = [...prevData, activeEntry];
    //   return updatedActiveData.length > 15
    //     ? updatedActiveData.slice(updatedActiveData.length - 15)
    //     : updatedActiveData;
    // });
  };

  // Update power status
  const updatePowerStatus = (ebRecent, dgRecent, dg1s12Recent) => {
    if (ebRecent.average_current > 0) {
      setPowerStatus("Running on EB Power");
    } else if (dgRecent.average_current > 0) {
      setPowerStatus("Running on Generator Power (DG2S3)");
    } else if (dg1s12Recent.average_current > 0) {
      setPowerStatus("Running on Generator Power (DG1S12)");
    } else {
      setPowerStatus("No Power");
    }
  };

  // Set up data fetching interval
  useEffect(() => {
    setData([]);
    setActiveData([]);
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // polling every 5 seconds

    return () => clearInterval(interval);
  }, [apiKey]);

  // Configure chart data
  const chartData = {
    labels: data.map((item) => item.time),
    datasets: [
      {
        label: "R Active",
        data: data.map((item) => item.rActiveRecent),
        borderColor: "#C72F08",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Y Active",
        data: data.map((item) => item.yActiveRecent),
        borderColor: "#E6B148",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "B Active",
        data: data.map((item) => item.bActiveRecent),
        borderColor: "#0171DB",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "R App",
        data: data.map((item) => item.bAppRecent),
        borderColor: "#E45D3A",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
    ],
  };

  // Configure chart options
  //const maxKwh = Math.max(...activeData.map((item) => item.kwh), 0);

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          tooltipFormat: "ll HH:mm",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)", // Light gray color for the grid
          borderDash: [5, 5], // Dotted line style
          borderWidth: 1, // Dotted line width
        },
      },
      y: {
        title: {
          display: true,
          text: "Power (kW)",
        },
        //min: maxKwh - 5, // dynamically adjust the scale
        //max: maxKwh + 5, // dynamically adjust the scale
        grid: {
          color: "rgba(0, 0, 0, 0.05)", // Light gray color for the grid
          borderDash: [5, 5], // Dotted line style
          borderWidth: 1, // Dotted line width
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + " kW";
            }
            return label;
          },
        },
      },
      legend: {
        display: false, // Hide default legend
      },
    },
  };

  // Render the chart component
  return (
    <div className="containerchart">
      <div className="chart-cont">
        <div className="title">Power</div>
        <div className="legend-container-two">
          <div className="legend-item">
            <span className="legend-color-box" style={{backgroundColor: '#C72F08'}}/>
            <span>R AC Power</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box" style={{backgroundColor: '#E6B148'}}/>
            <span>Y AC Power</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box" style={{backgroundColor: '#0171DB'}}/>
            <span>B AC Power</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box" style={{backgroundColor: '#E45D3A'}}/>
            <span>DC Power</span>
          </div>
        </div>
        <div className="chart-size">
          <Line data={chartData} options={options} />
        </div>
      </div>
      <div className="value-cont">
        <div className="value-heading">Power</div>
        <div className="current-value">Recent Value</div>
        <div className="legend-container" style= {{ marginTop: '0px', justifyItems: "start", justifyContent: "center"}}>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box" style={{backgroundColor: '#C72F08'}}/> R AC Power
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].rActiveRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box" style={{backgroundColor: '#E6B148'}}/> Y AC Power
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].yActiveRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box v1" style={{backgroundColor: '#0171DB'}}/> B AC Power
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].bActiveRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box v1" style={{backgroundColor: '#E45D3A'}}/> DC Power
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].bAppRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeChart;
