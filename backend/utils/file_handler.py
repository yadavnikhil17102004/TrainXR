import os
import shutil
from typing import Optional
from fastapi import UploadFile

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

async def save_upload_file(upload_file: UploadFile, destination: str) -> str:
    """Save an uploaded file to a destination path"""
    file_path = os.path.join(UPLOAD_DIR, destination)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return file_path

def cleanup_file(file_path: str):
    """Remove a file from the filesystem"""
    if os.path.exists(file_path):
        os.remove(file_path)