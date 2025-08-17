import XLSX from 'xlsx';
import fs from 'fs';

const FILE_PATH = './data/data.xlsx';
const SHEET_NAME = 'Sheet1';

const HEADERS = [
  "invoiceNumber", "date", "name", "mobileNumber", "product", "quantity","originalPrice","offerPrice", "grandPrice", "paidAmount", "duesAmount"
];


function ensureExcelFileExists() {
  if (!fs.existsSync(FILE_PATH)) {
    const emptyData = [];
    const ws = XLSX.utils.json_to_sheet(emptyData, { header: HEADERS });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
    XLSX.writeFile(wb, FILE_PATH);
    console.log('Excel file created:', FILE_PATH);
  }
}

function readData() {
  ensureExcelFileExists();
  const workbook = XLSX.readFile(FILE_PATH);
  const worksheet = workbook.Sheets[SHEET_NAME];
  // Convert sheet to JSON
let data = XLSX.utils.sheet_to_json(worksheet);

// Sort by invoiceNumber (string) in descending order
data.sort((a, b) => b.invoiceNumber.localeCompare(a.invoiceNumber));

// console.log(data);
return data;
}

function writeData(data) {
  const ws = XLSX.utils.json_to_sheet(data, { header: HEADERS });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
  XLSX.writeFile(wb, FILE_PATH);
}

export {
  readData,
  writeData
};
