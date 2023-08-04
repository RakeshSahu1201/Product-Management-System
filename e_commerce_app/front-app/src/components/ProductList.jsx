import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";

const ProductList = () => {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    let productList = await fetch("http://localhost:8000/products", {
      headers: {
        authorization: JSON.parse(localStorage.getItem("token")),
        userid: JSON.parse(localStorage.getItem("user"))._id,
      },
    });
    productList = await productList.json();
    setProduct(productList);
  };

  const deleteProduct = async (id) => {
    let result = await fetch(`http://localhost:8000/products/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        authorization: JSON.parse(localStorage.getItem("token")),
      },
    });
    if (result) getProducts();
  };

  const searchProduct = async (event) => {
    const key = event.target.value;
    if (key) {
      let result = await fetch(`http://localhost:8000/products/search/${key}`, {
        headers: {
          authorization: JSON.parse(localStorage.getItem("token")),
          userid: JSON.parse(localStorage.getItem("user"))._id,
        },
      });
      result = await result.json();
      setProduct(result);
    } else {
      let result = await fetch(`http://localhost:8000/products`, {
        headers: {
          authorization: JSON.parse(localStorage.getItem("token")),
          userid: JSON.parse(localStorage.getItem("user"))._id,
        },
      });
      result = await result.json();
      setProduct(result);
    }
  };

  return (
    <div className="product-list">
      <h2>Product List</h2>
      <input
        type="text"
        placeholder="Search Product"
        className="search-product"
        onChange={searchProduct}
      />

      <ul>
        <li>S. No</li>
        <li>Name</li>
        <li>Price</li>
        <li>Category</li>
        <li>Operation</li>
      </ul>
      {product.length > 0 ? (
        product.map((item, index) => (
          <ul>
            <li>{index + 1}</li>
            <li>{item.name}</li>
            <li>{item.price}</li>
            <li>{item.category}</li>
            <li>
              <button
                onClick={() => {
                  deleteProduct(item._id);
                }}
              >
                Delete
              </button>

              <Link className="update-btn" to={`/update/${item._id}`}>
                Update
              </Link>
            </li>
          </ul>
        ))
      ) : (
        <h1>No Data Found</h1>
      )}
    </div>
  );
};

export default ProductList;
