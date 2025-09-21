from fastapi import FastAPI
from api.routes import analysis, users, sessions
from config.cors import add_cors_middleware
from config.database import Base, engine

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fitness App Backend", description="Backend API for exercise analysis", version="1.0.0")

# Add CORS middleware
add_cors_middleware(app)

# Include routers
app.include_router(analysis.router, prefix="/api/analyze", tags=["analysis"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["sessions"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Fitness App Backend API"}