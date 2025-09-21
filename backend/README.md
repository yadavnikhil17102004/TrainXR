# Backend for Fitness App

## Project Structure
```
backend/
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Python dependencies
├── config/                 # Configuration files
│   └── database.py         # Database connection setup
├── models/                 # Database models
│   ├── user.py
│   ├── session.py
│   └── exercise.py
├── schemas/                # Pydantic models for request/response
│   ├── user.py
│   ├── session.py
│   └── exercise.py
├── api/                    # API route handlers
│   ├── routes/
│   │   ├── analysis.py
│   │   ├── users.py
│   │   └── sessions.py
│   └── dependencies.py     # API dependencies
├── core/                   # Core modules
│   ├── analyzer.py         # Main analysis logic
│   └── mediapipe_wrapper.py # MediaPipe integration
├── exercises/              # Exercise-specific logic
│   ├── __init__.py
│   ├── squat.py
│   ├── deadlift.py
│   └── pushup.py
├── utils/                  # Utility functions
│   └── file_handler.py
└── uploads/                # Temporary storage for uploaded videos
```