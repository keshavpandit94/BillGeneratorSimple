import XLSX from "xlsx";
import fs from "fs";

const FILE_PATH = "./data/products.xlsx";
const SHEET_NAME = "Products";

// ✅ New header: offerPrice
const HEADERS = [
  "productId", "name", "originalPrice", "offerPrice", "createdAt", "updatedAt"
];

function ensureExcelFileExists() {
  if (!fs.existsSync(FILE_PATH)) {
    const ws = XLSX.utils.json_to_sheet([], { header: HEADERS, skipHeader: false });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
    XLSX.writeFile(wb, FILE_PATH);
    console.log("Excel file created:", FILE_PATH);
  }
}

function readProducts() {
  ensureExcelFileExists();
  const workbook = XLSX.readFile(FILE_PATH);
  const worksheet = workbook.Sheets[SHEET_NAME];
  return XLSX.utils.sheet_to_json(worksheet, { defval: "" });
}

function writeProducts(data) {
  const ws = XLSX.utils.json_to_sheet(data, { header: HEADERS, skipHeader: false });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
  XLSX.writeFile(wb, FILE_PATH);
}

/**
 * Append one or more new products without overwriting old ones
 */
function appendProducts(newProducts) {
  const data = readProducts();
  const updatedData = data.concat(newProducts.map(normalizeProduct));
  writeProducts(updatedData);
}

/**
 * Ensure product object always has correct structure
 */
function normalizeProduct(product) {
  return HEADERS.reduce((acc, key) => {
    acc[key] = product[key] ?? "";
    return acc;
  }, {});
}

export {
  readProducts,
  writeProducts,
  appendProducts
};
