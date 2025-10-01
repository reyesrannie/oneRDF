import ExcelJS from "exceljs";

const readExcelFile = async (files) => {
  if (files.length > 0) {
    const file = files[0];
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(file);
    const worksheet = workbook.getWorksheet(1);
    const headers = worksheet.getRow(1).values;
    const rows = [];
    worksheet.eachRow((row, rowNum) => {
      if (rowNum !== 1) {
        const rowData = {};
        row.eachCell((cell, colNum) => {
          rowData[headers[colNum]] = cell.value;
        });
        rows.push(rowData);
      }
    });
    return rows;
  } else {
    return null;
  }
};

const readExcelItems = (data = [], mappingValue = []) => {
  const payload = data?.map((item) => {
    const obj = {};
    mappingValue?.forEach((mapping) => {
      obj[mapping?.name] = item[mapping?.value];
    });
    return obj;
  });

  return payload;
};

const readOneChargingExcel = (
  data = [],
  company = [],
  business = [],
  department = [],
  unit = [],
  subUnit = [],
  location = []
) => {
  const payload = data?.map((items) => ({
    code: items["Code"],
    name: items["Name"],
    company: company?.find((i) => i?.code === items["Company Code"]?.toString())
      ?.name,
    business_unit: business?.find(
      (i) => i?.code === items["Business Unit Code"]?.toString()
    )?.name,
    department: department?.find(
      (i) => i?.code === items["Department Code"]?.toString()
    )?.name,
    department_unit: unit?.find(
      (i) => i?.code === items["Unit Code"]?.toString()
    )?.name,
    sub_unit: subUnit?.find(
      (i) => i?.code === items["Subunit Code"]?.toString()
    )?.name,
    location: location?.find(
      (i) => i?.code === items["Location Code"]?.toString()
    )?.name,
  }));

  return payload || [];
};

export { readExcelFile, readExcelItems, readOneChargingExcel };
