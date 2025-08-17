import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

router.get("/allproducts", getAllProducts);
router.post("/create-products", createProduct);
router.put("/update-products/:id", updateProduct);
router.delete("/delete-products/:id", deleteProduct);

export default router;
