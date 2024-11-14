import {
  ArrowUpward,
  Bolt,
  ElectricBolt,
  ElectricMeter,
  ElectricalServices,
} from "@mui/icons-material";
import React from "react";

const KPI = ({ data }) => {
  if (
    !data ||
    !data["recent data"] ||
    !data["today"] ||
    !data["resampled data"]
  ) {
    return <div>No data available</div>;
  }

  const latestResampledData = data["resampled data"];
  const currentPower = latestResampledData[latestResampledData.length - 1].kw;
  const currentVoltage = data["recent data"].ln_voltage;
  const kwToday = data["today"].kw;

  // Calculate peak current and peak voltage from the resampled data
  const peakCurrentData = data["results"].reduce((max, item) =>
    item.average_current > max.average_current ? item : max
  );
  const peakVoltageData = data["results"].reduce((max, item) =>
    item.ln_voltage > max.ln_voltage ? item : max
  );

  const peakCurrent = peakCurrentData.average_current;
  const peakCurrentTime = new Date(peakCurrentData.timestamp);

  const peakVoltage = peakVoltageData.ln_voltage;
  const peakVoltageTime = new Date(peakVoltageData.timestamp);

  // Format date to 'HH:MM AM/PM, DD Month YY' format
  const formatDate = (date) =>
    date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "2-digit",
      month: "long",
      year: "2-digit",
    });

  return (
    <div
      className="kpi-container"
      style={{ display: "flex", gap: "1vw", marginBottom: "2vh" }}
    >
      <div className="kpi-conttwo">
        <div className="kpi-top">
          <div className="kpi-tit">Current Energy</div>
          <div style={{ display: "inline" }}>
            <span className="kpi-val">{Number(currentPower.toFixed(2))}</span>
            <span className="kpi-units"> Kwh</span>
          </div>
        </div>
        <div className="kpi-bot">
          <span className="percentage-cont">
            <ElectricalServices sx={{ fontSize: "14px" }} />
          </span>
          <span className="percentage-span">Current Power Consumption</span>
        </div>
      </div>

      <div className="kpi-conttwo">
        <div className="kpi-top">
          <div className="kpi-tit">Energy Today</div>
          <div style={{ display: "inline" }}>
            <span className="kpi-val">{Number(kwToday.toFixed(0))}</span>
            <span className="kpi-units"> Wh</span>
          </div>
        </div>
        <div className="kpi-bot">
          <span className="percentage-cont">
            <Bolt sx={{ fontSize: "14px" }} />
          </span>
          <span className="percentage-span">Energy Consumption Today</span>
        </div>
      </div>

      <div className="kpi-conttwo">
        <div className="kpi-top">
          <div className="kpi-tit">Peak Current</div>
          <div style={{ display: "inline" }}>
            <span className="kpi-val">{Number(peakCurrent.toFixed(2))}</span>
            <span className="kpi-units"> Amps</span>
          </div>
        </div>
        <div className="kpi-bot">
          <span className="percentage-cont">
            <ArrowUpward sx={{ fontSize: "14px" }} />
          </span>
          <span className="percentage-span">{formatDate(peakCurrentTime)}</span>
        </div>
      </div>

      <div className="kpi-conttwo">
        <div className="kpi-top">
          <div className="kpi-tit">Peak Voltage</div>
          <div style={{ display: "inline" }}>
            <span className="kpi-val">{Number(peakVoltage.toFixed(2))}</span>
            <span className="kpi-units"> Volts</span>
          </div>
        </div>
        <div className="kpi-bot">
          <span className="percentage-cont">
            <ArrowUpward sx={{ fontSize: "14px" }} />
          </span>
          <span className="percentage-span">{formatDate(peakVoltageTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default KPI;
