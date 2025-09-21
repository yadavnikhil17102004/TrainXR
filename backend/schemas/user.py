from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str

class UserUpdate(BaseModel):
    name: Optional[str]
    email: Optional[str]

class UserResponse(UserCreate):
    id: int

    class Config:
        orm_mode = True