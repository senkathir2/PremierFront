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
import ReportModal from "./Reports";
import "./emstemp.css"

const DashboardHeader = styled.div`
  display: flex;
  margin-bottom: 1vw;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
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

const KPIContainer = styled.div`
  display: flex;
  gap: 2vw;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [data, setData] = useState(null);

  const transformData = (tablesData) => {
    return tablesData.map((row) => {
      const transformedRow = {};
      Object.entries(row).forEach(([key, value]) => {
        if (!key.includes("_kwh") && key !== "id") {
          switch (key) {
            case "APFCS11Reading_kw":
              transformedRow["APFC(Kwh)"] = value;
              break;
            case "DG1S12Reading_kw":
              transformedRow["DG1(Kwh)"] = value;
              break;
            case "DG2S3Reading_kw":
              transformedRow["DG2(Kwh)"] = value;
              break;
            case "EBS10Reading_kw":
              transformedRow["EB(Kwh)"] = value;
              break;
            case "Utility1st2ndFS2Reading_kw_eb":
              transformedRow["Utility EB(Wh)"] = value;
              break;
            case "ThirdFloorZohoS4Reading_kw_eb":
              transformedRow["Zoho EB(Wh)"] = value;
              break;
            case "Skyd1Reading_kw_eb":
              transformedRow["Skyde EB(Wh)"] = value;
              break;
            case "ThirdFifthFloorKotakReading_kw_eb":
              transformedRow["Kotak EB(Wh)"] = value;
              break;
            case "SpareStation3Reading_kw_eb":
              transformedRow["Spare-3 EB(Wh)"] = value;
              break;
            case "SpareS6Reading_kw_eb":
              transformedRow["Spare-6 EB(Wh)"] = value;
              break;

            case "SpareS7Reading_kw_eb":
              transformedRow["Spare-7 EB(Wh)"] = value;
              break;
            case "SixthFloorS5Reading_kw_eb":
              transformedRow["Sixth Floor EB(Wh)"] = value;
              break;
            case "SolarS13Reading_kw":
              transformedRow["Solar(Kwh)"] = value;
              break;
            default:
              transformedRow[key] = value;
              break;
          }
        }
      });
      return transformedRow;
    });
  };

  const fetchData = async (start, end, period) => {
    try {
      const response = await fetch(
        `${
          sidbarInfo.apiUrls[apikey].apiUrl
        }?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`
      );
      const result = await response.json();
      setData(result);
      const transformedData = transformData(result["resampled data"]); // Fixed transformation
      setReportData(transformedData);
      console.log("datatimedash", result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleGenerateReportClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (formData) => {
    console.log("Report Data Submitted:", formData);
    // You can process or save the data here
  };

  useEffect(() => {
    if (startDate && endDate && sidbarInfo.apiUrls[apikey]) {
      fetchData(startDate, endDate, timeperiod);
    }
  }, [startDate, endDate, timeperiod, apikey]);

  return (
    <div style={{ marginBottom: '4vh' }}>
      <DashboardHeader>
        <DashboardTitle>{apikey?.toUpperCase()}</DashboardTitle>
        <TimeBar
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          dateRange={dateRange}
          setDateRange={setDateRange}
          setTimeperiod={setTimeperiod} // Pass setTimeperiod to TimeBar
          startDate={startDate} // Pass startDate
          endDate={endDate} // Pass endDate
        />
        <button onClick={handleGenerateReportClick} className="emsbutton">
          <i className="emsbuttonicon">
            <CloudDownload />
          </i>
          <span>Generate Report</span>
        </button>
      </DashboardHeader>
      <KPIContainer>
        <AMFgauge />
        <KPI data={data} />
        <div>
          <PowerFactorGauge apikey={apikey} />
          <FrequencyComponent apikey={apikey} />
        </div>
        <WeatherWidget />
      </KPIContainer>
      <ReportModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        timeperiod={timeperiod}
        setTimeperiod={setTimeperiod}
        dateRange={dateRange}
        setDateRange={setDateRange}
        data={reportData} // Pass the processed reportData directly
        filename="M2TotalReport.xlsx"
      />
    </div>
  );
};

export default DashHeader;
