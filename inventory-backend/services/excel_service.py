import pandas as pd

EXCEL_FILE = "data/inventory.xlsx"


def get_inventory():
    df = pd.read_excel(EXCEL_FILE)
    df = df.fillna("")
    return df.to_dict(orient="records")


def add_inventory(item):
    df = pd.read_excel(EXCEL_FILE)

    new_id = 1 if df.empty else int(df["id"].max()) + 1

    new_row = {
        "id": new_id,
        "product_name": item["product_name"],
        "category": item["category"],
        "quantity": item["quantity"],
        "price": item["price"]
    }

    df.loc[len(df)] = new_row

    df.to_excel(EXCEL_FILE, index=False)

    return new_row

def update_inventory(item_id, updated_item):
    df = pd.read_excel(EXCEL_FILE)

    row_index = df[df["id"] == item_id].index

    if len(row_index) == 0:
        return {"error": "Item not found"}

    idx = row_index[0]

    df.at[idx, "product_name"] = updated_item["product_name"]
    df.at[idx, "category"] = updated_item["category"]
    df.at[idx, "quantity"] = updated_item["quantity"]
    df.at[idx, "price"] = updated_item["price"]

    df.to_excel(EXCEL_FILE, index=False)

    return {"message": "Item updated"}


def delete_inventory(item_id):
    df = pd.read_excel(EXCEL_FILE)

    df = df[df["id"] != item_id]

    df.to_excel(EXCEL_FILE, index=False)

    return {"message": "Item deleted"}