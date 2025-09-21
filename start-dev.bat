@echo off
echo Starting Fitness App Development Environment
echo ==========================================

echo.
echo 1. Starting Backend Server...
cd backend
start "Backend Server" cmd /k "uvicorn main:app --reload"
timeout /t 5 /nobreak >nul

echo.
echo 2. Starting Frontend Development Server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting up!
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:8000
echo Backend API Docs will be available at: http://localhost:8000/docs
echo.
echo Press any key to exit...
pause >nul