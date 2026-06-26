import { useState, useEffect } from "react";
import InventoryForm from "../components/InventoryForm";
import InventoryTable from "../components/InventoryTable";

import {
  getInventory,
  addInventory,
  updateInventory,
  deleteInventory
} from "../services/inventoryApi";

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const loadInventory = async () => {
    try {
      const data = await getInventory();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await updateInventory(editingItem.id, formData);
        setEditingItem(null);
      } else {
        await addInventory(formData);
      }

      await loadInventory();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleDelete = async (id) => {
    try {
      await deleteInventory(id);
      await loadInventory();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container" >
      <h1>Inventory Management</h1>

      <InventoryForm
        onSubmit={handleSubmit}
        editingItem={editingItem}
      />

      <InventoryTable
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default InventoryPage;