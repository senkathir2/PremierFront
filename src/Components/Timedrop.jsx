import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { styled } from "@mui/system";
import dayjs from "dayjs";

// Styled components using Material-UI's styled API
const StyledFormControl = styled(FormControl)({
  "& .MuiInputLabel-root": {
    color: "#808080",
    fontFamily: "DM Sans",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "16px",
  },
  "& .MuiSelect-root": {
    color: "#808080",
    fontFamily: "DM Sans",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "16px",
    border: "1px solid #EAECF0",
    borderRadius: "8px",
    height: "6vh",
    "&:focus": {
      backgroundColor: "#EAECF0",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#EAECF0",
  },
  "& .MuiSelect-icon": {
    color: "#808080",
  },
  "& .MuiMenuItem-root": {
    fontFamily: "DM Sans",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "16px",
    color: "#808080",
  },
});

const TimeDrop = ({
  dateRange,
  setStartDate,
  setDateRange,
  setEndDate,
  setTimeperiod,
}) => {
  const updateDateRange = (range) => {
    setDateRange(range);
    const today = dayjs();

    // Default timeperiod mapping based on dateRange
    let defaultTimePeriod = "H"; // Default to Hour

    switch (range) {
      case "today":
        setStartDate(today.startOf("day"));
        setEndDate(today);
        defaultTimePeriod = "H"; // Set default to Hour for today
        break;
      case "lastWeek":
        setStartDate(today.subtract(7, "day").startOf("day"));
        setEndDate(today);
        defaultTimePeriod = "D"; // Set default to Day for last week
        break;
      case "lastMonth":
        setStartDate(today.subtract(1, "month").startOf("day"));
        setEndDate(today);
        defaultTimePeriod = "D"; // Set default to Day for last month
        break;
      case "lastYear":
        setStartDate(today.subtract(1, "year").startOf("day"));
        setEndDate(today);
        defaultTimePeriod = "W"; // Set default to Week for last year
        break;
      default:
        setStartDate(today.startOf("day"));
        setEndDate(today);
        defaultTimePeriod = "D"; // Default to Day for other cases
        break;
    }

    // Set the default time period based on the selected date range
    setTimeperiod(defaultTimePeriod);
  };

  return (
    <StyledFormControl variant="outlined" size="small">
      <Select
        labelId="date-range-label"
        id="date-range-select"
        value={dateRange}
        onChange={(e) => {
          const newRange = e.target.value;
          updateDateRange(newRange);
        }}
        displayEmpty
      >
        <MenuItem value="today">Day</MenuItem>
        <MenuItem value="lastWeek">Week</MenuItem>
        <MenuItem value="lastMonth">Month</MenuItem>
        <MenuItem value="lastYear">Year</MenuItem>
      </Select>
    </StyledFormControl>
  );
};

export default TimeDrop;
