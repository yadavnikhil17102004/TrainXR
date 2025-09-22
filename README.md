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

## Browser Support

The camera recording feature now has improved compatibility across browsers and mobile devices:

### Desktop Browsers
- **Chrome**: Version 60+
- **Firefox**: Version 56+
- **Safari**: Version 14+
- **Edge**: Version 79+

### Mobile Browsers
- **iOS Safari**: Version 14+
- **Android Chrome**: Version 60+
- **Android Firefox**: Version 56+

### Cross-Platform Features

Our updated implementation includes:
- Automatic camera detection and fallback mechanisms
- Support for both front and rear cameras on mobile devices
- Cross-browser compatible video recording using WebM format
- Graceful degradation for browsers with limited MediaRecorder support
- Camera switching capability on mobile devices

## Camera Access Troubleshooting

If you're having issues with camera access:

1. **No permission popup appears:**
   - Make sure you're accessing the app via `http://localhost:3000` or `https://localhost:3000`
   - Check that your browser supports camera access
   - Ensure no other applications are using your camera

2. **Permission denied error:**
   - Click the camera icon in your browser's address bar
   - Select "Always allow" or "Allow" for camera access
   - Reload the page and try again

3. **Camera not found error:**
   - Check that your camera is properly connected
   - Restart your computer and try again
   - Test your camera in another application

4. **Mobile-specific solutions:**
   - Make sure you're accessing the app via a secure connection (https)
   - Try switching between front and rear cameras using the "Flip Camera" button
   - Close other apps that might be using the camera

5. **Browser-specific solutions:**
   - **Chrome:** Click the camera icon in address bar → Select "Always allow" → Reload
   - **Firefox:** Click the camera icon in address bar → Select "Remember this decision" → Reload
   - **Safari:** Go to Preferences → Websites → Camera → Select "Allow" for this site
   - **Mobile Safari:** Ensure you're using iOS 14+ and have enabled camera permissions

If you continue to have issues, try using the "Upload Video" button to analyze a pre-recorded video instead.