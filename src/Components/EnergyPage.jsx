import React, { useEffect, useState } from "react";
import EnergyMeter from "./Energy"; // Import your updated EnergyMeter component
import TimeDrop from "./Timedrop"; // Import the TimeDrop component
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import "./EnergyComp.css"; // Import the CSS file
import { BorderColorOutlined } from "@mui/icons-material";

const EnergyComp = ({
  data,
  dateRange,
  setDateRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  timeperiod,
  setTimeperiod,
}) => {
  const [selectedSource, setSelectedSource] = useState("EB");
  const [totalEnergyUsed, setTotalEnergyUsed] = useState(0);
  const [totalCostSaved, setTotalCostSaved] = useState(0);
  const [percentageChange, setPercentageChange] = useState(-12.5); // Example value for demonstration
  const [curVal, setCurVal] = useState(0); // Example value for demonstration
  const [open, setOpen] = useState(false);
  const [unitPrice, setUnitPrice] = useState(10); // Default unit price
  const [inputUnitPrice, setInputUnitPrice] = useState(unitPrice);

  useEffect(() => {
    if (
      data &&
      data["recent data"] &&
      data["today"] &&
      data["resampled data"]
    ) {
      const today = data["today"];
      const resample = data["resampled data"];

      let totalEnergy = 0;
      let currentValue = 0;

      if (selectedSource === "All") {
        // Calculate total for all sources
        totalEnergy = resample.reduce(
          (sum, entry) =>
            sum +
            (entry.DG1S12Reading_kw || 0) +
            (entry.DG2S3Reading_kw || 0) +
            (entry.EBS10Reading_kw || 0),
          0
        );
        currentValue =
          (today.DG1S12Reading_kw || 0) +
          (today.DG2S3Reading_kw || 0) +
          (today.EBS10Reading_kw || 0);
      } else if (selectedSource === "DG1") {
        totalEnergy = resample.reduce(
          (sum, entry) => sum + (entry.DG1S12Reading_kw || 0),
          0
        );
        currentValue = today.DG1S12Reading_kw || 0;
      } else if (selectedSource === "DG2") {
        totalEnergy = resample.reduce(
          (sum, entry) => sum + (entry.DG2S3Reading_kw || 0),
          0
        );
        currentValue = today.DG2S3Reading_kw || 0;
      } else if (selectedSource === "EB") {
        totalEnergy = resample.reduce(
          (sum, entry) => sum + (entry.EBS10Reading_kw || 0),
          0
        );
        currentValue = today.EBS10Reading_kw || 0;
      }

      const costSaved = totalEnergy * unitPrice; // Calculate cost in ₹

      setCurVal(currentValue);
      setTotalEnergyUsed(totalEnergy);
      setTotalCostSaved(costSaved);
    }
  }, [selectedSource, data, unitPrice]);

  const handleSourceChange = (event) => {
    setSelectedSource(event.target.value);
  };

  const handleClickOpen = () => {
    setInputUnitPrice(unitPrice);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    setUnitPrice(inputUnitPrice);
    setOpen(false);
  };

  return (
    <div className="container">
      {/* <div className="top">
        <div className="title">Check Energy Consumption</div>
        <div className="menubar" style={{width: '50vw'}}>
          <TimeDrop
            dateRange={dateRange}
            setStartDate={setStartDate}
            setDateRange={setDateRange}
            setEndDate={setEndDate}
            setTimeperiod={setTimeperiod}
          />
        </div>
      </div>

      <div className="header">
        <RadioGroup
          value={selectedSource}
          onChange={handleSourceChange}
          aria-label="energy source"
          sx={{ display: "flex", gap: "16px", flexDirection: "row" }}
        >
          <FormControlLabel
            className="styled-form-control-label"
            value="All"
            control={<Radio />}
            label="All"
          />
          <FormControlLabel
            className="styled-form-control-label"
            value="EB"
            control={<Radio />}
            label="EB Power"
          />
          <FormControlLabel
            className="styled-form-control-label"
            value="DG1"
            control={<Radio />}
            label="DG Source 1"
          />
          <FormControlLabel
            className="styled-form-control-label"
            value="DG2"
            control={<Radio />}
            label="DG Source 2"
          />
        </RadioGroup>
      </div>

      <div className="meter-section">
        <EnergyMeter value={curVal} />
        <div className="subtitle">From 12am till now</div>
        <p className="energy-value">{curVal.toLocaleString()} kWh</p>
      </div>
      <div className="stat-section">
        <div className="stat-box">
          <h3 className="stat-title">Energy Consumption</h3>
          <p className="cost-value">{totalEnergyUsed.toLocaleString()} kWh</p>
        </div>
        <div className="stat-box">
          <div className="stat-title">
            <div>Cost</div>
            <div className="edit-button">
              <p className="costenergy"> 1 Unit - {inputUnitPrice} Rs</p>

              <IconButton
                size="small"
                onClick={handleClickOpen}
                sx={{
                  position: "relative",
                  verticalAlign: "top",

                  fontSize: "2rem",
                }}
              >
                <BorderColorOutlined
                  size="small"
                  sx={{
                    fontSize: "1rem",
                  }}
                />
              </IconButton>
            </div>
          </div>
          <p className="cost-value">₹{totalCostSaved.toLocaleString()}</p>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Unit Price</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="1 Unit Price (₹)"
                type="number"
                fullWidth
                value={inputUnitPrice}
                onChange={(e) => setInputUnitPrice(Number(e.target.value))}
              />
            </DialogContent>
            <DialogActions>
              <Button
                className="button"
                sx={{
                  background: "#ffffff",
                  color: "#1B2533",
                  border: "1px solid #C1C7D1",
                }}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                className="button"
                onClick={handleSave}
                sx={{ background: "#6036D4", color: "#ffffff" }}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div> */}
    </div>
  );
};

export default EnergyComp;
