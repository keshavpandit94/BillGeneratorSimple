import express from'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import invoiceRoutes from './routes/invoiceRoutes.js'
import productRoutes from './routes/productRoutes.js'

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/invoices', invoiceRoutes);
app.use('/api/products', productRoutes );

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));