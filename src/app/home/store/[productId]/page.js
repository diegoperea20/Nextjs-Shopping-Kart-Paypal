"use client";
import React, { useState, useEffect } from "react";
import "./product.css";
import { useSession } from "next-auth/react";

async function getDataId(id) {
  const res = await fetch(`http://localhost:3000/api/store/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch product data");
  }
  const data = await res.json();
  return data;
}

function Product({ params }) {
  const { data: session, status } = useSession();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params?.productId) {
      getDataId(params.productId).then(setProduct).catch(setError);
    }
  }, [params]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="name-container">
        <div className="name-box">
          <div className="name-info">
            <div className="name-title">Error loading product</div>
            <div className="name-description">{error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div>Loading product...</div>;
  }

  const user = session?.user?.username;

  const handleShoppingCart = async () => {
    const data = {
      idproduct: product.id,
      title: product.title,
      image: product.image,
      description: product.description,
      price: product.price,
      amount: parseInt(quantity),
      user: user,
    };
  
    try {
      const res = await fetch("/api/karts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add product to shopping cart");
      }
  
      const datares = await res.json();
      alert("Product added to shopping cart");
      console.log("Product added to cart:", datares);
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };
  

  return (
    <div className="name-container">
      <div className="name-box">
        <div className="name-image-container">
          <img src={product.image} alt={product.title} className="name-image" />
        </div>
        <div className="name-info">
          <div className="name-title">{product.title}</div>
          <div className="name-description">{product.description}</div>
          <div className="name-value">${product.price}</div>
          <input
            type="number"
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
            min={1}
            className="name-input"

          />

          <br />
          <button
            onClick={handleShoppingCart}
            className="name-button"

          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
