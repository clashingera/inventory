from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from typing import List
import os
from schemas.inventory import BulkSaveRequest, FileMetadataResponse
from services.file_service import FileService

router = APIRouter()

@router.get("/files", response_model=List[str])
def list_available_files():
    """Lists files saved in the local backend environment."""
    return FileService.get_all_recent_files()

@router.post("/upload", response_model=FileMetadataResponse)
async def upload_document(file: UploadFile = File(...)):
    """Receives binary spreadsheets and returns them as a JSON payload matrix."""
    return await FileService.process_file_upload(file)

@router.post("/create-blank/{filename}", response_model=FileMetadataResponse)
def create_new_blank_sheet(filename: str):
    """Generates an editable 20x7 blank file template matrix directly on the server."""
    return FileService.create_blank_canvas(filename)

@router.get("/data/{filename}", response_model=FileMetadataResponse)
def get_file_content(filename: str):
    """Returns the matrix arrays of a requested file name in JSON format."""
    return FileService.read_file_as_json(filename)

@router.post("/save/{filename}")
def sync_file_modifications(filename: str, payload: BulkSaveRequest):
    """Saves entire active spreadsheet UI states back into physical server tracking matrices."""
    return FileService.save_json_as_file(
        filename=filename,
        columns=payload.columns,
        data=payload.data
    )

@router.get("/download/{filename}")
def export_file_binary(filename: str):
    """Generates down-stream binary assets of server matrices to download."""
    safe_name = os.path.basename(filename)
    filepath = os.path.join("data", safe_name)
    
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Requested spreadsheet resource missing.")
        
    return FileResponse(
        path=filepath,
        filename=safe_name,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )

@router.delete("/delete/{filename}")
def purge_file_record(filename: str):
    """Deletes files from local backend workspace configurations."""
    return FileService.remove_file_asset(filename)