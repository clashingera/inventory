import { useState, useEffect } from "react";

function InventoryForm({ onSubmit, editingItem }) {
  const [formData, setFormData] = useState({
    product_name: "",
    category: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    }
  }, [editingItem]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    setFormData({
      product_name: "",
      category: "",
      quantity: "",
      price: "",
    });
  };

  return (
    
    <form onSubmit={handleSubmit}>
      <input
        name="product_name"
        placeholder="Product Name"
        value={formData.productName}
        onChange={handleChange}
      />

      <input
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
      />

      <input
        name="quantity"
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
      />

      <button type="submit">{editingItem ? "Update" : "Add"}</button>
    </form>
  );
}

export default InventoryForm;
