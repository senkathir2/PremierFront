import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/system";
import dayjs from "dayjs";
import { Height } from "@mui/icons-material";

// Styled components using Material-UI's styled API
const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  borderRadius: "8px", // Rounded corners
  overflow: "hidden", // Prevents borders from bleeding
  border: "1px solid #EAECF0", // Custom border color
  width: "20vw",

  "& .MuiToggleButton-root": {
    color: "#808080", // Custom text color
    fontFamily: "DM Sans", // Custom font family
    fontSize: "12px", // Custom font size
    fontStyle: "normal", // Normal font style
    fontWeight: 400, // Custom font weight
    lineHeight: "16px", // Custom line height
    width: "10vw",

    textTransform: "none", // Prevents text from being capitalized
    "&.Mui-selected": {
      backgroundColor: "#EAECF0", // Custom selected background color
      color: "#242F3E", // Custom selected text color
      "&:hover": {
        backgroundColor: "#D8DCE1", // Custom hover background color
      },
    },
    "&:not(:last-child)": {
      borderRight: "1px solid #EAECF0", // Custom border for non-last-child
    },
  },
});

const TimeBar = ({
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
    <StyledToggleButtonGroup
      value={dateRange}
      exclusive
      onChange={(e, newRange) => {
        if (newRange !== null) {
          updateDateRange(newRange);
        }
      }}
      aria-label="Date Range"
      size="small"
    >
      <ToggleButton value="today" aria-label="Today">
        Day
      </ToggleButton>
      <ToggleButton value="lastWeek" aria-label="Last Week">
        Week
      </ToggleButton>
      <ToggleButton value="lastMonth" aria-label="Last Month">
        Month
      </ToggleButton>
      <ToggleButton value="lastYear" aria-label="Last Year">
        Year
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
};

export default TimeBar;
