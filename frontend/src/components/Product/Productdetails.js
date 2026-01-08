
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Productdetails.css";


export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedRam, setSelectedRam] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:5000/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setSelectedRam(res.data.variants[0]?.ram || "");
      })
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) return <h2>Product not found</h2>;

  const selectedVariant = product.variants.find(v => v.ram === selectedRam);

  return (
    <div className="product-details-page">
   
      <div className="product-left">
             {/* Back Button */}
    <button className="back-btn" onClick={() => navigate("/home")}>
      ← Back
    </button>

        <h4>product details</h4>
        <br/>
        <img
          src={product.images?.length
            ? `http://localhost:5000${product.images[0]}`
            : "/images/hp.jpg"}
          alt={product.title}
        />
      </div>

      <div className="product-right">
        <h2>{product.title}</h2>
        <h3>₹{selectedVariant?.price}</h3>

        <p>Availability: <b>In Stock</b></p>
        <p>Only {selectedVariant?.qty} left</p>

        <div className="ram-options">
          <span>RAM:</span>
          {product.variants.map((v, i) => (
            <button
              key={i}
              className={selectedRam === v.ram ? "active" : ""}
              onClick={() => setSelectedRam(v.ram)}
            >
              {v.ram}
            </button>
          ))}
        </div>

        <div className="quantity">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)}>+</button>
        </div>

        <div className="actions">
          <button
            className="edit-btn"
            onClick={() => navigate(`/product/${id}/edit`)}
          >
            Edit Product
          </button>
          <button className="buy-btn">Buy it now</button>
        </div>
      </div>
    </div>
  );
}
