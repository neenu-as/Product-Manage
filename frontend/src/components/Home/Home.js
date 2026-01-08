import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Home.css";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../../context/WishlistContext";


export default function Home() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  /* ---------------- STATE ---------------- */
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [products, setProducts] = useState([]);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  // Category / Subcategory inputs
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [selectedParent, setSelectedParent] = useState("");

  // Product inputs
  const [productTitle, setProductTitle] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productVariants, setProductVariants] = useState([{ ram: "", price: "", qty: "" }]);
  const [productImages, setProductImages] = useState([]);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    axios.get("http://localhost:5000/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));

    axios.get("http://localhost:5000/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  /* ---------------- FILTERED PRODUCTS ---------------- */
  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === "ALL" || p.category === selectedCategory;
    const matchSubCategory = !selectedSubCategory || p.subCategory === selectedSubCategory;
    const matchSearch = p.title.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSubCategory && matchSearch;
  });

  /* ---------------- PAGINATION SETUP ---------------- */
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ---------------- ADD CATEGORY ---------------- */
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const res = await axios.post("http://localhost:5000/categories", {
        name: newCategoryName.trim()
      });
      setCategories([...categories, res.data]);
      setNewCategoryName("");
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- ADD SUBCATEGORY ---------------- */
  const addSubCategoryBackend = async () => {
    if (!selectedParent || !newSubName.trim()) return;
    const parentCat = categories.find(cat => cat.name === selectedParent);
    try {
      const res = await axios.post(
        `http://localhost:5000/categories/${parentCat._id}/subcategories`,
        { name: newSubName.trim() }
      );
      setCategories(categories.map(cat => cat._id === res.data._id ? res.data : cat));
      setNewSubName("");
      setSelectedParent("");
      setShowSubModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- ADD PRODUCT ---------------- */
  const addProductBackend = async () => {
    if (!productTitle || !productCategory || !productSubCategory) return;

    const formData = new FormData();
    formData.append("title", productTitle);
    formData.append("category", productCategory);
    formData.append("subCategory", productSubCategory);
    formData.append("description", productDescription);
    formData.append("variants", JSON.stringify(productVariants));
    productImages.forEach(img => formData.append("images", img));

    try {
      const res = await axios.post("http://localhost:5000/products", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProducts([...products, res.data]);
      setShowProductModal(false);
      setProductTitle("");
      setProductCategory("");
      setProductSubCategory("");
      setProductDescription("");
      setProductVariants([{ ram: "", price: "", qty: "" }]);
      setProductImages([]);
    } catch (err) {
      console.log(err);
    }
  };

  /* ------------------- RENDER ------------------- */
  return (
    <>
      <Navbar searchText={searchText} setSearchText={setSearchText} />
      <div className="home-wrapper">
        <div className="home-container">

          {/* ---------------- SIDEBAR ---------------- */}
          <aside className="sidebar">
            <h3>Categories</h3>
            <div
              className={`category-item ${selectedCategory === "ALL" ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory("ALL");
                setSelectedSubCategory(null);
                setExpandedCategory(null);
              }}
            >
              All Categories
            </div>

            {categories.map((cat, index) => (
              <div key={index} className="category">
                <div
                  className={`category-title ${selectedCategory === cat.name ? "active" : ""}`}
                  onClick={() =>
                    setExpandedCategory(expandedCategory === cat.name ? null : cat.name)
                  }
                >
                  {cat.name}
                  <span>{expandedCategory === cat.name ? "⌄" : ">"}</span>
                </div>

                {expandedCategory === cat.name && (
                  <div className="sub-categories">
                    {cat.subCategories.map((sub, i) => (
                      <label key={i}>
                        <input
                          type="radio"
                          name="subcategory"
                          checked={selectedSubCategory === sub.name}
                          onChange={() => {
                            setSelectedCategory(cat.name);
                            setSelectedSubCategory(sub.name);
                          }}
                        />
                        {sub.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </aside>

          {/* ---------------- MAIN CONTENT ---------------- */}
          <main className="content">
            <div className="content-top">
              <span>Home &gt;</span>
              <div className="action-buttons">
                <button className="outline-btn" onClick={() => setShowModal(true)}>Add category</button>
                <button className="outline-btn" onClick={() => setShowSubModal(true)}>Add sub category</button>
                <button className="solid-btn" onClick={() => setShowProductModal(true)}>Add product</button>
              </div>
            </div>

            {/* ---------------- PRODUCTS ---------------- */}
            <div className="product-grid">
              {paginatedProducts.map(p => {
                const isInWishlist = wishlist.some(item => item._id === p._id);

                return (
                  <div key={p._id} className="product-card" onClick={() => navigate(`/product/${p._id}`)}>
                    <div
                      className={`wishlist ${isInWishlist ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p);
                      }}
                    >
                      {isInWishlist ? "❤️" : "♡"}
                    </div>

                    <img src={p.images[0] ? `http://localhost:5000${p.images[0]}` : "/images/hp.jpg"} alt={p.title} />
                    <h4>{p.title}</h4>
                    <p className="price">${p.variants[0]?.price}</p>
                    <div className="rating">★★★★☆</div>
                  </div>
                );
              })}
            </div>

            {/* ---------------- PAGINATION UI ---------------- */}
            <div className="pagination">
              <span className="count">
                {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} items
              </span>

              <div className="pages">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <span className="rows">Show 6 rows</span>
            </div>
          </main>
        </div>

        {/* ---------------- MODALS ---------------- */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>Add Category</h2>
              <input
                type="text"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <div className="modal-buttons">
                <button className="add-btn" onClick={handleAddCategory}>ADD</button>
                <button className="discard-btn" onClick={() => setShowModal(false)}>DISCARD</button>
              </div>
            </div>
          </div>
        )}

        {showSubModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>Add Sub Category</h2>
              <select value={selectedParent} onChange={(e) => setSelectedParent(e.target.value)}>
                <option value="">Select category</option>
                {categories.map((cat, i) => <option key={i} value={cat.name}>{cat.name}</option>)}
              </select>
              <input
                type="text"
                placeholder="Enter sub category name"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
              />
              <div className="modal-buttons">
                <button className="add-btn" onClick={addSubCategoryBackend}>ADD</button>
                <button className="discard-btn" onClick={() => setShowSubModal(false)}>DISCARD</button>
              </div>
            </div>
          </div>
        )}

        {showProductModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>Add Product</h2>
              <input type="text" placeholder="Product Title" value={productTitle} onChange={(e) => setProductTitle(e.target.value)} />
              <select value={productCategory} onChange={(e) => { setProductCategory(e.target.value); setProductSubCategory(""); }}>
                <option value="">Select Category</option>
                {categories.map((cat, i) => <option key={i} value={cat.name}>{cat.name}</option>)}
              </select>
              <select value={productSubCategory} onChange={(e) => setProductSubCategory(e.target.value)} disabled={!productCategory}>
                <option value="">Select Subcategory</option>
                {categories.find(cat => cat.name === productCategory)?.subCategories.map((sub, i) => (
                  <option key={i} value={sub.name}>{sub.name}</option>
                ))}
              </select>
              <textarea placeholder="Product Description" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
              {productVariants.map((v, i) => (
                <div key={i} className="variant-row">
                  <input type="text" placeholder="RAM" value={v.ram} onChange={(e) => { const copy = [...productVariants]; copy[i].ram = e.target.value; setProductVariants(copy); }} />
                  <input type="number" placeholder="Price" value={v.price} onChange={(e) => { const copy = [...productVariants]; copy[i].price = e.target.value; setProductVariants(copy); }} />
                  <input type="number" placeholder="Qty" value={v.qty} onChange={(e) => { const copy = [...productVariants]; copy[i].qty = e.target.value; setProductVariants(copy); }} />
                  <button onClick={() => setProductVariants(productVariants.filter((_, index) => index !== i))}>Remove</button>
                </div>
              ))}
              <button onClick={() => setProductVariants([...productVariants, { ram: "", price: "", qty: "" }])}>Add Variant</button>
              <input type="file" multiple onChange={(e) => setProductImages([...e.target.files])} />
              <div className="modal-buttons">
                <button className="add-btn" onClick={addProductBackend}>ADD</button>
                <button className="discard-btn" onClick={() => setShowProductModal(false)}>DISCARD</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
