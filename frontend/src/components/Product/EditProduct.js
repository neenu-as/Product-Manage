import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProduct.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [variants, setVariants] = useState([{ ram: "", price: "", qty: "" }]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  /* ---------- FETCH CATEGORIES ---------- */
  useEffect(() => {
    axios.get("http://localhost:5000/categories")
      .then(res => setCategories(res.data));
  }, []);

  /* ---------- FETCH PRODUCT ---------- */
  useEffect(() => {
    axios.get(`http://localhost:5000/products/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setCategory(res.data.category);
        setSubCategory(res.data.subCategory);
        setDescription(res.data.description);
        setVariants(res.data.variants);
        setExistingImages(res.data.images);
      });
  }, [id]);

  /* ---------- UPDATE PRODUCT ---------- */
  const updateProduct = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("description", description);
    formData.append("variants", JSON.stringify(variants));

    images.forEach(img => formData.append("images", img));

    await axios.put(`http://localhost:5000/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    navigate(`/product/${id}`);
  };

  return (
    <div className="edit-page">


      <h2>Edit Product</h2>

      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Product Title" />

      <select value={category} onChange={e => { setCategory(e.target.value); setSubCategory(""); }}>
        <option value="">Select Category</option>
        {categories.map((cat, i) => (
          <option key={i} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      <select value={subCategory} onChange={e => setSubCategory(e.target.value)}>
        <option value="">Select Sub Category</option>
        {categories.find(c => c.name === category)?.subCategories.map((s, i) => (
          <option key={i} value={s.name}>{s.name}</option>
        ))}
      </select>

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Product Description"
      />

      {/* VARIANTS */}
      {variants.map((v, i) => (
        <div key={i} className="variant-row">
          <input value={v.ram} onChange={e => {
            const copy = [...variants];
            copy[i].ram = e.target.value;
            setVariants(copy);
          }} placeholder="RAM" />

          <input value={v.price} onChange={e => {
            const copy = [...variants];
            copy[i].price = e.target.value;
            setVariants(copy);
          }} placeholder="Price" />

          <input value={v.qty} onChange={e => {
            const copy = [...variants];
            copy[i].qty = e.target.value;
            setVariants(copy);
          }} placeholder="Qty" />

          <button onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </div>
      ))}

      <button onClick={() => setVariants([...variants, { ram: "", price: "", qty: "" }])}>
        Add Variant
      </button>

      {/* EXISTING IMAGES */}
      <div className="image-preview">
        {existingImages.map((img, i) => (
          <img key={i} src={`http://localhost:5000${img}`} alt="" />
        ))}
      </div>

      <input type="file" multiple onChange={e => setImages([...e.target.files])} />

      <button className="save-btn" onClick={updateProduct}>
        Update Product
      </button>
    </div>
  );
}
