from fastapi import APIRouter, HTTPException, Depends
from schemas.user import UserCreate, UserUpdate, UserResponse
from typing import List

router = APIRouter()

# Placeholder for database operations
users_db = []
next_user_id = 1

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate):
    """
    Create a new user
    """
    global next_user_id
    user_data = user.dict()
    user_data["id"] = next_user_id
    next_user_id += 1
    users_db.append(user_data)
    return user_data

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int):
    """
    Get a user by ID
    """
    for user in users_db:
        if user["id"] == user_id:
            return user
    raise HTTPException(status_code=404, detail="User not found")

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate):
    """
    Update a user
    """
    for i, user in enumerate(users_db):
        if user["id"] == user_id:
            # Update user data
            updated_user = user.copy()
            update_data = user_update.dict(exclude_unset=True)
            updated_user.update(update_data)
            users_db[i] = updated_user
            return updated_user
    raise HTTPException(status_code=404, detail="User not found")

@router.get("/", response_model=List[UserResponse])
def list_users():
    """
    List all users
    """
    return users_db