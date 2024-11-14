import React from 'react'
import styled from "styled-components";
import { Button, ButtonGroup, Icon } from "@mui/material";
import {
  CalendarMonth,
  CloudDownload,
  
} from "@mui/icons-material";



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
const DashHeader = ({title}) => {
  return (
    <DashboardHeader>
        <DashboardTitle>{title}</DashboardTitle>
        <FilterButtons>
          <StyledButtons>Day</StyledButtons>
          <StyledButtons>Week</StyledButtons>
          <StyledButtons>Month</StyledButtons>
          <StyledButtons>Year</StyledButtons>
        </FilterButtons>
        <Button variant="text" startIcon={<CalendarMonth />}>
          Select Range
        </Button>
        <Button variant="contained" startIcon={<CloudDownload />}>
          Generate Report
        </Button>
      </DashboardHeader>
  )
}

export default DashHeader