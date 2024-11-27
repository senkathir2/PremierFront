import React, { useEffect, useState } from "react";
import AMFgauge from "../Components/AmfGauge";
import KPI from "../Components/KPI";
import PowerFactorGauge from "../Components/PowerFactor";
import FrequencyComponent from "../Components/Frequency";
import styled from "styled-components";
import RealTimeChart from "../Components/CompareScreenComp/Composite";
import RealTimeCurrentChart from "../Components/CompareScreenComp/CurrentChart";
import RealTimeVoltageChart from "../Components/CompareScreenComp/VoltageChart";
import dayjs from "dayjs";
import sidbarInfo from "../sidbarInfo";
import StackedBarDGEB from "../Components/CompareScreenComp/StackTest";
import CostChart from "../Components/CompareScreenComp/CostChart";
import VoltageHistorical from "../Components/CompareScreenComp/VoltageHist";
import CurrentHistorical from "../Components/CompareScreenComp/CurrentHist";
import PowerfactorAndFreqHistorical from "../Components/CompareScreenComp/PowerFactorAndFreqHist";
import testData from "../testdata.json";
import { useSearchParams } from "react-router-dom";

const Seperator = styled.div`
  border-left: 3px solid gray;
`;
const KPIContainer = styled.div`
  display: flex;
  gap: 2vw;
  justify-content: center;
`;
const RealTimeChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3vh;
  margin-left: 1vw;
  margin-right: 1vw;
`;
const CompareContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3vh;
`;
const HistoricalDataContainer = styled.div`
  margin-left: 1vw;
  margin-right: 1vw;
`;
const TitleContainer = styled.div`
  /* margin-left: 23vw; */
  display: flex;
  /* gap: 50vw; */
  margin-left: 1vw;
  margin-right: 1vw;
`;

const Compare = ({ apikey, key }) => {
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [timeperiod, setTimeperiod] = useState("H");
  const [dateRange, setDateRange] = useState("today");
  const [firstFeederData, setFirstFeederData] = useState(testData);
  const [secondFeederData, setSecondFeederData] = useState(testData);
  const [searchParams, setSearchParams] = useSearchParams();
  const [firstFeeder, setFirstFeeder] = useState(searchParams.get("feeder_1"));
  const [secondFeeder, setSecondFeeder] = useState(searchParams.get("feeder_2"));

  // Function to fetch data
  const fetchData = async (start, end, period) => {
    try {
      const response = await fetch(
        `${
          sidbarInfo.apiUrls[apikey].apiUrl
        }?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`
      );
      const result = await response.json();
      setFirstFeederData(result);
      console.log("datatimedash", result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setFirstFeeder(searchParams.get("feeder_1"));
    setSecondFeeder(searchParams.get("feeder_2"));
  }, []);

  useEffect(() => {
    //setData(null);
    if (startDate && endDate && sidbarInfo.apiUrls[apikey]) {
      //fetchData(startDate, endDate, timeperiod);
    }
    setFirstFeederData(testData);
    setSecondFeederData(testData)
  }, [startDate, endDate, timeperiod, apikey]);

  const bgsource = ["#5630BC", "#8963EF", "#C4B1F7"];

  return (
    <CompareContainer>
      <TitleContainer>
        <div style={{margin:'auto'}}>{firstFeeder}</div>
        <div style={{margin:'auto'}}>{secondFeeder}</div>
      </TitleContainer>
      <KPIContainer>
        <AMFgauge />
        <KPI data={firstFeederData} />
        <div>
          <PowerFactorGauge apikey={apikey} />
          <FrequencyComponent apikey={apikey} />
        </div>
        <Seperator></Seperator>
        <AMFgauge />
        <KPI data={secondFeederData} />
        <div>
          <PowerFactorGauge apikey={apikey} />
          <FrequencyComponent apikey={apikey} />
        </div>
      </KPIContainer>
      <RealTimeChartContainer>
        <RealTimeChart firstFeederApiKey={firstFeeder} secondFeederApiKey={secondFeeder}/>
        <RealTimeCurrentChart firstFeederApiKey={firstFeeder} secondFeederApiKey={secondFeeder} />
        <RealTimeVoltageChart firstFeederApiKey={firstFeeder} secondFeederApiKey={secondFeeder} />
      </RealTimeChartContainer>
      <HistoricalDataContainer>
        <StackedBarDGEB
          data={firstFeederData}
          firstFeeder={firstFeeder}
          secondFeeder={secondFeeder}
          secondFeederData={secondFeederData}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          timeperiod={timeperiod}
          setTimeperiod={setTimeperiod}
          dateRange={dateRange}
          setDateRange={setDateRange}
          backgroundColors={bgsource}
        />
        <CostChart
          data={firstFeederData}
          firstFeeder={firstFeeder}
          secondFeeder={secondFeeder}
          secondFeederData={secondFeederData}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          timeperiod={timeperiod}
          setTimeperiod={setTimeperiod}
          dateRange={dateRange}
          setDateRange={setDateRange}
          backgroundColors={bgsource}
        />
        <VoltageHistorical
          data={firstFeederData}
          secondFeederData={secondFeederData}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          timeperiod={timeperiod}
          setTimeperiod={setTimeperiod}
          dateRange={dateRange}
          setDateRange={setDateRange}
          backgroundColors={bgsource}
        />
        <CurrentHistorical
          data={firstFeederData}
          secondFeederData={secondFeederData}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          timeperiod={timeperiod}
          setTimeperiod={setTimeperiod}
          dateRange={dateRange}
          setDateRange={setDateRange}
          backgroundColors={bgsource}
        />
        <PowerfactorAndFreqHistorical
          data={firstFeederData}
          secondFeederData={secondFeederData}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          timeperiod={timeperiod}
          setTimeperiod={setTimeperiod}
          dateRange={dateRange}
          setDateRange={setDateRange}
          backgroundColors={bgsource}
        />
      </HistoricalDataContainer>
    </CompareContainer>
  );
};

export default Compare;
