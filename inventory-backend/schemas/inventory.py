from pydantic import BaseModel, Field
from typing import List, Dict, Any

class BulkSaveRequest(BaseModel):
    columns: List[str] = Field(..., description="Ordered list of column headers")
    data: List[Dict[str, Any]] = Field(..., description="Array of row objects matching columns")

class FileMetadataResponse(BaseModel):
    filename: str
    columns: List[str]
    data: List[Dict[str, Any]]