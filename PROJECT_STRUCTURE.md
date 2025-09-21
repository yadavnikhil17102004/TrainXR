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

### 1. Frontend (Next.js)
- Modern React-based web application
- TypeScript for type safety
- Tailwind CSS for styling
- Real-time exercise tracking interface
- Records video through browser API
- Communicates with backend through RESTful API

### 2. Backend API (FastAPI)
- RESTful API endpoints for exercise analysis
- Processes video uploads
- Handles exercise detection and counting
- Returns real-time feedback
- CORS enabled for frontend communication

### 3. Exercise Modules
- Modular exercise detection system
- MediaPipe for pose estimation
- OpenCV for video processing
- Real-time form analysis
- Exercise-specific counting algorithms
- Customizable feedback generation

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

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: Python + FastAPI
- **AI/Tracking**: MediaPipe + OpenCV
- **Database**: SQLite (local), PostgreSQL (server)
- **Communication**: REST API (HTTP/JSON)
- **Development Tools**: 
  - ESLint + Prettier (code formatting)
  - Git + GitHub (version control)
  - VS Code (recommended IDE)