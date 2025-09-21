# 🏋️ TrainXR - Exercise Tracking System

## 📁 Proposed Directory Structure

```
trainxr/
├── api/                    # Backend API endpoints
│   ├── __init__.py
│   ├── main.py            # FastAPI application entry point
│   ├── routes/            # API route handlers
│   │   ├── __init__.py
│   │   ├── exercise_analysis.py
│   │   └── workout_logs.py
│   └── models/            # Data models and schemas
│       ├── __init__.py
│       └── workout.py
│
├── core/                  # Core system components
│   ├── __init__.py
│   ├── config.py          # Configuration settings
│   └── logger.py          # Logging utilities
│
├── exercises/             # Exercise-specific counter modules
│   ├── __init__.py
│   ├── base_counter.py    # Base counter class
│   ├── squat_counter.py   # Squat counter implementation
│   ├── deadlift_counter.py # Deadlift counter implementation
│   ├── pushup_counter.py  # Push-up counter implementation
│   ├── pullup_counter.py  # Pull-up counter implementation
│   ├── bicep_curl_counter.py # Bicep curl counter implementation
│   └── utils/             # Exercise-specific utilities
│       ├── __init__.py
│       └── angle_calculations.py
│
├── video_processor/       # Video processing components
│   ├── __init__.py
│   ├── video_handler.py   # Video input/output handling
│   └── frame_analyzer.py  # Frame-by-frame analysis
│
├── utils/                 # General utility functions
│   ├── __init__.py
│   └── file_utils.py
│
├── tests/                 # Unit and integration tests
│   ├── __init__.py
│   ├── test_exercises/
│   │   ├── __init__.py
│   │   ├── test_squat_counter.py
│   │   └── test_pushup_counter.py
│   └── test_api/
│       ├── __init__.py
│       └── test_exercise_analysis.py
│
├── docs/                  # Documentation
│   └── api_reference.md
│
├── examples/              # Example usage scripts
│   ├── process_video_file.py
│   └── live_camera_demo.py
│
├── requirements.txt       # Project dependencies
├── README.md             # Project documentation
└── .gitignore            # Git ignore rules
```

## 🧠 System Architecture Overview

### 1. Frontend (Flutter App)
- User logs workout or records video
- Sends data to backend API

### 2. Backend API (FastAPI)
- Exposes endpoints for exercise analysis
- Receives workout data and optional video
- Routes requests to appropriate exercise counter modules

### 3. Exercise Modules
- Each exercise has its own counter module
- Uses MediaPipe and OpenCV for pose estimation
- Counts reps and provides form feedback

### 4. Video Processing
- Handles video input/output
- Processes frames for analysis

### 5. Data Storage
- Local storage (SQLite)
- Backend database (PostgreSQL/MongoDB)

## 🚀 How the System Works

1. **User Interaction**: User opens Flutter app, selects exercise, and either logs workout or records video
2. **Backend Processing**: API receives data, routes to appropriate exercise counter
3. **Exercise Analysis**: MediaPipe detects body landmarks, OpenCV processes frames
4. **Feedback Generation**: System counts reps, checks form, generates feedback
5. **Response**: Returns JSON with exercise analysis to Flutter app
6. **Visualization**: Flutter displays feedback, updates charts and logs

## 🛠️ Tech Stack

- **Backend**: Python + FastAPI
- **AI/Tracking**: MediaPipe + OpenCV
- **Database**: SQLite (local), PostgreSQL (server)
- **Frontend**: Flutter (mobile app)
- **Communication**: REST API (HTTP/JSON)