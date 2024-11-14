import React from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/system";

// Custom styled components
const StyledRadioGroup = styled(RadioGroup)({
  display: "flex",
  gap: "16px", // Add space between radio buttons
  flexDirection: "row",
});

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  border: "1px solid #EAECF0",
  borderRadius: "8px", // Rounded corners
  margin: "0", // Remove margin between buttons
  padding: "1vh", // Padding for each button
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  backgroundColor: "#FFFFFF", // Default background color
  "& .MuiFormControlLabel-label": {
    fontFamily: "DM Sans",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "16px", // Line height as a string
    color: "#445164", // Custom text color
  },
  "& .MuiRadio-root": {
    padding: "0 8px", // Padding for radio icon
    color: "#445164", // Default color for unchecked
  },
  "& .MuiRadio-root.Mui-checked": {
    color: "#4E46B4", // Color when checked
  },
  "&:hover": {
    backgroundColor: "#F3F4F6", // Hover background
  },
}));

const ToggleButtons = ({ dateRange, timeperiod, setTimeperiod }) => {
  const handleChange = (event) => {
    setTimeperiod(event.target.value);
  };

  const renderRadioButtons = () => {
    switch (dateRange) {
      case "today":
        return (
          <StyledFormControlLabel value="H" control={<Radio />} label="Hour" />
        );
      case "lastWeek":
        return (
          <>
            <StyledFormControlLabel
              value="H"
              control={<Radio />}
              label="Hour"
            />
            <StyledFormControlLabel value="D" control={<Radio />} label="Day" />
          </>
        );
      case "lastMonth":
        return (
          <>
            <StyledFormControlLabel value="D" control={<Radio />} label="Day" />
            <StyledFormControlLabel
              value="W"
              control={<Radio />}
              label="Week"
            />
          </>
        );
      case "lastYear":
        return (
          <>
            <StyledFormControlLabel
              value="W"
              control={<Radio />}
              label="Week"
            />
            <StyledFormControlLabel
              value="M"
              control={<Radio />}
              label="Month"
            />
          </>
        );
      case "custom":
        return (
          <>
            <StyledFormControlLabel value="D" control={<Radio />} label="Day" />
            <StyledFormControlLabel
              value="W"
              control={<Radio />}
              label="Week"
            />
            <StyledFormControlLabel
              value="M"
              control={<Radio />}
              label="Month"
            />
          </>
        );
      default:
        return (
          <>
            <StyledFormControlLabel
              value="H"
              control={<Radio />}
              label="Hour"
            />
            <StyledFormControlLabel value="D" control={<Radio />} label="Day" />
            <StyledFormControlLabel
              value="W"
              control={<Radio />}
              label="Week"
            />
            <StyledFormControlLabel
              value="M"
              control={<Radio />}
              label="Month"
            />
            <StyledFormControlLabel
              value="Q"
              control={<Radio />}
              label="Quartile"
            />
            <StyledFormControlLabel
              value="Y"
              control={<Radio />}
              label="Year"
            />
          </>
        );
    }
  };

  return (
    <FormControl component="fieldset">
      <StyledRadioGroup
        value={timeperiod}
        onChange={handleChange}
        aria-label="Resampling Period"
      >
        {renderRadioButtons()}
      </StyledRadioGroup>
    </FormControl>
  );
};

export default ToggleButtons;
