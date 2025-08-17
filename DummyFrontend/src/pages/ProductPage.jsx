import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "../components/ProductList";
import Header from "../components/Header";
import NavigationTabs from "../components/NavigationTabs";

const API_BASE = "/api/products";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    axios
      .get(`${API_BASE}/allproducts`)
      .then((res) => {
        // console.log("Fetched products:", res.data || res.data.data);
        setProducts(res.data.data || res.data); // supports ApiResponse or plain array
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${API_BASE}/delete-products/${id}`)
      .then(() => {
        fetchProducts(); // refresh after delete
      })
      .catch((err) => {
        console.error("Error deleting product:", err);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationTabs />
      <ProductList products={products} onDelete={handleDelete} />
    </div>
  );
};

export default ProductsPage;
