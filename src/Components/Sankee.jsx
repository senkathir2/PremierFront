import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import TimeBar from "./TRFF/TimePeriod";
import ToggleButtons from "./Togglesampling";
//import DateRangeSelector from "./Daterangeselector";
import "./StackedBarDGEB.css";

const MySankeyChart = ({
  data,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  timeperiod,
  setTimeperiod,
  dateRange,
  setDateRange,
  backgroundColors = [],
}) => {
  const [plotData, setPlotData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const predefinedColors =
    backgroundColors.length > 0
      ? backgroundColors
      : [
          "rgba(237, 117, 163, 0.6)", // #ED75A3
          "rgba(1, 126, 243, 0.6)", // #017EF3
          "rgba(191, 114, 213, 0.6)", // #BF72D5
          "rgba(240, 151, 115, 0.6)", // #F09773
          "rgba(255, 197, 80, 0.6)", // #FFC550
          "rgba(67, 67, 67, 0.6)", // #434343
          "rgba(255, 77, 0, 0.6)", // #ff4d00
          "rgba(201, 203, 207, 0.6)", // #C9CBCF
        ];

  useEffect(() => {
    if (data && data["recent data"]) {
      try {
        const item = data["recent data"];
        const nodes = [
          "APFCS11Reading",
          "DG1S12Reading",
          "EBS10Reading",
          "DG2S3Reading",
          "SolarS13Reading",
          "Bus Bar",
          "Skyd1Reading",
          "Utility1st2ndFS2Reading",
          "SpareStation3Reading",
          "ThirdFloorZohoS4Reading",
          "SixthFloorS5Reading",
          "SpareS6Reading",
          "SpareS7Reading",
          "ThirdFifthFloorKotakReading",
        ];

        const links = [];

        const addLink = (source, target, value, colorIndex) => {
          links.push({
            source: nodes.indexOf(source),
            target: nodes.indexOf(target),
            value,
            color: predefinedColors[colorIndex % predefinedColors.length],
          });
        };

        // Add sources to the bus bar
        if (item.APFCS11Reading_kwh > 0) {
          addLink("APFCS11Reading", "Bus Bar", item.APFCS11Reading_kwh, 0);
        }
        if (item.DG1S12Reading_kwh > 0) {
          addLink("DG1S12Reading", "Bus Bar", item.DG1S12Reading_kwh, 1);
        }
        if (item.EBS10Reading_kwh > 0) {
          addLink("EBS10Reading", "Bus Bar", item.EBS10Reading_kwh, 2);
        }
        if (item.DG2S3Reading_kwh > 0) {
          addLink("DG2S3Reading", "Bus Bar", item.DG2S3Reading_kwh, 3);
        }
        if (item.SolarS13Reading_kwh > 0) {
          addLink("SolarS13Reading", "Bus Bar", item.SolarS13Reading_kwh, 4);
        }

        // Distribute from the bus bar to feeders
        if (item.Skyd1Reading_kwh_eb > 0) {
          addLink(
            "Bus Bar",
            "Skyd1Reading",
            item.Skyd1Reading_kwh_eb / 1000,
            5
          );
        }
        if (item.Utility1st2ndFS2Reading_kwh_eb > 0) {
          addLink(
            "Bus Bar",
            "Utility1st2ndFS2Reading",
            item.Utility1st2ndFS2Reading_kwh_eb / 1000,
            6
          );
        }
        if (item.SpareStation3Reading_kwh_eb > 0) {
          addLink(
            "Bus Bar",
            "SpareStation3Reading",
            item.SpareStation3Reading_kwh_eb / 1000,
            7
          );
        }
        if (item.ThirdFloorZohoS4Reading_kwh_eb > 0) {
          addLink(
            "Bus Bar",
            "ThirdFloorZohoS4Reading",
            item.ThirdFloorZohoS4Reading_kwh_eb / 1000,
            8
          );
        }
        if (item.SixthFloorS5Reading_kwh_eb > 0) {
          addLink(
            "Bus Bar",
            "SixthFloorS5Reading",
            item.SixthFloorS5Reading_kwh_eb / 1000,
            9
          );
        }
        if (item.SpareS6Reading_kwh_eb > 0) {
          addLink(
            "Bus Bar",
            "SpareS6Reading",
            item.SpareS6Reading_kwh_eb / 1000,
            10
          );
        }
        if (item.SpareS7Reading_kwh_eb > 0) {
          addLink(
            "Bus Bar",
            "SpareS7Reading",
            item.SpareS7Reading_kwh_eb / 1000,
            11
          );
        }
        if (item.ThirdFifthFloorKotakReading_kwh_eb > 0) {
          addLink(
            "Bus Bar",
            "ThirdFifthFloorKotakReading",
            item.ThirdFifthFloorKotakReading_kwh_eb / 1000,
            12
          );
        }

        setPlotData([
          {
            type: "sankey",
            orientation: "h",
            borderRadius: "8px",
            node: {
              pad: 20,
              thickness: 30,
              line: {
                color: "rgba(86, 48, 188, 0.8)",
                width: 1,
                borderRadius: "8px",
              },
              label: nodes,
              color: "rgba(86, 48, 188, 0.8)", // Duller node color
              hovertemplate:
                "Node: %{label}<br>Total Flow: %{value}<extra></extra>", // Detailed tooltip for nodes
              customdata: nodes.map(() => ({
                borderRadius: "10px", // Custom property for CSS
              })),
            },
            link: {
              source: links.map((link) => link.source),
              target: links.map((link) => link.target),
              value: links.map((link) => link.value),
              color: links.map((link) => link.color),
              hovertemplate:
                "Flow: %{value}<br>From: %{source.label} to %{target.label}<extra></extra>", // Detailed tooltip for links
              line: {
                color: "#ccc",
                width: 0.5,
                curvature: 0.5, // Added curvature for smooth links
              },
              opacity: 0.8, // Duller opacity for links
            },
          },
        ]);
      } catch (error) {
        console.error("Error processing data", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError("No recent data available");
    }
  }, [data]); // Make sure backgroundColors is static to avoid unnecessary re-renders

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="stacked-bar-container">
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row">
            <div className="title">Energy Flow Chart [kWh]</div>
            <div className="controls">
              <TimeBar
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                dateRange={dateRange}
                setDateRange={setDateRange}
                setTimeperiod={setTimeperiod} // Pass setTimeperiod to TimeBar
                startDate={startDate} // Pass startDate
                endDate={endDate} // Pass endDate
              />
              {/* <DateRangeSelector
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              /> */}
            </div>
          </div>
          <div className="row">
            <ToggleButtons
              dateRange={dateRange}
              timeperiod={timeperiod}
              setTimeperiod={setTimeperiod}
            />
          </div>

          <Plot
            data={plotData}
            layout={{
              title: {
                font: {
                  size: 24,
                  color: "#ffffff", // Title font color
                },
              },
              font: {
                size: 14,
                color: "#ffffff", // General font color
              },

              margin: { l: 10, r: 10, t: 40, b: 40 }, // Adjusted margins
            }}
            config={{
              displayModeBar: false, // Hides the toolbar
            }}
            style={{ width: "100%", height: "100%", borderRadius: "8px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default MySankeyChart;
