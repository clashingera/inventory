const API_BASE_URL = "http://localhost:8000";

export const getInventory = async () => {
  const response = await fetch(`${API_BASE_URL}/inventory`);
  return response.json();
};

export const addInventory = async (item) => {
  const response = await fetch(`${API_BASE_URL}/inventory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  return response.json();
};

export const updateInventory = async (id, item) => {
  const response = await fetch(
    `${API_BASE_URL}/inventory/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }
  );

  return response.json();
};

export const deleteInventory = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/inventory/${id}`,
    {
      method: "DELETE",
    }
  );

  return response.json();
};