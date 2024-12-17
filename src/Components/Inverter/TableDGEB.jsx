import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";
import styled from "styled-components";
import FilterListIcon from "@mui/icons-material/FilterList";
import ToggleButtons from "../Togglesampling";
//import DateRangeSelector from "./Daterangeselector";
import TimeBar from "../TRFF/TimePeriod";
import ExportToExcelButton from "../export2excel";

// Styled components for table design
const StyledTableContainer = styled(TableContainer)`
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled(Table)`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
`;

const StyledTableCell = styled(TableCell)`
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #445164;
  padding: 16px 24px;
  background-color: #fff;
  position: relative;
  border-right: none;
  border-left: none;
  width: 150px;

  &:before {
    content: "";
    position: absolute;
    top: 10%;
    bottom: 10%;
    left: 0;
    width: 2px;
    background-color: #e0e0e0;
  }

  &:first-child {
    &:before {
      display: none;
    }
  }

  &:last-child {
    border-right: none;
  }
`;

const StyledTableHeader = styled(TableCell)`
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: #445164;
  background-color: #d6dae1;
  text-transform: capitalize;
  white-space: nowrap;
  border-right: 1px solid #e0e0e0;
  padding: 16px 24px;
  border-bottom: 0px solid #ffffff;
  width: 150px;

  &:first-child {
    border-top-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
    border-right: none;
  }
`;

const StyledTableSortLabel = styled(TableSortLabel)`
  &.MuiTableSortLabel-root {
    color: #444;
  }
  &.MuiTableSortLabel-active {
    color: #007bff;
  }
  & .MuiTableSortLabel-icon {
    opacity: 0.5;
  }
`;

const StyledTableRow = styled(TableRow)`
  background-color: #fff;
  &:hover {
    background-color: #f9f9f9;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const PageButton = styled.button`
  font-family: "DM Sans";
  width: 8vw;
  font-size: 0.875rem;
  margin: 0 8px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.active ? "#007bff" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#1B2533")};
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${(props) => (props.active ? "#0056b3" : "#f0f0f0")};
  }
  &:disabled {
    color: #ccc;
    background-color: #f9f9f9;
    cursor: not-allowed;
  }
`;

const PageNumber = styled.button`
  font-family: "DM Sans";
  width: 2vw;
  font-size: 0.875rem;
  margin: 0 8px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.active ? "#445164" : "transparent")};
  color: ${(props) => (props.active ? "#fff" : "#1B2533")};
  opacity: ${(props) => (props.active ? "0.75" : "0.75")};
  cursor: pointer;
  box-shadow: ${(props) =>
    props.active
      ? "0 2px 4px rgba(0, 0, 0, 0.1);"
      : "0 2px 4px rgba(0, 0, 0, 0);"};

  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${(props) => (props.active ? "#445164" : "#f0f0f0")};
  }
  &:disabled {
    color: #ccc;
    background-color: #f9f9f9;
    cursor: not-allowed;
  }
`;

const PageIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  color: #444;
  margin-left: auto;
  margin-right: auto;
`;

const FilterDropdown = styled.div`
  position: relative;
  display: inline-block;
  width: 10vw;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  color: #444;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 10vw;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
  z-index: 1;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const CheckboxLabel = styled.label`
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  margin-left: 8px;
  color: #444;
