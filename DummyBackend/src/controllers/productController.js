import { readProducts, appendProducts, writeProducts } from "../utils/productExcelUtils.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * GET /products
 * Show all products
 */
const getAllProducts = (req, res) => {
  try {
    const products = readProducts();
    return res
      .status(200)
      .json(new ApiResponse(200, products, "Products fetched successfully"));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500, "Error reading products", err.message));
  }
};

/**
 * POST /products
 * Create a new product
 */
const createProduct = (req, res) => {
  try {
    const newProduct = req.body;

    // Generate next productId
    const products = readProducts();
    const newId =
      products.length > 0
        ? Math.max(...products.map((p) => Number(p.productId) || 0)) + 1
        : 1;

    const productToAdd = {
      productId: newProduct.productId || newId,
      name: newProduct.name || "",
      originalPrice: newProduct.originalPrice || 0,
      offerPrice: newProduct.offerPrice || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    appendProducts([productToAdd]);

    return res
      .status(201)
      .json(new ApiResponse(201, productToAdd, "Product created successfully"));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500, "Error creating product", err.message));
  }
};

/**
 * PUT /products/:id
 * Edit/update a product by ID
 */
const updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const products = readProducts();
    let updatedProduct = null;

    const updatedData = products.map((product) => {
      if (String(product.productId) === String(id)) {
        updatedProduct = {
          ...product,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        return updatedProduct;
      }
      return product;
    });

    if (!updatedProduct) {
      return res
        .status(404)
        .json(new ApiError(404, "Product not found", "Invalid productId"));
    }

    writeProducts(updatedData);

    return res
      .status(200)
      .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500, "Error updating product", err.message));
  }
};

/**
 * DELETE /products/:id
 * Delete a product by ID
 */
const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const products = readProducts();
    const filtered = products.filter(
      (p) => String(p.productId) !== String(id)
    );

    if (products.length === filtered.length) {
      return res
        .status(404)
        .json(new ApiError(404, "Product not found", "Invalid productId"));
    }

    writeProducts(filtered);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Product deleted successfully"));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500, "Error deleting product", err.message));
  }
};

export { 
    getAllProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct 
};
