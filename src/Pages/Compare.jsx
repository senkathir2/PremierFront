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
import axios from "axios";
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
  const [firstFeederData, setFirstFeederData] = useState();
  const [secondFeederData, setSecondFeederData] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [firstFeeder, setFirstFeeder] = useState(searchParams.get("feeder_1"));
  const [secondFeeder, setSecondFeeder] = useState(searchParams.get("feeder_2"));

  // Function to fetch data
  const fetchData = async (start, end, period) => {
    try {
      const [firstFeederResponse, secondFeederResponse] = await Promise.all([
        axios.get(`${sidbarInfo.apiUrls[firstFeeder].apiUrl}?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`),
        axios.get(`${sidbarInfo.apiUrls[secondFeeder].apiUrl}?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`),
      ]);
      setFirstFeederData(firstFeederResponse.data);
      setSecondFeederData(secondFeederResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate && sidbarInfo.apiUrls[firstFeeder] && sidbarInfo.apiUrls[secondFeeder]) {
      fetchData(startDate, endDate, timeperiod);
    }
  }, [startDate, endDate, timeperiod]);

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
          <PowerFactorGauge apikey={firstFeeder} />
          <FrequencyComponent apikey={firstFeeder} />
        </div>
        <Seperator></Seperator>
        <AMFgauge />
        <KPI data={secondFeederData} />
        <div>
          <PowerFactorGauge apikey={secondFeeder} />
          <FrequencyComponent apikey={secondFeeder} />
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
          firstFeeder={firstFeeder}
          secondFeeder={secondFeeder}
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
          firstFeeder={firstFeeder}
          secondFeeder={secondFeeder}
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
          firstFeeder={firstFeeder}
          secondFeeder={secondFeeder}
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
