import React, { useEffect, useState } from "react";
import TopBar from "../Components/TopBar";
import BottomTimeSeries from "../Components/Inverter/TimeseriesDash";
import DashHeader from "../Components/DashHeader";
import Sidebar from "../Components/Sidebar";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import RealTimeChart from "../Components/Inverter/Composite";
import RealTimeCurrentChart from "../Components/Inverter/CurrentChart"
import RealTimeVoltageChart from "../Components/Inverter/VoltageChart"
import TidyTree from "../Components/TidyTree";

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

const Inverter = () => {
  const [key, setKey] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();


  const handleItemIdChange = (itemId) => {
    //setKey(itemId);
    console.log(itemId);
  };

  useEffect(() => {
    setKey(searchParams.get("key"))
  },[searchParams])

  return (
    <Container>
      <SidebarComp>
        <Sidebar handleItemId={handleItemIdChange} />
      </SidebarComp>
      <OutLetContainer>
        <DashHeader apikey={key} />
        <div className="emstit">
          <span className="emstitle">Real - Time Generation</span>
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
        <div style={{ width: "80vw" }}>
          <BottomTimeSeries apikey={key} />
          <TidyTree />
        </div>
      </OutLetContainer>
    </Container>
  );
};

export default Inverter;
