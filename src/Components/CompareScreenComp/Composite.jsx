import React, { useEffect, useRef, useState } from "react";
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
import testData from "../../testdata.json";
import { CheckBox } from "@mui/icons-material";
import { Checkbox } from "@mui/material";

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

const RealTimeChart = ({ firstFeederApiKey, secondFeederApiKey }) => {
  const [data, setData] = useState([]);
  const [firstFeederData, setFirstFeederData] = useState([]);
  const [secondFeederData, setSecondFeederData] = useState([]);
  const [powerStatus, setPowerStatus] = useState("Loading...");
  const [activeData, setActiveData] = useState([]);
  const location = useLocation();
  const ref = useRef();
  const [firstFeederCheckBox, setFirstFeederCheckBox] = useState({
    rActive: true,
    yActive: true,
    bActive: true,
    rApp: true,
    yApp: true,
    bApp: true,
    rReactive: true,
    yReactive: true,
    bReactive: true,
  });
  const [secondFeederCheckBox, setSecondFeederCheckBox] = useState({
    rActive: true,
    yActive: true,
    bActive: true,
    rApp: true,
    yApp: true,
    bApp: true,
    rReactive: true,
    yReactive: true,
    bReactive: true,
  });
  const firstFeederLegendData = [
    { id: "rActive", title: "R Active", isSecondFeeder: false },
    { id: "yActive", title: "Y Active", isSecondFeeder: false },
    { id: "bActive", title: "B Active", isSecondFeeder: false },
    { id: "rApp", title: "R App", isSecondFeeder: false },
    { id: "yApp", title: "Y App", isSecondFeeder: false },
    { id: "bApp", title: "B App", isSecondFeeder: false },
    { id: "rReactive", title: "R Reactive", isSecondFeeder: false },
    { id: "yReactive", title: "Y Reactive", isSecondFeeder: false },
    { id: "bReactive", title: "R Reactive", isSecondFeeder: false },
  ];
  const secondFeederLegendData = [
    { id: "rActive", title: "R Active", isSecondFeeder: true },
    { id: "yActive", title: "Y Active", isSecondFeeder: true },
    { id: "bActive", title: "B Active", isSecondFeeder: true },
    { id: "rApp", title: "R App", isSecondFeeder: true },
    { id: "yApp", title: "Y App", isSecondFeeder: true },
    { id: "bApp", title: "B App", isSecondFeeder: true },
    { id: "rReactive", title: "R Reactive", isSecondFeeder: true },
    { id: "yReactive", title: "Y Reactive", isSecondFeeder: true },
    { id: "bReactive", title: "R Reactive", isSecondFeeder: true },
  ];
  // Fetch data from APIs
  const fetchData = async () => {
    const currentTime = new Date().toISOString();
    const params = {
      start_date_time: new Date(Date.now() - 60000).toISOString(), // last one minute
      end_date_time: currentTime,
      resample_period: "T", // per minute
    };
    try {
      if (
        sidbarInfo.apiUrls[firstFeederApiKey]?.apiUrl &&
        sidbarInfo.apiUrls[secondFeederApiKey]?.apiUrl
      ) {
        const [firstFeederResponse, secondFeederResponse] = await Promise.all([
          axios.get(sidbarInfo.apiUrls[firstFeederApiKey]?.apiUrl),
          axios.get(sidbarInfo.apiUrls[secondFeederApiKey]?.apiUrl),
        ]);
        const timestampFirst =
          firstFeederResponse.data["recent data"]["timestamp"];
        const bActiveFirst =
          firstFeederResponse.data["recent data"]["b_ac_power"];
        const rActiveFirst =
          firstFeederResponse.data["recent data"]["r_ac_power"];
        const yActiveFirst =
          firstFeederResponse.data["recent data"]["y_ac_power"];
        const bAppFirst =
          firstFeederResponse.data["recent data"]["b_app_power"];
        const rAppFirst =
          firstFeederResponse.data["recent data"]["r_app_power"];
        const yAppFirst =
          firstFeederResponse.data["recent data"]["y_app_power"];
        const bReactiveFirst =
          firstFeederResponse.data["recent data"]["b_reactive_power"];
        const rReactiveFirst =
          firstFeederResponse.data["recent data"]["r_reactive_power"];
        const yReactiveFirst =
          firstFeederResponse.data["recent data"]["y_reactive_power"];
        const rActiveSecond =
          secondFeederResponse.data["recent data"]["r_ac_power"];
        const yActiveSecond =
          secondFeederResponse.data["recent data"]["y_ac_power"];
        const bActiveSecond =
          secondFeederResponse.data["recent data"]["b_ac_power"];
        const bAppSecond =
          secondFeederResponse.data["recent data"]["b_app_power"];
        const rAppSecond =
          secondFeederResponse.data["recent data"]["r_app_power"];
        const yAppSecond =
          secondFeederResponse.data["recent data"]["y_app_power"];
        const bReactiveSecond =
          secondFeederResponse.data["recent data"]["b_reactive_power"];
        const rReactiveSecond =
          secondFeederResponse.data["recent data"]["r_reactive_power"];
        const yReactiveSecond =
          secondFeederResponse.data["recent data"]["y_reactive_power"];
        updateChartData(
          timestampFirst,
          rActiveFirst,
          bActiveFirst,
          yActiveFirst,
          bAppFirst,
          rAppFirst,
          yAppFirst,
          bReactiveFirst,
          rReactiveFirst,
          yReactiveFirst,
          rActiveSecond,
          bActiveSecond,
          yActiveSecond,
          bAppSecond,
          rAppSecond,
          yAppSecond,
          bReactiveSecond,
          rReactiveSecond,
          yReactiveSecond
        );
      }
      //updatePowerStatus(ebRecent, dgRecent, dg1s12Recent);
      //}
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Update chart data
  const updateChartData = (
    timestamp,
    rActiveFirst,
    bActiveFirst,
    yActiveFirst,
    bAppFirst,
    rAppFirst,
    yAppFirst,
    bReactiveFirst,
    rReactiveFirst,
    yReactiveFirst,
    rActiveSecond,
    bActiveSecond,
    yActiveSecond,
    bAppSecond,
    rAppSecond,
    yAppSecond,
    bReactiveSecond,
    rReactiveSecond,
    yReactiveSecond
  ) => {
    const newEntry = {
      time: timestamp,
      rActiveFirst: rActiveFirst,
      bActiveFirst: bActiveFirst,
      yActiveFirst: yActiveFirst,
      bAppFirst: bAppFirst,
      rAppFirst: rAppFirst,
      yAppFirst: yAppFirst,
      bReactiveFirst: bReactiveFirst,
      rReactiveFirst: rReactiveFirst,
      yReactiveFirst: yReactiveFirst,
      rActiveSecond: rActiveSecond,
      bActiveSecond: bActiveSecond,
      yActiveSecond: yActiveSecond,
      bAppSecond: bAppSecond,
      rAppSecond: rAppSecond,
      yAppSecond: yAppSecond,
      bReactiveSecond: bReactiveSecond,
      rReactiveSecond: rReactiveSecond,
      yReactiveSecond: yReactiveSecond,
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
  }, [firstFeederApiKey, secondFeederApiKey]);

  // Configure chart data
  const chartData = {
    labels: data.map((item) => item.time),
    datasets: [
      {
        label: "R Active",
        data: data.map((item) => item.rActiveFirst),
        borderColor: "#C72F08",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Y Active",
        data: data.map((item) => item.yActiveFirst),
        borderColor: "#E6B148",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "B Active",
        data: data.map((item) => item.bActiveFirst),
        borderColor: "#0171DB",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "R App",
        data: data.map((item) => item.rAppFirst),
        borderColor: "#E45D3A",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Y App",
        data: data.map((item) => item.yAppFirst),
        borderColor: "#B38A38",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "B App",
        data: data.map((item) => item.bAppFirst),
        borderColor: "#0158AA",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "R Reactive",
        data: data.map((item) => item.rReactiveFirst),
        borderColor: "#9B2406",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Y Reactive",
        data: data.map((item) => item.yReactiveFirst),
        borderColor: "#FFD173",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "B Reactive",
        data: data.map((item) => item.bReactiveFirst),
        borderColor: "#3498F5",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: `R Active_${secondFeederApiKey}`,
        data: data.map((item) => item.rActiveSecond),
        borderColor: "#C72F08",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: `Y Active_${secondFeederApiKey}`,
        data: data.map((item) => item.yActiveSecond),
        borderColor: "#E6B148",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: `B Active_${secondFeederApiKey}`,
        data: data.map((item) => item.bActiveSecond),
        borderColor: "#0171DB",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: `R App_${secondFeederApiKey}`,
        data: data.map((item) => item.rAppSecond),
        borderColor: "#E45D3A",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: `Y App_${secondFeederApiKey}`,
        data: data.map((item) => item.yAppSecond),
        borderColor: "#B38A38",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: `B App_${secondFeederApiKey}`,
        data: data.map((item) => item.bAppSecond),
        borderColor: "#0158AA",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: `R Reactive_${secondFeederApiKey}`,
        data: data.map((item) => item.rReactiveSecond),
        borderColor: "#9B2406",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: `Y Reactive_${secondFeederApiKey}`,
        data: data.map((item) => item.yReactiveSecond),
        borderColor: "#FFD173",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: `B Reactive_${secondFeederApiKey}`,
        data: data.map((item) => item.bReactiveSecond),
        borderColor: "#3498F5",
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

  const handleCheckBox = (e, index, label, isSecondFeeder) => {
    let checkBoxStateCopy = isSecondFeeder ? { ...secondFeederCheckBox } : { ...firstFeederCheckBox };
    const chart = ref.current;
    checkBoxStateCopy[label] = e.target.checked;
    if(isSecondFeeder)
    {
      setSecondFeederCheckBox(checkBoxStateCopy)
    } else{
      setFirstFeederCheckBox(checkBoxStateCopy);
    }
    chart.getDatasetMeta(index).hidden = !e.target.checked;
    chart.update();
  };

  // Render the chart component
  return (
    <div className="containerchart">
      <div className="value-cont">
        <div className="value-heading">Power</div>
        <div className="current-value">Recent Value</div>
        <div
          className="legend-container"
          style={{
            marginTop: "0px",
            justifyItems: "start",
            justifyContent: "center",
          }}
        >
          {firstFeederLegendData.map((item, index) => (
            <div className="legend-item-two">
              <div className="value-name">
                <Checkbox
                  checked={firstFeederCheckBox[item.id]}
                  style={{ padding: "0px" }}
                  onChange={(e) =>
                    handleCheckBox(e, index, item.id, item.isSecondFeeder)
                  }
                />{" "}
                {item.title}
              </div>
              <div className="value">
                {data.length > 0
                  ? data[data.length - 1][`${item.id}First`].toFixed(2)
                  : "0.00"}{" "}
                <span className="value-span">kW</span>
              </div>
            </div>
          ))}

          {/* <div className="legend-item-two">
            <div className="value-name">
              <Checkbox
                checked={firstFeederCheckBox["YActive"]}
                style={{ padding: "0px" }}
                onChange={(e) => handleCheckBox(e, 1, "YActive")}
              />{" "}
              Y Active
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
              <Checkbox
                checked={firstFeederCheckBox["BActive"]}
                style={{ padding: "0px" }}
                onChange={(e) => handleCheckBox(e, 2, "BActive")}
              />{" "}
              B Active
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
              <Checkbox
                checked={firstFeederCheckBox["RApp"]}
                style={{ padding: "0px" }}
                onChange={(e) => handleCheckBox(e, 3, "RApp")}
              />{" "}
              R App
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].rAppRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <Checkbox
                checked={firstFeederCheckBox["YApp"]}
                style={{ padding: "0px" }}
                onChange={(e) => handleCheckBox(e, 4, "YApp")}
              />{" "}
              Y App
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].rAppRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <Checkbox
                checked={firstFeederCheckBox["BApp"]}
                style={{ padding: "0px" }}
                onChange={(e) => handleCheckBox(e, 5, "BApp")}
              />{" "}
              B App
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].rAppRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <Checkbox
                checked={firstFeederCheckBox["RReactive"]}
                style={{ padding: "0px" }}
                onChange={(e) => handleCheckBox(e, 6, "RReactive")}
              />{" "}
              R Reactive
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].rAppRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <Checkbox
                checked={firstFeederCheckBox["YReactive"]}
                style={{ padding: "0px" }}
                onChange={(e) => handleCheckBox(e, 7, "RReactive")}
              />{" "}
              Y Reactive
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].rAppRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <Checkbox
                checked={firstFeederCheckBox["BReactive"]}
                style={{ padding: "0px" }}
                onChange={(e) => handleCheckBox(e, 8, "BReactive")}
              />{" "}
              B Reactive
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].rAppRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div> */}
        </div>
      </div>
      <div className="chart-cont">
        <div className="title">Power</div>
        <div className="legend-container-two">
          <div className="legend-item">
            <span
              className="legend-color-box"
              style={{ backgroundColor: "#C72F08" }}
            />
            <span>R Active</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color-box"
              style={{ backgroundColor: "#E6B148" }}
            />
            <span>Y Active</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color-box"
              style={{ backgroundColor: "#0171DB" }}
            />
            <span>B Active</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color-box"
              style={{ backgroundColor: "#E45D3A" }}
            />
            <span>R App</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color-box"
              style={{ backgroundColor: "#B38A38" }}
            />
            <span>Y App</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color-box"
              style={{ backgroundColor: "#0158AA" }}
            />
            <span>B App</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color-box"
              style={{ backgroundColor: "#9B2406" }}
            />
            <span>R Reactive</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color-box"
              style={{ backgroundColor: "#FFD173" }}
            />
            <span>Y Reactive</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color-box"
              style={{ backgroundColor: "#3498F5" }}
            />
            <span>B Reactive</span>
          </div>
        </div>
        <div className="chart-size">
          <Line data={chartData} options={options} ref={ref} />
        </div>
      </div>
      <div className="value-cont">
        <div className="value-heading">Power</div>
        <div className="current-value">Recent Value</div>
        <div
          className="legend-container"
          style={{
            marginTop: "0px",
            justifyItems: "start",
            justifyContent: "center",
          }}
        >
          {secondFeederLegendData.map((item, index) => (
            <div className="legend-item-two">
              <div className="value-name">
                <Checkbox
                  checked={secondFeederCheckBox[item.id]}
                  style={{ padding: "0px" }}
                  onChange={(e) =>
                    handleCheckBox(e, index+9, item.id, item.isSecondFeeder)
                  }
                />{" "}
                {item.title}
              </div>
              <div className="value">
                {data.length > 0
                  ? data[data.length - 1][`${item.id}Second`].toFixed(2)
                  : "0.00"}{" "}
                <span className="value-span">kW</span>
              </div>
            </div>
          ))}
          {/* <div className="legend-item-two">
            <div className="value-name">
              <Checkbox
                checked={firstFeederCheckBox["BReactive"]}
                style={{ padding: "0px" }}
                onChange={(e) => handleCheckBox(e, 8, "BReactive")}
              />{" "}
              R Active
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
              <span
                className="legend-color-box"
                style={{ backgroundColor: "#E6B148" }}
              />{" "}
              Y Active
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
              <span
                className="legend-color-box v1"
                style={{ backgroundColor: "#0171DB" }}
              />{" "}
              B Active
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
              <span
                className="legend-color-box v1"
                style={{ backgroundColor: "#E45D3A" }}
              />{" "}
              R App
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].rAppRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span
                className="legend-color-box v1"
                style={{ backgroundColor: "#B38A38" }}
              />
              Y App
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].rAppRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span
                className="legend-color-box v1"
                style={{ backgroundColor: "#0158AA" }}
              />
              B App
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].rAppRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span
                className="legend-color-box v1"
                style={{ backgroundColor: "#9B2406" }}
              />
              R Reactive
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].rAppRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span
                className="legend-color-box v1"
                style={{ backgroundColor: "#FFD173" }}
              />
              Y Reactive
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].rAppRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span
                className="legend-color-box v1"
                style={{ backgroundColor: "#3498F5" }}
              />{" "}
              B Reactive
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].rAppRecent.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">kW</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default RealTimeChart;
