# Project Context: TrainXR - Exercise Tracking System

## Project Overview

This project uses computer vision to track and count various exercises in real-time. It leverages the MediaPipe library for pose estimation and OpenCV for image processing. The system provides real-time feedback on exercise form and counts repetitions as users perform exercises.

The system is designed to work with a Flutter mobile application that allows users to log workouts and record videos for AI-powered form analysis.

### Key Features
- Real-time exercise tracking and counting for push-ups, squats, bicep curls, pull-ups, and deadlifts
- Visual feedback on user's form (correct or needs fixing)
- Progress bar indicating completion of each exercise
- Percentage display of exercise progress
- RESTful API for integration with mobile applications
- Modular architecture for easy extension

### Technologies Used
- Python
- FastAPI (for RESTful API)
- OpenCV (for image processing)
- MediaPipe (for pose estimation)
- NumPy (for numerical operations)
- Pydantic (for data validation)

## Project Structure

```
trainxr/
├── api/                    # Backend API endpoints
│   ├── main.py            # FastAPI application entry point
│   ├── routes/            # API route handlers
│   └── models/            # Data models and schemas
│
├── core/                  # Core system components
│   ├── config.py          # Configuration settings
│   └── logger.py          # Logging utilities
│
├── exercises/             # Exercise-specific counter modules
│   ├── base_counter.py    # Base counter class
│   ├── squat_counter.py   # Squat counter implementation
│   ├── deadlift_counter.py # Deadlift counter implementation
│   ├── pushup_counter.py  # Push-up counter implementation
│   ├── pullup_counter.py  # Pull-up counter implementation
│   ├── bicep_curl_counter.py # Bicep curl counter implementation
│   └── utils/             # Exercise-specific utilities
│
├── video_processor/       # Video processing components
│   ├── video_handler.py   # Video input/output handling
│   └── frame_analyzer.py  # Frame-by-frame analysis
│
├── examples/              # Example usage scripts
│   ├── process_video_file.py
│   └── live_camera_demo.py
│
├── tests/                 # Unit and integration tests
├── docs/                  # Documentation
├── requirements.txt       # Project dependencies
├── README.md             # Project documentation
└── QWEN.md               # This file
```

## Core Components

### 1. API Layer (FastAPI)
This is the backend API that handles requests from the Flutter mobile application:
- `api/main.py`: FastAPI application entry point with health check and root endpoints
- `api/routes/exercise_analysis.py`: Endpoints for exercise analysis and counting
- `api/models/workout.py`: Data models for workout sessions and analysis responses

### 2. Exercise Counter Modules
Each exercise has a dedicated counter module that inherits from BaseCounter:
- `exercises/base_counter.py`: Abstract base class with common functionality
- `exercises/squat_counter.py`: Squat counter implementation
- `exercises/pushup_counter.py`: Push-up counter implementation
- `exercises/deadlift_counter.py`: Deadlift counter implementation
- `exercises/pullup_counter.py`: Pull-up counter implementation
- `exercises/bicep_curl_counter.py`: Bicep curl counter implementation

### 3. Video Processing Components
Handles video input/output and frame analysis:
- `video_processor/video_handler.py`: Video input/output operations
- `video_processor/frame_analyzer.py`: Frame-by-frame analysis and visualization

### 4. Utilities
Core utilities for configuration and logging:
- `core/config.py`: Configuration settings
- `core/logger.py`: Logging utilities

## System Architecture

### 1. User Interaction (Frontend - Flutter App)
- User opens app → lands on Home Page (calendar + suggested workouts)
- Taps "Record Session" button → form pops up to pick exercise and fill details
- Optionally records short video of their set for AI analysis
- Hits Save → app stores workout locally and sends to backend API

### 2. Backend Processing (Python + TrainXR Repo)
- Backend receives data via FastAPI endpoints
- If no video → just logs the session
- If video included → passes to relevant counter module:
  - Squats → `SquatCounter.py`
  - Deadlifts → `DeadliftCounter.py`
  - Pushups → `PushUpCounter.py`
- Inside these modules:
  - MediaPipe detects body landmarks
  - OpenCV processes frames to check form
  - Script counts reps & flags mistakes
- Backend sends response back to Flutter

### 3. Data Storage & Sync
- On phone: Workout logs stored locally (SQLite)
- On backend: (Optional) Store session data + AI analysis in PostgreSQL/MongoDB
- Allows syncing across devices & advanced analytics

### 4. Frontend Visualization
- Home tab: Shows calendar view and suggested exercises
- Profile tab: Shows progress charts (weekly reps/sets, monthly improvement, form score trends)
- After recording: User sees instant feedback with correct form badge or "need to fix" tips

## Installation and Setup

1. Clone the repository
2. (Optional) Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install required libraries:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

### Running the API Server
```bash
cd api
python main.py
```

The API will be available at `http://localhost:8000`. API documentation can be found at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Example Scripts
1. Process Video File:
   ```bash
   python examples/process_video_file.py
   ```

2. Live Camera Demo:
   ```bash
   python examples/live_camera_demo.py
   ```

## API Endpoints
- `GET /exercise/types` - Get list of supported exercise types
- `POST /exercise/analyze` - Analyze exercise form in uploaded video
- `POST /exercise/count` - Count exercise repetitions in a video file

## Development Notes

### Implementation Pattern
1. Initialize video capture (file or webcam)
2. Create pose detector object
3. Process frames in a loop:
   - Detect pose landmarks
   - Calculate exercise-specific angles
   - Determine exercise progress percentage
   - Update counter based on movement direction
   - Provide visual feedback
4. Display results and handle exit conditions

### Key Variables
- `counter`: Tracks completed exercise repetitions
- `movement_dir`: Tracks movement direction (0 for down, 1 for up)
- `correct_form`: Indicates if current form is correct
- `exercise_feedback`: Text feedback displayed to user
- `progress_percentage`: Exercise completion percentage
- `progress_bar`: Visual progress bar position

## Dependencies

Key dependencies specified in requirements.txt:
- opencv-python / opencv-contrib-python (v4.7.0.72)
- mediapipe (v0.10.3)
- numpy (v1.24.3)
- fastapi (v0.95.1)
- uvicorn (v0.22.0)
- pydantic (v1.10.7)

See requirements.txt for complete list of dependencies and versions.