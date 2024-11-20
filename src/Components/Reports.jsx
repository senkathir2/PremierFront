import React, { useState } from "react";
import styled from "styled-components";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import TimeBar from "./TRFF/TimePeriod";
// import DateRangeSelector from "./Daterangeselector";
import ToggleButtons from "./Togglesampling";
import { exportToExcel } from "./exportToExcel"; // Import the utility function
import "./EnergyComp.css"; // Import the CSS file 

const ReportModal = ({
  open,
  onClose,
  onSubmit,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  timeperiod,
  setTimeperiod,
  dateRange,
  setDateRange,
  data, // Pass data for export
  filename, // Pass filename for export
  source,
}) => {
  const [dataType, setDataType] = useState("EB Power");
  const [format, setFormat] = useState("Excel");

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };

  const handleSubmit = () => {
    if (format === "Excel") {
      if (!data || data.length === 0) {
        console.warn("No data available for export.");
        return;
      }

      // Round all numerical values in data to two decimal places
      const roundedData = data.map((item) => {
        return Object.fromEntries(
          Object.entries(item).map(([key, value]) => [
            key,
            typeof value === "number" ? parseFloat(value.toFixed(2)) : value,
          ])
        );
      });

      // Trigger the Excel export function with rounded data
      exportToExcel({
        data: roundedData,
        filename: filename || `${source}.xlsx`,
        startDatetime: startDate,
        endDatetime: endDate,
        source: source,
      });
    } else {
      // Handle PDF or other formats
      onSubmit({ dataType, format });
    }
    onClose();
  };

  return (
    <Dialog
      sx={{ width: "60vw", marginLeft: "auto", marginRight: "auto" }}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Generate Report</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: "2vh" }}
      >
        <div>
          <FormLabel component="legend">Source Data Type</FormLabel>
          <TimeBar
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            setTimeperiod={setTimeperiod}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div>
          <FormLabel component="legend">Source Data Type</FormLabel>
          {/* <DateRangeSelector
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          /> */}
        </div>
        <div>
          <FormLabel component="legend">Source Data Type</FormLabel>
          <ToggleButtons
            dateRange={dateRange}
            timeperiod={timeperiod}
            setTimeperiod={setTimeperiod}
          />
        </div>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select Format</FormLabel>
          <RadioGroup
            value={format}
            onChange={handleFormatChange}
            sx={{ display: "flex", flexDirection: "row" }}
          >
            <FormControlLabel
              className="styled-form-control-label"
              value="PDF"
              control={<Radio />}
              label="PDF"
            />
            <FormControlLabel
              className="styled-form-control-label"
              value="Excel"
              control={<Radio />}
              label="Excel"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          className="button"
          sx={{
            background: "#ffffff",
            color: "#1B2533",
            border: "1px solid #C1C7D1",
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{ background: "#6036D4", color: "#ffffff" }}
          className="button"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportModal;
