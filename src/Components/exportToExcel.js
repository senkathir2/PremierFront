import { Workbook } from "exceljs";
import dayjs from "dayjs"; // Ensure you have dayjs installed: npm install dayjs
import { saveAs } from "file-saver"; // Ensure you have file-saver installed: npm install file-saver

export const exportToExcel = async ({
  data,
  filename,
  startDatetime,
  endDatetime,
  source,
}) => {
  if (!data || data.length === 0) {
    console.warn("No data available for export.");
    return;
  }

  // Initialize the workbook and worksheet
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Report");

  // Convert the datetime to string format
  const formattedStartDatetime = dayjs(startDatetime).format(
    "DD/MM/YYYY HH:mm:ss"
  );
  const formattedEndDatetime = dayjs(endDatetime).format("DD/MM/YYYY HH:mm:ss");

  // Determine which columns have data (filter out empty columns and unwanted keys)
  const validColumns = Object.keys(data[0]).filter((key) =>
    data.some(
      (row) =>
        row[key] !== "" &&
        row[key] !== null &&
        key !== "timestamp" &&
        key !== "id" &&
        key !== "kwh" &&
        key !== "kvah" &&
        key !== "kwh_eb" &&
        key !== "kvah_eb" &&
        key !== "kwh_dg" &&
        key !== "kvah_dg"
    )
  );

  // Capitalize the first letter of each column name and replace underscores with spaces
  const capitalizedColumns = validColumns.map((column) =>
    column
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );

  // Add title and merge cells
  worksheet.mergeCells(1, 1, 1, validColumns.length + 1); // Merge across columns
  worksheet.getCell("A1").value = "M2 Tech Hub Report";
  worksheet.getCell("A1").alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  worksheet.getCell("A1").font = { size: 14, bold: true };
  worksheet.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9EAD3" },
  };

  // Add the new row for Floor Wise Consumption and merge cells
  worksheet.mergeCells(2, 1, 2, validColumns.length + 1); // Merge across columns
  worksheet.getCell("A2").value = `Energy Consumption Report of ${source}`;
  worksheet.getCell("A2").alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  worksheet.getCell("A2").font = { size: 12, bold: true };
  worksheet.getCell("A2").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9EAD3" }, // Same background color as the title
  };

  // Insert the From Datetime and To Datetime rows
  worksheet.addRow(["From Datetime", formattedStartDatetime]);
  worksheet.mergeCells(3, 2, 3, validColumns.length + 1);
  worksheet.getCell("A3").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF9FC5E8" },
  };

  worksheet.addRow(["To Datetime", formattedEndDatetime]);
  worksheet.mergeCells(4, 2, 4, validColumns.length + 1);
  worksheet.getCell("A4").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF9FC5E8" },
  };

  // Add headers for columns
  worksheet.addRow(["Timeseries", ...capitalizedColumns]);
  worksheet.getRow(5).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9EAD3" },
    };
  });

  // Add data rows and format them
  data.forEach((row) => {
    worksheet.addRow([
      new Date(row.timestamp).toLocaleString("en-GB"),
      ...validColumns.map((col) =>
        typeof row[col] === "number" ? row[col].toFixed(2) : row[col] || ""
      ),
    ]);
  });

  // Auto-fit column widths
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const cellValue = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, cellValue.length);
    });
    column.width = maxLength + 2; // Add some padding
  });

  // Write to a file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, filename || "table_report.xlsx");
};
