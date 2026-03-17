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

export { exportToExcel };
