from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.exercise_analysis import router as exercise_router

app = FastAPI(
    title="TrainXR API",
    description="Backend API for exercise tracking and form analysis",
    version="1.0.0"
)

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(exercise_router)

@app.get("/")
async def root():
    """
    Root endpoint returning API information.
    """
    return {
        "message": "Welcome to the TrainXR API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)