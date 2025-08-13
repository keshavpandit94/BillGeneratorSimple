import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { readData, writeData } from '../utils/excelUtils.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


const __dirname = path.dirname(fileURLToPath(import.meta.url));


const getAllInvoicesData = (req, res) => {
  const data = readData();
  res.json(data);
};

const getTotalInvoiceCount = (req, res) => {
  const data = readData();
  const count = data.length
  console.log("count data :", count)
  res
    .json(
      new ApiResponse(200,count, "data counted"));
};

const getInvoiceByNumber = (req, res) => {
  try {
    const invoiceNumber = req.params.invoiceNumber;
    const data = readData(); // Read from Excel or your DB
    // console.log("Requested Invoice Number:", invoiceNumber);

    const invoice = data.find(inv => inv.invoiceNumber === invoiceNumber);

    if (!invoice) {
      return res
        .status(404)
        .json(new ApiError(404, 'Invoice not found'));
    }

    // Optional: Check if invoice is somehow undefined (double-check)
    if (typeof invoice === 'undefined') {
      return res
        .status(500)
        .json(new ApiError(500, 'Invoice data is undefined'));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, invoice, 'Invoice fetched successfully'));
  } catch (err) {
    console.error("Error fetching invoice:", err.message);
    return res
      .status(500)
      .json(new ApiError(500, err.message || 'Internal Server Error'));
  }
};


const generateInvoiceNumber = (req, res) => {
  const data = readData();
  const today = new Date();
  const yyyyMMdd = today.toISOString().split('T')[0].replace(/-/g, '');

  const sameDayInvoices = data.filter(inv => {
    const datePart = inv.invoiceNumber?.split('-')[1];
    return datePart === yyyyMMdd;
  });

  const nextNumber = sameDayInvoices.length + 1;
  const padded = String(nextNumber).padStart(3, '0');
  const invoiceNumber = `INV-${yyyyMMdd}-${padded}`;

  res.status(200).json(new ApiResponse(200,{ invoiceNumber }, "Next Invoice Number"));
};

const addInvoiceData = (req, res) => {
  const invoice = req.body;
  const data = readData();

  // Enforce storage limit
  if (data.length >= 101) {
    throw new ApiError(403, "Storage limit reached. Buy Premium to store more than 100 invoices.");
  }

  const today = new Date();
  const yyyyMMdd = today.toISOString().split('T')[0].replace(/-/g, '');

  // Auto-generate current date if not provided
  if (!invoice.date) {
    invoice.date = today.toISOString().split('T')[0]; // e.g., "2025-08-01"
  }

  // Use invoiceNumber from frontend if provided and valid
  if (!invoice.invoiceNumber) {
    const sameDayInvoices = data.filter(inv => {
      const datePart = inv.invoiceNumber?.split('-')[1];
      return datePart === yyyyMMdd;
    });

    const nextNumber = sameDayInvoices.length + 1;
    const padded = String(nextNumber).padStart(3, '0');
    invoice.invoiceNumber = `INV-${yyyyMMdd}-${padded}`;
  }

  // Convert arrays to comma-separated strings
  if (Array.isArray(invoice.items)) {
    invoice.product = invoice.items.map(i => i.product).join(', ');
    invoice.quantity = invoice.items.map(i => i.quantity).join(', ');
    invoice.price = invoice.items.map(i => i.price).join(', ');
  }

  data.push(invoice);

  try {
    writeData(data);
    res.status(201).json(
      new ApiResponse(201, invoice, "Invoice Added",)
    );
  } catch (err) {
    res.status(500).json(
      new ApiError(500, err.message || "Failed to write to Excel")
    );
  }
};


const updateInvoiceData = (req, res) => {
  try {
    const invoiceNumber = req.params.invoiceNumber;
    const updated = req.body;
    const data = readData();
    const index = data.findIndex(i => i.invoiceNumber === invoiceNumber);

    if (index === -1) {
      throw new ApiError(404, 'Invoice not found');
    }

    data[index] = { ...data[index], ...updated };
    writeData(data);

    res.status(200).json(
      new ApiResponse(200,  data[index], 'Invoice updated')
    );
  } catch (err) {
    if (err instanceof ApiError) {
      res
        .status(
          err.statusCode
        )
        .json(err);
    } else {
      res
        .status(500)
        .json(
          new ApiError(
            500, err.message || 'Internal Server Error'
          )
        );
    }
  }
};


const deleteInvoiceData = (req, res) => {
  try {
    const invoiceNumber = req.params.invoiceNumber;
    const data = readData();
    const filtered = data.filter(i => i.invoiceNumber !== invoiceNumber);

    if (filtered.length === data.length) {
      throw new ApiError(404, 'Invoice not found');
    }

    writeData(filtered);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,"", 'Invoice deleted'
        )
      );
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json(err);
    } else {
      res
        .status(500)
        .json(
          new ApiError(
            500, err.message || 'Internal Server Error'
          )
        );
    }
  }
};

const FILE_PATH = './data/data.xlsx';
const downloadExcel = (req, res) => {
  const filePath = path.join(__dirname, FILE_PATH);

  if (!fs.existsSync(filePath)) {
    return res
      .status(404)
      .json(new ApiError(404, 'Excel file not found'));
  }

  res.download(filePath, 'invoices.xlsx', (err) => {
    if (err) {
      console.error('Download error:', err);
      return res
        .status(500)
        .json(new ApiError(500, 'Error downloading the file'));
    }
  });
};

export {
  getAllInvoicesData,
  addInvoiceData,
  updateInvoiceData,
  deleteInvoiceData,
  generateInvoiceNumber,
  getInvoiceByNumber,
  getTotalInvoiceCount,
  downloadExcel
};
