from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from schemas.exercise import ExerciseAnalysisRequest, ExerciseAnalysisResponse, SessionCreate, SessionResponse
from utils.file_handler import save_upload_file, cleanup_file
from core.mediapipe_wrapper import MediaPipePoseEstimator
import cv2
import os
from datetime import datetime
from typing import List
import importlib

router = APIRouter()

@router.post("/", response_model=ExerciseAnalysisResponse)
async def analyze_exercise(
    exercise_type: str = Form(...),
    sets: int = Form(...),
    reps: int = Form(...),
    video: UploadFile = File(...)
):
    """
    Analyze an exercise video and return form feedback
    """
    # Validate file type
    if not video.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a video file.")
    
    # Save uploaded video temporarily
    video_filename = f"{exercise_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
    video_path = await save_upload_file(video, video_filename)
    
    try:
        # Load the appropriate exercise analyzer
        analyzer = load_exercise_analyzer(exercise_type, reps)
        
        if not analyzer:
            raise HTTPException(status_code=400, detail=f"Unsupported exercise type: {exercise_type}")
        
        # Process video with MediaPipe
        results = process_video(video_path, analyzer)
        
        # Create response
        response = ExerciseAnalysisResponse(
            exercise=exercise_type.capitalize(),
            planned_reps=reps,
            completed_reps=results["completed_reps"],
            form_score=results["form_score"],
            mistakes=results["mistakes"],
            timestamp=datetime.now().isoformat() + "Z"
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")
        
    finally:
        # Clean up temporary video file
        cleanup_file(video_path)

def load_exercise_analyzer(exercise_type: str, planned_reps: int):
    """
    Dynamically load the appropriate exercise analyzer based on exercise type
    """
    try:
        # Map exercise types to their analyzer modules
        exercise_modules = {
            "squat": "exercises.squat",
            "deadlift": "exercises.deadlift",
            "pushup": "exercises.pushup"
        }
        
        if exercise_type.lower() not in exercise_modules:
            return None
            
        # Import the module and instantiate the analyzer
        module = importlib.import_module(exercise_modules[exercise_type.lower()])
        analyzer_class = getattr(module, f"{exercise_type.capitalize()}Counter")
        analyzer = analyzer_class()
        analyzer.planned_reps = planned_reps
        return analyzer
        
    except (ImportError, AttributeError):
        return None

def process_video(video_path: str, analyzer):
    """
    Process video with MediaPipe and the exercise analyzer
    """
    # Initialize MediaPipe pose estimator
    pose_estimator = MediaPipePoseEstimator()
    
    # Open video file
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        raise HTTPException(status_code=500, detail="Could not open video file")
    
    frame_count = 0
    # Process each frame
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        # Process every 3rd frame to reduce computation (optional optimization)
        if frame_count % 3 == 0:
            # Process frame with MediaPipe
            annotated_frame, landmarks = pose_estimator.process_frame(frame)
            
            # Analyze frame with exercise-specific logic
            analyzer.analyze_frame(landmarks)
        
        frame_count += 1
    
    # Release video capture
    cap.release()
    
    # Calculate form score (simplified)
    completed_reps = analyzer.get_completed_reps()
    mistakes = analyzer.get_form_feedback()
    
    # Simple scoring algorithm: 100 - (mistakes * 5) - (missed reps * 2)
    missed_reps = max(0, analyzer.planned_reps - completed_reps)
    form_score = max(0, min(100, 100 - (len(mistakes) * 5) - (missed_reps * 2)))
    
    return {
        "completed_reps": completed_reps,
        "form_score": form_score,
        "mistakes": mistakes
    }