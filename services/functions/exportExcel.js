import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const exportToExcel = async (data, columns, fileName = "Export.xlsx") => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  worksheet.columns = columns;
  worksheet.getRow(1).font = { bold: true };

  worksheet.addRows(data);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
};

const exportFlatArrayToExcel = async (
  flatArray,
  columnName = "Username",
  fileName = "Export.xlsx",
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  // 1. Define the column properly for ExcelJS
  worksheet.columns = [{ header: columnName, key: "value", width: 30 }];

  // Make the header bold
  worksheet.getRow(1).font = { bold: true };

  // 2. Map the flat array (['user1', 'user2']) into an array of objects ({ value: 'user1' })
  const rowsToInsert = flatArray.map((item) => ({ value: item }));

  // 3. Add the mapped data
  worksheet.addRows(rowsToInsert);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
};

export { exportToExcel, exportFlatArrayToExcel };
