from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import os
import uuid
from api.models.workout import (
    WorkoutSession, 
    ExerciseAnalysisResponse, 
    ExerciseCounterRequest,
    ExerciseTypesResponse
)
from exercises.squat_counter import SquatCounter
from exercises.pushup_counter import PushupCounter
from exercises.deadlift_counter import DeadliftCounter
from exercises.pullup_counter import PullupCounter
from exercises.bicep_curl_counter import BicepCurlCounter

router = APIRouter(prefix="/exercise", tags=["exercise_analysis"])

# Define available exercise types
EXERCISE_TYPES = {
    "squats": SquatCounter,
    "pushups": PushupCounter,
    "deadlifts": DeadliftCounter,
    "pullups": PullupCounter,
    "bicep_curls": BicepCurlCounter
}

@router.get("/types", response_model=ExerciseTypesResponse)
async def get_exercise_types():
    """
    Get list of available exercise types for analysis.
    """
    return ExerciseTypesResponse(exercise_types=list(EXERCISE_TYPES.keys()))

@router.post("/analyze", response_model=ExerciseAnalysisResponse)
async def analyze_exercise_video(
    exercise: str = Form(...),
    expected_reps: int = Form(...),
    video_file: UploadFile = File(...)
):
    """
    Analyze exercise form in uploaded video and count repetitions.
    
    Args:
        exercise (str): Type of exercise to analyze
        expected_reps (int): Expected number of repetitions
        video_file (UploadFile): Video file to analyze
        
    Returns:
        ExerciseAnalysisResponse: Analysis results including count and feedback
    """
    # Validate exercise type
    exercise_lower = exercise.lower()
    if exercise_lower not in EXERCISE_TYPES:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported exercise type. Supported types: {list(EXERCISE_TYPES.keys())}"
        )
    
    # Save uploaded video temporarily
    video_extension = os.path.splitext(video_file.filename)[1]
    temp_video_path = f"temp_{uuid.uuid4()}{video_extension}"
    
    try:
        # Save uploaded file
        with open(temp_video_path, "wb") as buffer:
            content = await video_file.read()
            buffer.write(content)
        
        # Initialize appropriate counter
        counter_class = EXERCISE_TYPES[exercise_lower]
        counter = counter_class()
        
        # Process video
        result = counter.process_video(temp_video_path)
        
        # Calculate form score (simplified)
        form_score = "85%" if result["form_correct"] else "60%"
        
        # Create response
        response = ExerciseAnalysisResponse(
            exercise=result["exercise"],
            expected_reps=expected_reps,
            actual_reps=result["count"],
            form_score=form_score,
            feedback=result["feedback"],
            form_correct=result["form_correct"]
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")
        
    finally:
        # Clean up temporary file
        if os.path.exists(temp_video_path):
            os.remove(temp_video_path)

@router.post("/count", response_model=ExerciseAnalysisResponse)
async def count_exercise_reps(request: ExerciseCounterRequest):
    """
    Count exercise repetitions in a video file.
    
    Args:
        request (ExerciseCounterRequest): Request containing exercise type and video path
        
    Returns:
        ExerciseAnalysisResponse: Analysis results including count and feedback
    """
    # Validate exercise type
    exercise_lower = request.exercise.lower()
    if exercise_lower not in EXERCISE_TYPES:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported exercise type. Supported types: {list(EXERCISE_TYPES.keys())}"
        )
    
    # Check if video file exists
    if not os.path.exists(request.video_path):
        raise HTTPException(status_code=404, detail="Video file not found")
    
    try:
        # Initialize appropriate counter
        counter_class = EXERCISE_TYPES[exercise_lower]
        counter = counter_class()
        
        # Process video
        result = counter.process_video(request.video_path)
        
        # Calculate form score (simplified)
        form_score = "85%" if result["form_correct"] else "60%"
        
        # Create response
        response = ExerciseAnalysisResponse(
            exercise=result["exercise"],
            expected_reps=request.expected_reps,
            actual_reps=result["count"],
            form_score=form_score,
            feedback=result["feedback"],
            form_correct=result["form_correct"]
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")