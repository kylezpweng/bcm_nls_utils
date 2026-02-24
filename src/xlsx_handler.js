const fs = require("fs");
const XLSX = require("xlsx");

function readExcelFile(filePath) {
  console.log(`Reading Excel file: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;

  const sheetDataList = [];
  for (const sn of sheetNames) {
    const sheet = workbook.Sheets[sn];
    const data = XLSX.utils.sheet_to_json(sheet);
    sheetDataList.push(data);
  }

  return sheetDataList;
}

module.exports = { readExcelFile };
