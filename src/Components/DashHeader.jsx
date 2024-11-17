import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, ButtonGroup, Icon } from "@mui/material";
import { CalendarMonth, CloudDownload } from "@mui/icons-material";
import TimeBar from "./TRFF/TimePeriod";
import dayjs from "dayjs";
import sidbarInfo from "../sidbarInfo";
import PowerFactorGauge from "./PowerFactor";
import FrequencyComponent from "./Frequency";
import KPI from "./KPI";
import AMFgauge from "./AmfGauge";
import WeatherWidget from "./Weather";

const DashboardHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const DashboardTitle = styled.div`
  color: var(--Gray---Typography-800, #1b2533);
  font-feature-settings: "liga" off, "clig" off;

  /* UI Type/text-lg/[S] */
  font-family: "DM Sans";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 155.556% */
  display: flex;
  width: 50%;
  flex-direction: column;
  align-items: flex-start;
`;

const FilterButtons = styled.div`
  display: flex;
  align-items: flex-start;
  border-radius: 8px;
  border: 1px solid var(--Gray-100, #eaecf0);
  background: #fff;
`;

const StyledButtons = styled(Button)`
  border-right: 1px solid var(--Gray-100, #eaecf0);
  display: flex;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;
const DashHeader = ({ apikey }) => {
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [timeperiod, setTimeperiod] = useState("H");
  const [dateRange, setDateRange] = useState("today");
  const [data, setData] = useState(null);

  const fetchData = async (start, end, period) => {
    try {
      const response = await fetch(
        `${
          sidbarInfo.apiUrls[apikey].apiUrl
        }?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`
      );
      const result = await response.json();
      setData(result);
      console.log("datatimedash", result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate && sidbarInfo.apiUrls[apikey]) {
      fetchData(startDate, endDate, timeperiod);
    }
  }, [startDate, endDate, timeperiod, apikey]);

  return (
    <div>
      <DashboardHeader>
        <DashboardTitle>{apikey}</DashboardTitle>
        <TimeBar
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          dateRange={dateRange}
          setDateRange={setDateRange}
          setTimeperiod={setTimeperiod} // Pass setTimeperiod to TimeBar
          startDate={startDate} // Pass startDate
          endDate={endDate} // Pass endDate
        />
      </DashboardHeader>
      <div style={{ display: "flex", gap: "2%", maxHeight: "fit-content" }}>
        <AMFgauge />
        <KPI data={data}/>
        <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
          <PowerFactorGauge apikey={apikey} />
          <FrequencyComponent apikey={apikey} />
        </div>
        <WeatherWidget />
      </div>
    </div>
  );
};

export default DashHeader;
