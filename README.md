# Vision Care Optics Billing System

A **full-stack billing and product management application** for optical stores, built with **React (Vite)** frontend and **Node.js (Express)** backend using **Excel files as storage**.

---

## ✨ Features

- 🧾 **Bill Generation:** Create, preview, print, and manage invoices for customers.  
- 📦 **Product Management:** Add, edit, delete, and list products with pricing.  
- 👥 **Customer Database:** View, search, and export bill history.  
- 📊 **Excel Integration:** All data stored in Excel files (`data.xlsx`, `products.xlsx`).  
- 🎨 **Modern UI:** Built with React, Tailwind CSS, and Lucide icons.  
- 💾 **No Database Required:** Uses Excel files for persistent storage.  

---

## 📂 Project Structure

```
DummyFullStack/
├── DummyBackend/              # Node.js Express backend (Excel as DB)
│   ├── data/
│   │   ├── data.xlsx
│   │   └── products.xlsx
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
│
├── DummyFrontend/             # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── Data/
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### 📌 Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)  
- npm (comes with Node.js)  

### 1️⃣ Clone the Repository

```sh
git clone <repo-url>
cd DummyFullStack
```

### 2️⃣ Install Dependencies

Backend:
```sh
cd DummyBackend
npm install
```

Frontend:
```sh
cd ../DummyFrontend
npm install
```

### 3️⃣ Run the Application

Start Backend:
```sh
cd DummyBackend
npm run dev
```

Start Frontend:
```sh
cd DummyFrontend
npm run dev
```

The frontend will be available at: `http://localhost:5173`  
The backend API will be running at: `http://localhost:5000`  

---

## 📡 API Endpoints

### 🔹 Products
- `GET    /api/products/allproducts` → List all products  
- `POST   /api/products/create-products` → Add a new product  
- `PUT    /api/products/update-products/:id` → Update a product  
- `DELETE /api/products/delete-products/:id` → Delete a product  

### 🔹 Invoices
- `GET    /api/invoices/get-data` → List all invoices  
- `POST   /api/invoices/add-invoice` → Add a new invoice  
- `PUT    /api/invoices/update/:invoiceNumber` → Update an invoice  
- `DELETE /api/invoices/delete/:invoiceNumber` → Delete an invoice  
- `GET    /api/invoices/download-excel` → Download all invoices as Excel  

---

## ⚙️ Customization

- **Product List:** Edit `products.xlsx` or use the Product List UI.  
- **Invoice Template:** Modify React components in `src/components`.  
- **Excel Storage:** Data is stored in `/DummyBackend/data/`.  

---

## 📜 License

This project is for **educational/demo purposes**.  
For commercial use, please contact the author.  

---

## 👨‍💻 Author

**Keshav Pandit**
