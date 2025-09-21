from sqlalchemy import Column, Integer, String, DateTime, Float, Text
from sqlalchemy.sql import func
from config.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    
    # Relationship to sessions (one-to-many)
    # sessions = relationship("Session", back_populates="user")

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    exercise_type = Column(String, index=True)
    planned_sets = Column(Integer)
    planned_reps = Column(Integer)
    completed_reps = Column(Integer)
    form_score = Column(Float)
    mistakes = Column(Text)  # JSON string of mistakes
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign key relationship
    # user = relationship("User", back_populates="sessions")