`;

const roundToTwo = (num) => {
  if (typeof num === "number") {
    return num.toFixed(2);
  }
  return num;
};

const transformData = (tablesData) => {
  return tablesData.map((row) => {
    const transformedRow = {};

    // Map the column names to their new names and exclude `_kwh` and `id` columns
    Object.entries(row).forEach(([key, value]) => {
      if (!key.includes("_kwh") && key !== "id") {
        switch (key) {
          case "APFCS11Reading_kw":
            transformedRow["APFC(Kwh)"] = value;
            break;
          case "DG1S12Reading_kw":
            transformedRow["DG1(Kwh)"] = value;
            break;
          case "DG2S3Reading_kw":
            transformedRow["DG2(Kwh)"] = value;
            break;
          case "EBS10Reading_kw":
            transformedRow["EB(Kwh)"] = value;
            break;
          case "Utility1st2ndFS2Reading_kw_eb":
            transformedRow["Utility EB(Wh)"] = value;
            break;
          case "ThirdFloorZohoS4Reading_kw_eb":
            transformedRow["Zoho EB(Wh)"] = value;
            break;
          case "Skyd1Reading_kw_eb":
            transformedRow["Skyde EB(Wh)"] = value;
            break;
          case "ThirdFifthFloorKotakReading_kw_eb":
            transformedRow["Kotak EB(Wh)"] = value;
            break;
          case "SpareStation3Reading_kw_eb":
            transformedRow["Spare-3 EB(Wh)"] = value;
            break;
          case "SpareS6Reading_kw_eb":
            transformedRow["Spare-6 EB(Wh)"] = value;
            break;
          case "SpareS7Reading_kw_eb":
            transformedRow["Spare-7 EB(Wh)"] = value;
            break;
          case "SixthFloorS5Reading_kw_eb":
            transformedRow["Sixth Floor EB(Wh)"] = value;
            break;
          case "SolarS13Reading_kw":
            transformedRow["Solar(Kwh)"] = value;
            break;
          default:
            transformedRow[key] = value;
            break;
        }
      }
    });

    return transformedRow;
  });
};

const DataTable = ({
  tablesData,
  orderBy,
  order,
  handleRequestSort,
  sortedData,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  selectedEndpoint,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  timeperiod,
  setTimeperiod,
  dateRange,
  setDateRange,
}) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("timestamp");
  const [page, setPage] = useState(0);

  const [showFilter, setShowFilter] = useState(false);
  console.log("tab data", tablesData);

  const transformedData = transformData(tablesData);
  const [visibleColumns, setVisibleColumns] = useState(
    transformedData[0]
      ? Object.keys(transformedData[0]).reduce((acc, column) => {
          acc[column] = true; // Set all columns to visible initially
          return acc;
        }, {})
      : {}
  );

  const handleSortRequest = (column) => {
    const isAsc = sortColumn === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(column);
    handleRequestSort(column, isAsc ? "desc" : "asc");
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleColumnVisibilityChange = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const filteredRows = transformedData.map((row) => {
    const roundedRow = {};
    Object.entries(row).forEach(([key, value]) => {
      if (visibleColumns[key]) {
        roundedRow[key] =
          key === "timestamp"
            ? new Date(value).toLocaleString()
            : roundToTwo(value);
      }
    });
    return roundedRow;
  });

  const sortedRows = filteredRows.slice().sort((a, b) => {
    if (b[sortColumn] < a[sortColumn]) {
      return sortOrder === "asc" ? 1 : -1;
    }
    if (b[sortColumn] > a[sortColumn]) {
      return sortOrder === "asc" ? -1 : 1;
    }
    return 0;
  });

  if (!tablesData || tablesData.length === 0) {
    return <div>No data available</div>;
  }

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);

  const renderPageNumbers = () => {
    const pageButtons = [];
    const maxButtons = 3;

    if (totalPages <= maxButtons * 2 + 1) {
      for (let i = 0; i < totalPages; i++) {
        pageButtons.push(
          <PageNumber key={i} active={page === i} onClick={() => setPage(i)}>
            {i + 1}
          </PageNumber>
        );
      }
    } else {
      let start = Math.max(0, page - maxButtons);
      let end = Math.min(totalPages, page + maxButtons + 1);

      if (start > 0) {
        pageButtons.push(
          <PageNumber key="start" onClick={() => setPage(0)}>
            1
          </PageNumber>
        );
        if (start > 1) {
          pageButtons.push(<span key="start-ellipsis">...</span>);
        }
      }

      for (let i = start; i < end; i++) {
        pageButtons.push(
          <PageNumber key={i} active={page === i} onClick={() => setPage(i)}>
            {i + 1}
          </PageNumber>
        );
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pageButtons.push(<span key="end-ellipsis">...</span>);
        }
        pageButtons.push(
          <PageNumber
            key="end"
            active={page === totalPages - 1}
            onClick={() => setPage(totalPages - 1)}
          >
            {totalPages}
          </PageNumber>
        );
      }
    }

    return pageButtons;
  };

  return (
    <>
      <div className="stacked-bar-container">
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="row">
              <div className="title">Energy Consumption by Source</div>
              <div className="controls">
                <TimeBar
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  setTimeperiod={setTimeperiod}
                  startDate={startDate}
                  endDate={endDate}
                />
                {/* <DateRangeSelector
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                /> */}
                <FilterDropdown>
                  <FilterButton onClick={toggleFilter}>
                    <FilterListIcon />
                    <span>Filter Columns</span>
                  </FilterButton>
                  <DropdownContent show={showFilter}>
                    {Object.keys(transformedData[0]).map((column) => (
                      <CheckboxContainer key={column}>
                        <input
                          type="checkbox"
                          checked={visibleColumns[column]}
                          onChange={() => handleColumnVisibilityChange(column)}
                        />
                        <CheckboxLabel>{column}</CheckboxLabel>
                      </CheckboxContainer>
                    ))}
                  </DropdownContent>
                </FilterDropdown>
              </div>
            </div>
            <div className="row">
              <ToggleButtons
                dateRange={dateRange}
                timeperiod={timeperiod}
                setTimeperiod={setTimeperiod}
              />
            </div>

            <StyledTableContainer component={Paper}>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    {Object.keys(transformedData[0]).map((header) => (
                      <StyledTableHeader key={header}>
                        <StyledTableSortLabel
                          active={sortColumn === header}
                          direction={sortOrder}
                          onClick={() => handleSortRequest(header)}
                        >
                          {header}
                        </StyledTableSortLabel>
                      </StyledTableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, rowIndex) => (
                      <StyledTableRow key={rowIndex}>
                        {Object.keys(row).map((column) => (
                          <StyledTableCell key={column}>
                            {row[column]}
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    ))}
                </TableBody>
              </StyledTable>
            </StyledTableContainer>

            <PaginationContainer>
              <PageButton
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
              >
                ← Previous
              </PageButton>
              <PageIndicator>{renderPageNumbers()}</PageIndicator>
              <PageButton
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
              >
                Next →
              </PageButton>
            </PaginationContainer>
          </div>
          <div className="d-flex justify-content-end mb-4">
            <ExportToExcelButton
              data={sortedRows}
              filename="M2report.xlsx"
              startDatetime={startDate}
              endDatetime={endDate}
              source="Overall report"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DataTable;
