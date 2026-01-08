

import React, { useState, useContext } from "react";
import { WishlistContext } from "../../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ searchText, setSearchText }) {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const [showWishlist, setShowWishlist] = useState(false);

  return (
    <header className="navbar">
      {/* Left */}
      <div className="navbar-left"></div>

      {/* Search */}
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search any things"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button>Search</button>
      </div>

      {/* Right */}
      <div className="navbar-right">
        {/* Wishlist */}
        <div
          className="nav-icon"
          onClick={() => setShowWishlist(!showWishlist)}
          style={{ position: "relative" }}
        >
          ❤️ Wishlist ({wishlist.length})
         {showWishlist && (
  <div className="wishlist-dropdown">

    {/* Header */}
    <div className="wishlist-header">
      ❤️ Items
    </div>

    {wishlist.length === 0 ? (
      <div className="empty">No items in wishlist</div>
    ) : (
      wishlist.map((item) => (
        <div key={item._id} className="wishlist-item">

          {/* Product image */}
          <img
            src={
              item.images?.[0]
                ? `http://localhost:5000${item.images[0]}`
                : "/images/hp.jpg"
            }
            alt={item.title}
            className="wishlist-img"
          />

          {/* Product details */}
          <div className="wishlist-details">
            <div className="wishlist-title">{item.title}</div>
            <div className="wishlist-price">
              ₹{item.variants?.[0]?.price}
            </div>
            <div className="wishlist-rating">★★★★☆</div>
          </div>

          {/* Remove */}
          <button
            className="wishlist-remove"
            onClick={() => toggleWishlist(item)}
          >
            ✕
          </button>
        </div>
      ))
    )}
  </div>
)}

        </div>

        {/* Other icons */}
        <div className="nav-icon">👤 Sign in</div>
        <div className="nav-icon">🛒 Cart</div>
      </div>
    </header>
  );
}
