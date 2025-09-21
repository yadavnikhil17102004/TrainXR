from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ExerciseAnalysisRequest(BaseModel):
    exercise_type: str
    sets: int
    reps: int

class Mistake(BaseModel):
    description: str

class ExerciseAnalysisResponse(BaseModel):
    exercise: str
    planned_reps: int
    completed_reps: int
    form_score: int
    mistakes: List[Mistake]
    timestamp: datetime

class SessionCreate(BaseModel):
    user_id: int
    exercise_type: str
    planned_sets: int
    planned_reps: int
    completed_reps: int
    form_score: int
    mistakes: List[str]

class SessionResponse(SessionCreate):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True