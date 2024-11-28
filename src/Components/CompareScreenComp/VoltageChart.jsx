import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "../realtimestyle.css"; // Import the CSS file
import sidbarInfo from "../../sidbarInfo";
import { Checkbox } from "@mui/material";

const RealTimeVoltageChart = ({ firstFeederApiKey, secondFeederApiKey }) => {
  const [data, setData] = useState([]);
  const [powerStatus, setPowerStatus] = useState("Loading...");
  const ref = useRef();
  const [firstFeederCheckBox, setFirstFeederCheckBox] = useState({
    rVol: true,
    yVol: true,
    bVol: true,
    ryVol: true,
    ybVol: true,
    brVol: true,
  });
  const [secondFeederCheckBox, setSecondFeederCheckBox] = useState({
    rVol: true,
    yVol: true,
    bVol: true,
    ryVol: true,
    ybVol: true,
    brVol: true,
  });
  const firstFeederLegendData = [
    { id: "rVol", title: "R Voltage", isSecondFeeder: false },
    { id: "yVol", title: "Y Voltage", isSecondFeeder: false },
    { id: "bVol", title: "B Voltage", isSecondFeeder: false },
    { id: "ryVol", title: "RY Voltage", isSecondFeeder: false },
    { id: "ybVol", title: "YB Voltage", isSecondFeeder: false },
    { id: "brVol", title: "BR Voltage", isSecondFeeder: false },
  ];
  const secondFeederLegendData = [
    { id: "rVol", title: "R Voltage", isSecondFeeder: true },
    { id: "yVol", title: "Y Voltage", isSecondFeeder: true },
    { id: "bVol", title: "B Voltage", isSecondFeeder: true },
    { id: "ryVol", title: "RY Voltage", isSecondFeeder: true },
    { id: "ybVol", title: "YB Voltage", isSecondFeeder: true },
    { id: "brVol", title: "BR Voltage", isSecondFeeder: true },
  ];

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

        const rVolFirst =
          firstFeederResponse.data["recent data"]["r_phase_voltage"];
        const yVolFirst =
          firstFeederResponse.data["recent data"]["y_phase_voltage"];
        const bVolFirst =
          firstFeederResponse.data["recent data"]["b_phase_voltage"];
        const ryVolFirst =
          firstFeederResponse.data["recent data"]["ry_voltage"];
        const ybVolFirst =
          firstFeederResponse.data["recent data"]["yb_voltage"];
        const brVolFirst =
          firstFeederResponse.data["recent data"]["br_voltage"];
        const timestamp = firstFeederResponse.data["recent data"]["timestamp"];
        const rVolSecond =
          secondFeederResponse.data["recent data"]["r_phase_voltage"];
        const yVolSecond =
          secondFeederResponse.data["recent data"]["y_phase_voltage"];
        const bVolSecond =
          secondFeederResponse.data["recent data"]["b_phase_voltage"];
        const ryVolSecond =
          secondFeederResponse.data["recent data"]["ry_voltage"];
        const ybVolSecond =
          secondFeederResponse.data["recent data"]["yb_voltage"];
        const brVolSecond =
          secondFeederResponse.data["recent data"]["br_voltage"];

        updateChartData(
          timestamp,
          rVolFirst,
          yVolFirst,
          bVolFirst,
          ryVolFirst,
          ybVolFirst,
          brVolFirst,
          rVolSecond,
          yVolSecond,
          bVolSecond,
          ryVolSecond,
          ybVolSecond,
          brVolSecond
        );
      }
      //updatePowerStatus(ebRecent, dg1Recent, dg2Recent);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateChartData = (
    timestamp,
    rVolFirst,
    yVolFirst,
    bVolFirst,
    ryVolFirst,
    ybVolFirst,
    brVolFirst,
    rVolSecond,
    yVolSecond,
    bVolSecond,
    ryVolSecond,
    ybVolSecond,
    brVolSecond
  ) => {
    const newEntry = {
      time: timestamp,
      rVolFirst,
      yVolFirst,
      bVolFirst,
      ryVolFirst,
      ybVolFirst,
      brVolFirst,
      rVolSecond,
      yVolSecond,
      bVolSecond,
      ryVolSecond,
      ybVolSecond,
      brVolSecond,
    };

    setData((prevData) => {
      const updatedData = [...prevData, newEntry];
      return updatedData.length > 15
        ? updatedData.slice(updatedData.length - 15)
        : updatedData;
    });
  };

  const updatePowerStatus = (ebRecent, dg1Recent, dg2Recent) => {
    if (ebRecent.average_current > 0) {
      setPowerStatus("Running on EB");
    } else if (dg1Recent.average_current > 0) {
      setPowerStatus("Running on DG1");
    } else if (dg2Recent.average_current > 0) {
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
  }, [firstFeederApiKey, secondFeederApiKey]);

  // const activeData = data
  //   .filter(
  //     (item) =>
  //       item.ebV1 > 0 ||
  //       item.ebV2 > 0 ||
  //       item.ebV3 > 0 ||
  //       item.ebLN > 0 ||
  //       item.dg1V1 > 0 ||
  //       item.dg1V2 > 0 ||
  //       item.dg1V3 > 0 ||
  //       item.dg1LN > 0 ||
  //       item.dg2V1 > 0 ||
  //       item.dg2V2 > 0 ||
  //       item.dg2V3 > 0 ||
  //       item.dg2LN > 0
  //   )
  //   .slice(-15);

  const labels = data.map((item) => item.time);

  const voltageChartData = {
    labels,
    datasets: [
      {
        label: "Vr Voltage",
        data: data.map((item) => item.rVolFirst),
        borderColor: "#D33030",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vy Voltage",
        data: data.map((item) => item.yVolFirst),
        borderColor: "#FFB319",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vb Voltage",
        data: data.map((item) => item.bVolFirst),
        borderColor: "#017EF3",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vry Voltage",
        data: data.map((item) => item.ryVolFirst),
        borderColor: "#DC8006",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vyb Voltage",
        data: data.map((item) => item.ybVolFirst),
        borderColor: "#16896B",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vbr Voltage",
        data: data.map((item) => item.brVolFirst),
        borderColor: "#6036D4",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vr Voltage Sec",
        data: data.map((item) => item.rVolSecond),
        borderColor: "#D33030",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vy Voltage Sec",
        data: data.map((item) => item.yVolSecond),
        borderColor: "#FFB319",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vb Voltage Sec",
        data: data.map((item) => item.bVolSecond),
        borderColor: "#017EF3",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vry Voltage Sec",
        data: data.map((item) => item.ryVolSecond),
        borderColor: "#DC8006",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vyb Voltage Sec",
        data: data.map((item) => item.ybVolSecond),
        borderColor: "#16896B",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vbr Voltage Sec",
        data: data.map((item) => item.brVolSecond),
        borderColor: "#6036D4",
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
          text: "Voltage (V)",
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

  return (
    <div className="containerchart">
      <div className="value-cont">
        <div className="value-heading">Voltage</div>
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
                <span className="value-span">V</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chart-cont">
        <div className="title">Voltage</div>
        <div className="legend-container-two">
          <div className="legend-item">
            <span className="legend-color-box v1" />
            <span>R Voltage</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box v2" />
            <span>Y Voltage</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box v3" />
            <span>B Voltage</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color-box"
              style={{ backgroundColor: "#DC8006" }}
            />
            <span>RY Voltage</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color-box"
              style={{ backgroundColor: "#16896B" }}
            />
            <span>YB Voltage</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color-box"
              style={{ backgroundColor: "#6036D4" }}
            />
            <span>BR Voltage</span>
          </div>
        </div>
        <div className="chart-size">
          <Line data={voltageChartData} options={options} ref={ref}/>
        </div>
      </div>
      <div className="value-cont">
        <div className="value-heading">Voltage</div>
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
                    handleCheckBox(e, index+6, item.id, item.isSecondFeeder)
                  }
                />{" "}
                {item.title}
              </div>
              <div className="value">
                {data.length > 0
                  ? data[data.length - 1][`${item.id}First`].toFixed(2)
                  : "0.00"}{" "}
                <span className="value-span">V</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeVoltageChart;
