from fastapi import APIRouter, HTTPException
from schemas.exercise import SessionCreate, SessionResponse
from typing import List

router = APIRouter()

# Placeholder for database operations
sessions_db = []
next_session_id = 1

@router.post("/", response_model=SessionResponse)
def create_session(session: SessionCreate):
    """
    Create a new exercise session
    """
    global next_session_id
    session_data = session.dict()
    session_data["id"] = next_session_id
    session_data["timestamp"] = "2025-09-21T14:30:00Z"  # Placeholder timestamp
    next_session_id += 1
    sessions_db.append(session_data)
    return session_data

@router.get("/{session_id}", response_model=SessionResponse)
def get_session(session_id: int):
    """
    Get an exercise session by ID
    """
    for session in sessions_db:
        if session["id"] == session_id:
            return session
    raise HTTPException(status_code=404, detail="Session not found")

@router.get("/user/{user_id}", response_model=List[SessionResponse])
def get_user_sessions(user_id: int):
    """
    Get all exercise sessions for a user
    """
    user_sessions = [session for session in sessions_db if session["user_id"] == user_id]
    return user_sessions

@router.get("/", response_model=List[SessionResponse])
def list_sessions():
    """
    List all exercise sessions
    """
    return sessions_db