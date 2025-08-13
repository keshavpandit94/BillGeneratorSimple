import express from'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import invoiceRoutes from './routes/invoiceRoutes.js'

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/invoices', invoiceRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));