import { Gauge, gaugeClasses } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { ArrowUpward, Launch } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import PowerFactorGauge from "./PowerFactor";
import { Link } from "react-router-dom";

// Styled components for layout and styling
const Container = styled.div`
  display: flex;
  justify-content:center;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GaugeCont = styled.div`
  margin-left: auto;
  margin-right: auto;
`;

const Card = styled.div`
  background: #ffffff;
  height: 32vh;
  width: 20vw;
  padding: 16px 0px 0px 0px;
  padding: 3vh;
  box-shadow: 7px 2px 17px 0px #c7c7c71a, 29px 10px 31px 0px #c7c7c717,
    66px 22px 42px 0px #c7c7c70d;
  text-align: center;
  position: relative;
`;

const Title = styled.div`
  font-weight: bold;
  color: #333;
`;

const AMFgauge = () => {
  const [ebUsage, setEbUsage] = useState(0);
  const [dgUsage, setDgUsage] = useState(0);
  const [ebTot, setEbtot] = useState(0);
  const [dgTot, setDgTot] = useState(0);

  const fetchData = async () => {
    try {
      const [ebResponse, dgResponse1, dgResponse2] = await Promise.all([
        axios.get("https://www.therion.co.in/api/ebs10reading/"),
        axios.get("https://www.therion.co.in/api/dg1s12reading/"),
        axios.get("https://www.therion.co.in/api/dg2s3reading/"),
      ]);

      const ebKwh = ebResponse.data["recent data"].kwh;
      const dg1Kwh = dgResponse1.data["recent data"].kwh;
      const dg2Kwh = dgResponse2.data["recent data"].kwh;

      const totalKwh = ebKwh + dg1Kwh + dg2Kwh;
      if (totalKwh > 0) {
        setEbUsage((ebKwh / totalKwh) * 100);
        setDgUsage(((dg1Kwh + dg2Kwh) / totalKwh) * 100);
        setDgTot(dg1Kwh + dg2Kwh);
        setEbtot(ebKwh);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      {/* EB Usage Card */}
      <div className="kpi-cont">
        <div className="kpi-top">
          <Top>
            <Title>Total EB Usage</Title>
            <IconButton
              aria-label="open-link"
              size="small"
              component={Link}
              to="/eb"
            >
              <Launch fontSize="inherit" />
            </IconButton>
          </Top>
          <GaugeCont>
            <Gauge
              width={95}
              height={95}
              startAngle={-130}
              endAngle={130}
              innerRadius="75%"
              outerRadius="110%"
              value={ebUsage}
              text={({ value }) => `${value.toFixed(2)} ${" %"}`}
              cornerRadius="50%"
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: "14px", // Adjust the font size here
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: "#2E7D32",
                },
              }}
            />
            <div className="figuretext">
              <span>{ebTot.toLocaleString()}</span>
              <span> kWh </span>
            </div>
          </GaugeCont>
        </div>
      </div>

      {/* DG Usage Card */}
      {/* <div className="kpi-cont">
        <div className="kpi-top">
          <Top>
            <Title>Total DG Usage</Title>
            <IconButton
              aria-label="open-link"
              size="small"
              component={Link}
              to="/dg1"
            >
              <Launch fontSize="inherit" />
            </IconButton>
          </Top>
          <GaugeCont>
            <Gauge
              width={95}
              height={95}
              startAngle={-130}
              endAngle={130}
              innerRadius="75%"
              outerRadius="110%"
              value={dgUsage}
              text={({ value }) => `${value.toFixed(2)} ${" %"}`}
              cornerRadius="50%"
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: "14px", // Adjust the font size here
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: "#ffd900",
                },
              }}
            />
            <div className="figuretext">
              <span>{dgTot.toLocaleString()}</span>
              <span> kWh </span>
            </div>
          </GaugeCont>
        </div>
      </div> */}
      {/* <PowerFactorGauge /> */}
    </Container>
  );
};

export default AMFgauge;
