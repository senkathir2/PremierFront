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
  height: 22vh;
  width: 20vw;
  padding: 3vh;
  box-shadow: 7px 2px 17px 0px #c7c7c71a, 29px 10px 31px 0px #c7c7c717,
    66px 22px 42px 0px #c7c7c70d;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h6`
  color: #697483;
  text-align: center;
  font-feature-settings: "liga" off, "clig" off;
  /* Paragraph/text-sm/[R] */
  font-family: "DM Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
`;
const GaugeCont = styled.div`
  margin-left: auto;
  margin-right: auto;
`;
const Frequency = styled.div`
  align-self: stretch;
  color: var(--Gray---Typography-800, #1b2533);
  text-align: center;
  font-feature-settings: "liga" off, "clig" off;
  font-family: "DM Sans";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px; /* 160% */
`;

const FrequencyComponent = ({ apikey }) => {
  const [frequency, setFrequency] = useState(32); // Initial dummy data
  const [powerQuality, setPowerQuality] = useState("Loading...");

  const fetchFrequency = async () => {
    try {
      if(sidbarInfo.apiUrls[apikey]){
        const response = await axios.get(sidbarInfo.apiUrls[apikey].apiUrl);
        const frquencyValue = response.data["recent data"].frequency;
        setFrequency(frquencyValue);
      }
    } catch (error) {
      console.error("Error fetching power factor data:", error);
    }
  };

  useEffect(() => {
    if(sidbarInfo.apiUrls[apikey]){
      fetchFrequency();
    }
    const interval = setInterval(fetchFrequency, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [apikey]);

  return (
    <Card className="kpi-cont" style={{ width: "11vw" }}>
      <Top>
        <Title>Frequency</Title>
      </Top>
      <Frequency>{frequency} Hz</Frequency>
    </Card>
  );
};

export default FrequencyComponent;
