import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  const handleChange = (event, value) => {
    setValue(value);
    navigate(value);
  };
  return (
    <div className="overview-tabs">
      <Tabs value={value} onChange={handleChange}>
        <Tab value={"/peppl_p1"} label={"overview"} />
        <Tab value={"/peppl_p1/amf1a"} label={"AMF-1A"} />
        <Tab value={"/peppl_p1/amf1b"} label={"AMF-1B"} />
        <Tab value={"/peppl_p1/PCC_Panel_1"} label={"pcc 1"} />
        <Tab value={"/peppl_p1/PCC_Panel_2"} label={"Pcc 2"} />
        <Tab value={"/peppl_p1/amf2a"} label={"AMF-2A"} />
        <Tab value={"/peppl_p1/amf2b"} label={"AMF-2B"} />
        <Tab value={"/peppl_p1/PCC_Panel_3"} label="PCC Panel 3" />
        <Tab value={"/peppl_p1/PCC_Panel_4"} label="PCC Panel 4" />
      </Tabs>
    </div>
  );
};

export default TopBar;
