import React, { useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style.css";

const UpdateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const param = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    let result = await fetch(`http://localhost:8000/products/${param.id}`, {
      headers: {
        authorization: JSON.parse(localStorage.getItem("token")),
      },
    });
    result = await result.json();

    setName(result.name);
    setPrice(result.price);
    setCategory(result.category);
    setCompany(result.company);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(name, price, category, company);

    let result = await fetch(`http://localhost:8000/products/${param.id}`, {
      method: "put",
      body: JSON.stringify({ name, price, category, company }),
      headers: {
        "Content-Type": "application/json",
        authorization: JSON.parse(localStorage.getItem("token")),
      },
    });

    result = await result.json();
    console.log(result);
    navigate("/");
  };

  return (
    <div className="container addproduct">
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Enter Product Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            placeholder="Enter Product Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="name">Enter Product Price:</label>
          <input
            type="text"
            id="name"
            value={price}
            placeholder="Enter Product Price"
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="name">Enter Product Category:</label>
          <input
            type="text"
            id="name"
            value={category}
            placeholder="Enter Product Category"
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="name">Enter Product Company:</label>
          <input
            type="text"
            id="name"
            value={company}
            placeholder="Enter Product Company"
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
