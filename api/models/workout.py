from pydantic import BaseModel
from typing import Optional, List


class WorkoutSession(BaseModel):
    """
    Model representing a workout session.
    """
    exercise: str
    expected_reps: int
    actual_reps: Optional[int] = 0
    form_score: Optional[str] = "0%"
    feedback: Optional[str] = ""
    video_path: Optional[str] = None
    weight: Optional[float] = None
    sets: Optional[int] = 1
    duration: Optional[int] = None  # in seconds


class ExerciseAnalysisResponse(BaseModel):
    """
    Model representing the response from exercise analysis.
    """
    exercise: str
    expected_reps: int
    actual_reps: int
    form_score: str
    feedback: str
    form_correct: bool


class ExerciseCounterRequest(BaseModel):
    """
    Model representing a request to count exercises in a video.
    """
    exercise: str
    video_path: str
    expected_reps: int


class ExerciseTypesResponse(BaseModel):
    """
    Model representing the available exercise types.
    """
    exercise_types: List[str]