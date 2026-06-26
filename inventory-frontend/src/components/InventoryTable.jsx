
function InventoryTable({ items, onEdit, onDelete }) {
  return (
    <table >
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.product_name}</td>
            <td>{item.category}</td>
            <td>{item.quantity}</td>
            <td>{item.price}</td>

            <td>
              <div className="action-buttons">
                <button className="edit-btn" onClick={() => onEdit(item)}>
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default InventoryTable;
