# TrainXR - AI Exercise Tracking System

A full-stack application that uses computer vision to track exercises, count repetitions, and provide real-time form feedback. Built with Next.js, FastAPI, MediaPipe, and OpenCV.

## Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm (comes with Node.js)
- Git

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```
   uvicorn main:app --reload
   ```

The backend will be available at `http://localhost:8000`

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the frontend development server:
   ```
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## Running Both Services

You can run both services in separate terminal windows:

### Running the Backend
```powershell
cd "Y:\Nikhil HackX hackathon Project\V05\backend"
& "Y:\Nikhil HackX hackathon Project\V05\venv\Scripts\python.exe" -m uvicorn main:app --reload
```

### Running the Frontend
```powershell
cd "Y:\Nikhil HackX hackathon Project\V05\Frontend"
npm run dev
```

Alternatively, you can use the provided batch script that starts both services:
```
start-dev.bat
```

## Documentation

- Backend API documentation is available at:
  - Swagger UI: `http://localhost:8000/docs`
  - ReDoc: `http://localhost:8000/redoc`
- Frontend UI documentation is in `Frontend/Attributions.md`

## Integration Details

The frontend communicates with the backend through the following API endpoints:

### Exercise Analysis
- POST `/api/analyze` - Analyze exercise form and count reps

### Users
- GET `/api/users` - List all users
- GET `/api/users/{user_id}` - Get a specific user
- POST `/api/users` - Create a new user
- PUT `/api/users/{user_id}` - Update a user

### Sessions
- GET `/api/sessions` - List all exercise sessions
- GET `/api/sessions/{session_id}` - Get a specific session
- GET `/api/sessions/user/{user_id}` - Get all sessions for a user
- POST `/api/sessions` - Create a new exercise session

## Development Notes

- The frontend uses the `apiClient.ts` utility to communicate with the backend
- CORS is configured to allow requests from localhost:3000 and localhost:5173
- Video files are temporarily stored in the `uploads/` directory during analysis
- The backend uses MediaPipe for pose estimation and exercise analysis