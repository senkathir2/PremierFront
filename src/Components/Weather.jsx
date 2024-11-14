import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
//import Weatherbg from "../../Assets/weatherbg.png";
import DescriptionIcon from "@mui/icons-material/Description";

const WeatherWidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2vh;
  height: 100%;
  width: 100%;
`;

// const WeatherHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   background-color: #ffffff;
//   padding: 16px;
//   padding-top: 4vh;
//   padding-bottom: 4vh;
//   border-radius: var(--paddings-gaps-p-4, 16px);
//   background-image: url(${Weatherbg});
//   background-size: cover;
//   flex: 2;
// `;

const WeatherMain = styled.div`
  color: var(--Gray---Typography-800, #1b2533);
  font-feature-settings: "liga" off, "clig" off;

  /* UI Type/text-4xl/[R] */
  font-family: "DM Sans";
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: 48px; /* 120% */
  letter-spacing: -0.5px;
`;

const Name = styled.span`
  color: var(--Gray---Typography-800, #1b2533);
  font-feature-settings: "liga" off, "clig" off;

  /* UI Type/text-sm/[R] */
  font-family: "DM Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 171.429% */
`;

const Address = styled.div`
  color: var(--Gray---Typography-800, #1b2533);
  font-feature-settings: "liga" off, "clig" off;

  /* UI Type/text-2xs/[R] */
  font-family: "DM Sans";
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 160% */
`;

const AlertsContainer = styled.div`
  border-radius: 16px;
  background: #ffffff;
  display: flex;
  flex: 3;

  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  color: var(--Gray---Typography-500, #445164);
  font-feature-settings: "liga" off, "clig" off;

  /* Paragraph/text-md/[R] */
  font-family: "DM Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`;

const AlertItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const AlertIcon = styled(DescriptionIcon)`
  margin-right: 10px;
  color: #8f97a2;
  background-color: #f6f6f7;
  padding: 5px;
  border-radius: 16px;
  font-size: 400rem;
`;

const AlertText = styled.div`
  color: #000;
  font-feature-settings: "liga" off, "clig" off;

  /* Paragraph/text-sm/[R] */
  font-family: "DM Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
`;

const Date = styled.div`
  color: var(--Gray-500, #98a2b3);
  font-feature-settings: "liga" off, "clig" off;

  /* Paragraph/text-xs/[R] */
  font-family: "DM Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`;

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const apiKey = "66dc8817c3439e5c408f731143c36a35"; // Use your actual API key
  const lat = "17.639762355942285"; // Latitude for Chicago
  const lon = "78.3789324345932"; // Longitude for Chicago
  const exclude = "minutely,hourly"; // Customize as needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${apiKey}&units=metric&lang=en`;
        const response = await axios.get(url);
        setWeatherData(response.data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  if (!weatherData) {
    return null;
  }

  const { current } = weatherData;

  return (
    <WeatherWidgetContainer>
      {/* <WeatherHeader>
        <WeatherMain>{current.temp.toFixed(1)}°C</WeatherMain>
        <div>
          <Name>M square Tech</Name>
          <Address>23 July 2024</Address>
        </div>
      </WeatherHeader> */}

      <AlertsContainer>
        <div>Alerts</div>
        <AlertItem>
          <AlertIcon />
          <AlertText>
            <Date>July 15, 2024</Date>
            <div>A new Monthly report is ready to Download!</div>
          </AlertText>
        </AlertItem>
        <AlertItem>
          <AlertIcon />
          <AlertText>
            <Date>July 15, 2024</Date>
            <div>A new Monthly report is ready to Download!</div>
          </AlertText>
        </AlertItem>
        <AlertItem>
          <AlertIcon />
          <AlertText>
            <Date>July 15, 2024</Date>
            <div>A new Monthly report is ready to Download!</div>
          </AlertText>
        </AlertItem>
      </AlertsContainer>
    </WeatherWidgetContainer>
  );
};

export default WeatherWidget;
