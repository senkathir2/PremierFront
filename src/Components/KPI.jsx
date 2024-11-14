import {
  BatteryChargingFull,
  BarChart,
  TrendingUp,
  Warning,
  ArrowUpward,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import "./kpi.css";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2%;
`;

const KPI = ({ data }) => {
  const [kpiData, setKpiData] = useState({
    actpow: 0,
    total: 0,
    efficiency: 0,
    pendingAlerts: 18,
    monthlyConsumption: 0,
    todayConsumption: 0,
    energyCost: 0,
  });

  console.log("KPI data", data);

  useEffect(() => {
    if (data && data["results"] && data["today"]) {
      const topResult = data["results"][0];
      const today = data["today"];
      const resampled = data["resampled data"];

      // Calculate total consumption from resampled data
      const totalConsumption =
        (today.EBS10Reading_kwh || 0) +
        (today.DG1S12Reading_kwh || 0) +
        (today.DG2S3Reading_kwh || 0);

      // Calculate today's consumption from today data
      const todayConsumption =
        (today.EBS10Reading_kw || 0) +
        (today.DG1S12Reading_kw || 0) +
        (today.DG2S3Reading_kw || 0);

      // Calculate monthly energy consumption from resampled data
      const monthlyConsumption = resampled.reduce((total, item) => {
        return total + (item.EBS10Reading_kw || 0);
      }, 0);

      // Calculate energy cost (example: assume $0.10 per kWh)
      const energyCost = (monthlyConsumption * 0.1).toFixed(2);

      const efficiency = 78; // Example efficiency calculation
      const pendingAlerts = 18; // Assuming alerts are part of recent data

      setKpiData({
        actpow: todayConsumption,
        total: totalConsumption / 1000, // Convert to MWh
        efficiency,
        pendingAlerts,
        monthlyConsumption, // Add monthly consumption to state
        todayConsumption, // Add today's consumption to state
        energyCost, // Add energy cost to state
      });
    }
  }, [data]);

  const iconStyle = { fontSize: "2rem" };

  return (
    <>
      <Container>
        {/* Monthly Energy Consumption Card */}
        <div className="kpi-cont">
          <div className="kpi-top">
            <div className="kpi-tit">Monthly Energy Consumption</div>
            <div style={{ display: "inline" }}>
              <span className="kpi-val">
                {" "}
                {kpiData.monthlyConsumption.toLocaleString()}{" "}
              </span>
              <span className="kpi-units"> kWh </span>
            </div>
          </div>
          <div className="kpi-bot">
            <span className="percentage-cont">
              <ArrowUpward sx={{ fontSize: "14px" }} />
              25%
            </span>
            <span className="percentage-span">More than last month</span>
          </div>
        </div>

        {/* Today's Energy Consumption Card */}
        <div className="kpi-cont">
          <div className="kpi-top">
            <div className="kpi-tit">Today's Energy Consumption</div>
            <div style={{ display: "inline" }}>
              <span className="kpi-val">
                {" "}
                {kpiData.todayConsumption.toLocaleString()}{" "}
              </span>
              <span className="kpi-units"> kWh </span>
            </div>
          </div>
          <div className="kpi-bot">
            <span className="percentage-cont">
              <ArrowUpward sx={{ fontSize: "14px" }} />
              15%
            </span>
            <span className="percentage-span">More than yesterday</span>
          </div>
        </div>

        {/* Energy Cost Card */}
        {/* <div className="kpi-cont">
          <div className="kpi-top">
            <div className="kpi-tit">Monthly Energy Cost</div>
            <div style={{ display: "inline" }}>
              <span className="kpi-val"> ₹{kpiData.energyCost} </span>
              <span className="kpi-units"> INR </span>
            </div>
          </div>
          <div className="kpi-bot">
            <span className="percentage-cont">
              <ArrowUpward sx={{ fontSize: "14px" }} />
              20%
            </span>
            <span className="percentage-span">More than last month</span>
          </div>
        </div> */}
      </Container>
    </>
  );
};

export default KPI;
