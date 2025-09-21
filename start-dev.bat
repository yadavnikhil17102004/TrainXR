@echo off
setlocal enabledelayedexpansion

echo Starting TrainXR Development Environment
echo =====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher from https://nodejs.org/
    pause
    exit /b 1
)

REM Check/Create Python virtual environment
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    if !errorlevel! neq 0 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment and install backend dependencies
echo Installing/Updating backend dependencies...
call venv\Scripts\activate
python -m pip install --upgrade pip
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

REM Install frontend dependencies
echo Installing/Updating frontend dependencies...
cd Frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if !errorlevel! neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)
cd ..

REM Check if ports are available
netstat -ano | findstr ":8000" >nul
if %errorlevel% equ 0 (
    echo WARNING: Port 8000 is already in use
    echo Attempting to free port 8000...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000"') do (
        taskkill /PID %%a /F
    )
)

netstat -ano | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo WARNING: Port 3000 is already in use
    echo Attempting to free port 3000...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do (
        taskkill /PID %%a /F
    )
)

REM Create necessary directories
if not exist "backend\uploads" mkdir "backend\uploads"
if not exist "videos" mkdir "videos"

REM Start Backend Server
echo.
echo 1. Starting Backend Server...
cd backend
start "Backend Server" cmd /k "title Backend Server && color 0A && echo Starting Backend Server... && echo. && call ../venv/Scripts/activate && python -m uvicorn main:app --reload"

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM Verify backend is running
curl http://localhost:8000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Backend may not have started properly
    echo - Check the backend window for errors
)

REM Start Frontend Server
echo.
echo 2. Starting Frontend Server...
cd ../Frontend
start "Frontend Server" cmd /k "title Frontend Server && color 0B && echo Starting Frontend Server... && echo. && npm run dev"

echo.
echo =====================================
echo Servers are starting...
echo.
echo Backend will be available at:
echo - http://localhost:8000
echo - API Docs: http://localhost:8000/docs
echo.
echo Frontend will be available at:
echo - http://localhost:3000
echo.
echo If you encounter any issues:
echo 1. Check the server windows for error messages
echo 2. Make sure all dependencies are installed
echo 3. Verify ports 3000 and 8000 are free
echo 4. Check if Python and Node.js are in PATH
echo.
echo Press Ctrl+C in the respective windows to stop the servers
echo Press any key to exit this window...
pause >nul

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