import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main CSS file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import { Button, Modal, Box } from "@mui/material";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined"; // Import calendar icon

const DateRangeSelector = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (ranges) => {
    const { selection } = ranges;

    // Ensure startDate and endDate are valid Date objects and set time
    const start = new Date(selection.startDate);
    start.setHours(0, 0, 0, 0); // Set time to midnight

    const end = new Date(selection.endDate);
    end.setHours(23, 59, 59, 999); // Set time to end of the day

    setStartDate(start);
    setEndDate(end);
  };

  // Handle undefined startDate or endDate
  const today = new Date();
  const selectionRange = {
    startDate:
      startDate instanceof Date && !isNaN(startDate) ? startDate : today,
    endDate: endDate instanceof Date && !isNaN(endDate) ? endDate : today,
    key: "selection",
  };

  // Modal styles
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // Custom button styles
  const buttonStyles = {
    borderRadius: "8px", // Rounded corners
    border: "1px solid #EAECF0", // Light border
    color: "#445164", // Text color
    textAlign: "center",
    fontFamily: "DM Sans",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "16px", // Line height as a string
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px", // Space between icon and text
    backgroundColor: "#FFFFFF", // Background color
    "&:hover": {
      backgroundColor: "#F3F4F6", // Hover background
      borderColor: "#C4C4C4", // Hover border color
    },
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={buttonStyles} // Apply custom styles
      >
        <CalendarMonthOutlined fontSize="small" sx={{ color: "#D6DAE1" }} />{" "}
        {/* Calendar icon */}
        Select Range
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <DateRangePicker
            ranges={[selectionRange]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            showSelectionPreview={true}
            editableDateInputs={true}
            direction="horizontal"
            dateDisplayFormat="yyyy-MM-dd" // Adjust date format as needed
            maxDate={new Date()} // Disable future dates
            theme={{
              palette: {
                primary: {
                  main: "#5630BC", // Change this to your desired primary color
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", bottom: "2vh", left: "5vw" }}
          >
            Confirm
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default DateRangeSelector;
