import os
import pandas as pd
from typing import List, Dict, Any
from fastapi import UploadFile, HTTPException

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

class FileService:

    @staticmethod
    def get_all_recent_files() -> List[str]:
        """Scans data folder for all available spreadsheets to sync recent lists."""
        allowed_extensions = ('.xlsx', '.xls', '.csv')
        try:
            return [f for f in os.listdir(DATA_DIR) if f.endswith(allowed_extensions)]
        except Exception:
            return []

    @staticmethod
    def create_blank_canvas(filename: str) -> dict:
        """Initializes an empty 20x7 grid for instant browser editing."""
        if not filename.endswith(('.xlsx', '.xls', '.csv')):
            filename += ".xlsx"
            
        filepath = os.path.join(DATA_DIR, os.path.basename(filename))
        default_columns = ['ID', 'Product Name', 'Category', 'Quantity', 'Price', 'Supplier', 'Status']
        
        # Instantiate 20 blank matrix slots
        blank_matrix = {col: ["" for _ in range(20)] for col in default_columns}
        df = pd.DataFrame(blank_matrix)
        
        if filename.endswith('.csv'):
            df.to_csv(filepath, index=False)
        else:
            df.to_excel(filepath, index=False)
            
        return {
            "filename": filename,
            "columns": default_columns,
            "data": df.to_dict(orient="records")
        }

    @staticmethod
    async def process_file_upload(file: UploadFile) -> dict:
        """Stores file locally and extracts pure JSON matrices."""
        safe_name = os.path.basename(file.filename)
        filepath = os.path.join(DATA_DIR, safe_name)
        
        with open(filepath, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        return FileService.read_file_as_json(safe_name)

    @staticmethod
    def read_file_as_json(filename: str) -> dict:
        """Reads local files dynamically into clean JSON streams."""
        filepath = os.path.join(DATA_DIR, os.path.basename(filename))
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail=f"File '{filename}' does not exist.")
            
        try:
            if filename.endswith(".csv"):
                df = pd.read_csv(filepath)
            else:
                df = pd.read_excel(filepath)
                
            df = df.fillna("")  # Purge NaN objects to ensure pristine JSON formatting
            return {
                "filename": filename,
                "columns": df.columns.tolist(),
                "data": df.to_dict(orient="records")
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading dataset: {str(e)}")

    @staticmethod
    def save_json_as_file(filename: str, columns: List[str], data: List[Dict[str, Any]]) -> dict:
        """Overwrites local file datasets with mutated grid arrays from client states."""
        safe_name = os.path.basename(filename)
        filepath = os.path.join(DATA_DIR, safe_name)
        
        df = pd.DataFrame(data, columns=columns)
        
        if safe_name.endswith(".csv"):
            df.to_csv(filepath, index=False)
        else:
            df.to_excel(filepath, index=False)
            
        return {"message": f"Successfully committed state modifications to {safe_name}"}

    @staticmethod
    def remove_file_asset(filename: str) -> dict:
        """Deletes a file tracking asset out of local data storage."""
        filepath = os.path.join(DATA_DIR, os.path.basename(filename))
        if os.path.exists(filepath):
            os.remove(filepath)
            return {"message": f"Asset {filename} dropped successfully."}
        raise HTTPException(status_code=404, detail="Target file asset not found.")