import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(name, price, category, company);

    const userId = JSON.parse(localStorage.getItem("user"))._id;
    let result = await fetch("http://localhost:8000/products", {
      method: "post",
      body: JSON.stringify({ name, price, category, company, userId }),
      headers: {
        "Content-Type": "application/json",
        authorization: JSON.parse(localStorage.getItem("token")),
      },
    });

    result = await result.json();
    if(result.error){
      console.log("could not added ", result.error);
    }
    else{
      console.log("product added successfully", result);
      navigate("/");
    }
  };

  return (
    <div className="container addproduct">
      <h2>Add Product</h2>
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

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
