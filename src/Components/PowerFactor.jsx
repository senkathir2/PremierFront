import React, { useEffect, useState } from "react";
import axios from "axios";
import GaugeChart from "react-gauge-chart";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import { Launch } from "@mui/icons-material";
import "./PowerFactorGauge.css"; // Adjust the path as needed
import sidbarInfo from "../sidbarInfo";

// Styled Components for Consistent Card Design
const Container = styled.div`
  display: flex;
  gap: 2vw;
  margin-bottom: 2vh;
`;

const Card = styled.div`
  background: #ffffff;
  height: 32vh;
  width: 20vw;
  padding: 3vh;
  box-shadow: 7px 2px 17px 0px #c7c7c71a, 29px 10px 31px 0px #c7c7c717,
    66px 22px 42px 0px #c7c7c70d;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h6`
  font-weight: bold;
  color: #333;
  margin: 0;
`;
const GaugeCont = styled.div`
  margin-left: auto;
  margin-right: auto;
`;

const PowerFactorGauge = ({apikey}) => {
  const [powerFactor, setPowerFactor] = useState(95); // Initial dummy data
  const [powerQuality, setPowerQuality] = useState("Loading...");

  const fetchPowerFactor = async () => {
    try {
      const response = await axios.get(
        sidbarInfo.apiUrls[apikey].apiUrl
      );
      const powerFactorValue = Math.floor(response.data["recent data"].avg_power_factor*100);
      setPowerFactor(powerFactorValue);

      if (powerFactorValue >= 0.95) {
        setPowerQuality("Good");
      } else if (powerFactorValue >= 0.85) {
        setPowerQuality("Average");
      } else {
        setPowerQuality("Bad");
      }
    } catch (error) {
      console.error("Error fetching power factor data:", error);
    }
  };

  useEffect(() => {
    fetchPowerFactor();
    const interval = setInterval(fetchPowerFactor, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [apikey]);

  return (
    <>
      <div className="kpi-cont" style={{width: "10vw"}}>
        <Top>
          <Title>Power Factor</Title>
        </Top>

        <GaugeCont>
          <GaugeChart
            id="power-factor-gauge"
            nrOfLevels={20}
            colors={["#DF5353", "#DDDF0D", "#55BF3B"]} // Red, Yellow, Green
            arcWidth={0.3}
            percent={powerFactor}
            textColor="#333333"
            needleColor="gray"
            needleBaseColor="gray"
            formatTextValue={(value) => `${value.toFixed(2) / 100}`} // Display as percentage
            style={{ height: "", width: "150px" }} // Adjust as needed
          />
          <div className="figuretext">Power Quality: {powerQuality}</div>
        </GaugeCont>
      </div>
    </>
  );
};

export default PowerFactorGauge;
