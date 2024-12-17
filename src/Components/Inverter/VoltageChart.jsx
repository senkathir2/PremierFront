import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "../realtimestyle.css"; // Import the CSS file
import sidbarInfo from "../../sidbarInfo";

const RealTimeVoltageChart = ({ apiKey }) => {
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
      if(sidbarInfo.apiUrls[apiKey]?.apiUrl){
        const response = await axios.get(sidbarInfo.apiUrls[apiKey]?.apiUrl)
  
        const rVol_recent = response.data["recent data"]["r_voltage"];
        const yVol_recent = response.data["recent data"]["y_voltage"];
        const bVol_recent = response.data["recent data"]["b_voltage"];
        const ryVol_recent = response.data["recent data"]["ry_voltage"];
        const ybVol_recent = response.data["recent data"]["yb_voltage"];
        const brVol_recent = response.data["recent data"]["br_voltage"];
        const timestamp = response.data["recent data"]["timestamp"];
  
        updateChartData(
          timestamp,
          rVol_recent,
          yVol_recent,
          bVol_recent,
          ryVol_recent,
          ybVol_recent,
          brVol_recent
        );
      }
      //updatePowerStatus(ebRecent, dg1Recent, dg2Recent);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateChartData = (
    timestamp,
    rVol_recent,
    yVol_recent,
    bVol_recent,
    ryVol_recent,
    ybVol_recent,
    brVol_recent
  ) => {
    const newEntry = {
      time: timestamp,
      Vr: rVol_recent,
      Vy: yVol_recent,
      Vb: bVol_recent,
      Vry: ryVol_recent,
      Vyb: ybVol_recent,
      Vbr: brVol_recent,
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
  }, [apiKey]);

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
        data: data.map((item) =>
          item.Vr
        ),
        borderColor: "#D33030",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vy Voltage",
        data: data.map((item) =>
          item.Vy
        ),
        borderColor: "#FFB319",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vb Voltage",
        data: data.map((item) =>
          item.Vb
        ),
        borderColor: "#017EF3",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vry Voltage",
        data: data.map((item) =>
          item.Vry
        ),
        borderColor: "#DC8006",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vyb Voltage",
        data: data.map((item) =>
          item.Vyb
        ),
        borderColor: "#16896B",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Vbr Voltage",
        data: data.map((item) =>
          item.Vbr
        ),
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

  return (
    <div className="containerchart">
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
            <span className="legend-color-box" style={{backgroundColor: '#DC8006'}}/>
            <span>RY Voltage</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box" style={{backgroundColor: '#16896B'}}/>
            <span>YB Voltage</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box" style={{backgroundColor: '#6036D4'}}/>
            <span>BR Voltage</span>
          </div>
        </div>
        <div className="chart-size">
          <Line data={voltageChartData} options={options} />
        </div>
      </div>
      <div className="value-cont">
        <div className="value-heading">Voltage</div>
        <div className="current-value">Recent Value</div>
        <div className="legend-container" style= {{ marginTop: '0px', justifyItems: "start", justifyContent: "center"}}>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box v1" /> R Voltage
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].Vr.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">V</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box v2" />
              Y Voltage
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].Vy.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">V</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box v3" />
              B Voltage
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].Vb.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">V</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box ln" style={{backgroundColor: '#DC8006'}}/>
              RY Voltage
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].Vry.toFixed(2) 
                : "0.00"}{" "}
              <span className="value-span">V</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box ln"style={{backgroundColor: '#16896B'}} />
              YB Voltage
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].Vyb.toFixed(2) 
                : "0.00"}{" "}
              <span className="value-span">V</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box ln" style={{backgroundColor: '#6036D4'}}/>
              BR Voltage
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].Vbr.toFixed(2) 
                : "0.00"}{" "}
              <span className="value-span">V</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeVoltageChart;
