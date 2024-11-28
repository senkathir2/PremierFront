import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "../realtimestyle.css"; // Import the shared CSS file
import sidbarInfo from "../../sidbarInfo";
import { Checkbox } from "@mui/material";

const RealTimeCurrentChart = ({ firstFeederApiKey, secondFeederApiKey }) => {
  const [data, setData] = useState([]);
  const [powerStatus, setPowerStatus] = useState("Loading...");
  const ref = useRef();
  const [firstFeederCheckBox, setFirstFeederCheckBox] = useState({
    avgCurrent: true,
    rCurrent: true,
    yCurrent: true,
    bCurrent: true,
  });
  const [secondFeederCheckBox, setSecondFeederCheckBox] = useState({
    avgCurrent: true,
    rCurrent: true,
    yCurrent: true,
    bCurrent: true,
  });
  const firstFeederLegendData = [
    { id: "avgCurrent", title: "Avg Current", isSecondFeeder: false },
    { id: "rCurrent", title: "R Phase", isSecondFeeder: false },
    { id: "yCurrent", title: "Y Phase", isSecondFeeder: false },
    { id: "bCurrent", title: "B Phase", isSecondFeeder: false },
  ];
  const secondFeederLegendData = [
    { id: "avgCurrent", title: "Avg Current", isSecondFeeder: true },
    { id: "rCurrent", title: "R Phase", isSecondFeeder: true },
    { id: "yCurrent", title: "Y Phase", isSecondFeeder: true },
    { id: "bCurrent", title: "B Phase", isSecondFeeder: true },
  ];

  const fetchData = async () => {
    const currentTime = new Date().toISOString();
    const params = {
      start_date_time: new Date(Date.now() - 60000).toISOString(), // last one minute
      end_date_time: currentTime,
      resample_period: "T", // per minute
    };
    try {
      const [firstFeederResponse, secondFeederResponse] = await Promise.all([
        axios.get(sidbarInfo.apiUrls[firstFeederApiKey]?.apiUrl),
        axios.get(sidbarInfo.apiUrls[secondFeederApiKey]?.apiUrl),
      ]);

      const timestamp = firstFeederResponse.data["recent data"]["timestamp"];
      const avgCurrentFirst =
        firstFeederResponse.data["recent data"]["avg_current"];
      const rCurrentFirst =
        firstFeederResponse.data["recent data"]["r_current"];
      const yCurrentFirst =
        firstFeederResponse.data["recent data"]["y_current"];
      const bCurrentFirst =
        firstFeederResponse.data["recent data"]["b_current"];
      const avgCurrentSecond =
        secondFeederResponse.data["recent data"]["avg_current"];
      const rCurrentSecond =
        secondFeederResponse.data["recent data"]["r_current"];
      const yCurrentSecond =
        secondFeederResponse.data["recent data"]["y_current"];
      const bCurrentSecond =
        secondFeederResponse.data["recent data"]["b_current"];

      updateChartData(
        timestamp,
        avgCurrentFirst,
        rCurrentFirst,
        yCurrentFirst,
        bCurrentFirst,
        avgCurrentSecond,
        rCurrentSecond,
        yCurrentSecond,
        bCurrentSecond
      );
      //updatePowerStatus(ebRecent, dg1Recent, dg2Recent);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateChartData = (
    timestamp,
    avgCurrentFirst,
    rCurrentFirst,
    yCurrentFirst,
    bCurrentFirst,
    avgCurrentSecond,
    rCurrentSecond,
    yCurrentSecond,
    bCurrentSecond
  ) => {
    const newEntry = {
      time: timestamp,
      avgCurrentFirst: avgCurrentFirst,
      rCurrentFirst: rCurrentFirst,
      yCurrentFirst: yCurrentFirst,
      bCurrentFirst: bCurrentFirst,
      avgCurrentSecond: avgCurrentSecond,
      rCurrentSecond: rCurrentSecond,
      yCurrentSecond: yCurrentSecond,
      bCurrentSecond: bCurrentSecond,
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
        data: data.map((item) => item.avgCurrentFirst),
        borderColor: "#6036D4",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "R Current",
        data: data.map((item) => item.rCurrentFirst),
        borderColor: "#D33030",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Y Current",
        data: data.map((item) => item.yCurrentFirst),
        borderColor: "#FFB319",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "B Current",
        data: data.map((item) => item.bCurrentFirst),
        borderColor: "#017EF3",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Avg Current 2",
        data: data.map((item) => item.avgCurrentSecond),
        borderColor: "#6036D4",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "R Current 2",
        data: data.map((item) => item.rCurrentSecond),
        borderColor: "#D33030",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Y Current 2",
        data: data.map((item) => item.yCurrentSecond),
        borderColor: "#FFB319",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "B Current 2",
        data: data.map((item) => item.bCurrentSecond),
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
      <div className="value-cont">
        <div className="value-heading">Current</div>
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
                <span className="value-span">A</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chart-cont">
        <div className="title">Current</div>
        <div className="legend-container-two">
          <div className="legend-item">
            <span
              className="legend-color-box v1"
              style={{ backgroundColor: "#6036D4" }}
            />
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
          <Line data={currentChartData} options={options} ref={ref}/>
        </div>
      </div>
      <div className="value-cont">
        <div className="value-heading">Current</div>
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
                    handleCheckBox(e, index+4, item.id, item.isSecondFeeder)
                  }
                />{" "}
                {item.title}
              </div>
              <div className="value">
                {data.length > 0
                  ? data[data.length - 1][`${item.id}Second`].toFixed(2)
                  : "0.00"}{" "}
                <span className="value-span">A</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeCurrentChart;
