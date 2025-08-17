import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductForm from "../components/ProductForm";


const API_BASE = "/api/products"; 

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_BASE}/allproducts`)
        .then((res) => {
          const products = res.data.data || res.data;
          const product = products.find((p) => String(p.productId) === String(id));
          if (product) {
            setInitialData(product);
          } else {
            navigate("/items"); // not found → back to list
          }
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
          navigate("/items");
        });
    } else {
      // For "Add Product" page
      setInitialData({ name: "", price: "", offerPrice: "" });
    }
  }, [id, navigate]);

  const handleSubmit = (form) => {
    if (id) {
      // update
      axios
        .put(`${API_BASE}/update-products/${id}`, form)
        .then(() => {
          navigate("/products");
        })
        .catch((err) => {
          console.error("Error updating product:", err);
        });
    } else {
      // create
      axios
        .post(`${API_BASE}/create-products`, form)
        .then(() => {
          navigate("/products");
        })
        .catch((err) => {
          console.error("Error creating product:", err);
        });
    }
  };

  if (!initialData) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {id ? "Edit Product" : "Add Product"}
      </h2>
      <ProductForm onSubmit={handleSubmit} initialData={initialData} />
    </div>
  );
};

export default EditProductPage;
