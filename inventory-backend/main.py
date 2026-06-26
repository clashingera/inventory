from fastapi import FastAPI
from pydantic import BaseModel
from services.excel_service import (
    get_inventory,
    add_inventory,
    update_inventory,
    delete_inventory
)
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InventoryItem(BaseModel):
    product_name: str
    category: str
    quantity: int
    price: float


@app.get("/")
def home():
    return {"message": "Inventory Backend Running"}


@app.get("/inventory")
def inventory():
    return get_inventory()


@app.post("/inventory")
def create_inventory(item: InventoryItem):
    return add_inventory(item.model_dump())


@app.put("/inventory/{item_id}")
def update_item(item_id: int, item: InventoryItem):
    return update_inventory(item_id, item.model_dump())


@app.delete("/inventory/{item_id}")
def delete_item(item_id: int):
    return delete_inventory(item_id)