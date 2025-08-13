import express from 'express';
import{
    getAllInvoicesData,
    addInvoiceData,
    updateInvoiceData,
    deleteInvoiceData,
    generateInvoiceNumber,
    getInvoiceByNumber,
    getTotalInvoiceCount,
    downloadExcel
} from '../controllers/invoiceController.js'

const router = express.Router();

router.get('/get-data', getAllInvoicesData);

router.get('/get-dataCount', getTotalInvoiceCount);

router.post('/add-invoice', addInvoiceData);

router.get('/generate-invoice-number', generateInvoiceNumber);

router.get('/data-invoice/:invoiceNumber', getInvoiceByNumber);

router.put('/update/:invoiceNumber', updateInvoiceData);

router.delete('/delete/:invoiceNumber', deleteInvoiceData);

router.get('/download-excel', downloadExcel);

export default router
