import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import DashHeader from "../Components/DashHeader";
import AMFgauge from "../Components/AmfGauge";
import KPI from "../Components/KPI";
import PowerFactorGauge from "../Components/PowerFactor";
import WeatherWidget from "../Components/Weather";
import RealTimeCurrentChart from "../Components/CurrentChart";
import RealTimeVoltageChart from "../Components/VoltageChart";
import BottomTimeSeries from "../Components/TimeseriesDash";
import RealTimeChart from "../Components/Composite";
//import "../Components/emstemp.css"

const Container = styled.div`
  display: flex;
  background: #f4f5f6;
  width: 100%;
  padding: 3vh;
  gap: 10px;
  max-width: 96vw;
`;

const SidebarComp = styled.div`
  flex: 1;
`;

const OutLetContainer = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
  gap: 1%;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3vh;
`;

const TestPage = () => {
  const [key, setKey] = useState("");

  const handleItemIdChange = (itemId) => {
    setKey(itemId);
    console.log(itemId);
  };

  useEffect(() => {

  }, [key])


  return (
    <Container>
      <SidebarComp>
        <Sidebar handleItemId={handleItemIdChange} />
      </SidebarComp>
      <OutLetContainer>
        <DashHeader apikey={key}/>
        <div className="emstit">
          <span className="emstitle">Real - Time Consumption</span>
          <span className="emsspan">Status: Running EB power</span>
        </div>
        <ChartContainer
          className="realtimeflex"
          style={{ gap: "10px", display: "flex" }}
        >
          <RealTimeChart apiKey={key} />
          <RealTimeCurrentChart apiKey={key} />
          <RealTimeVoltageChart apiKey={key} />
        </ChartContainer>
        <div className="emstit">
          <span className="emstitle">Energy Consumption History</span>
          <span className="emsspan">
            Access and analyze historical energy consumption trends to identify
            patterns and areas for improvement.
          </span>
        </div>
        <div style={{ width: "70vw" }}>
          <BottomTimeSeries apikey={key} />
        </div>
        <Outlet />
      </OutLetContainer>
    </Container>
  );
};

export default TestPage;
