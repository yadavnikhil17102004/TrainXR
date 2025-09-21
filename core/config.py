import os
from typing import Optional


class Config:
    """
    Configuration class for the TrainXR system.
    """
    
    # API settings
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", 8000))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Video processing settings
    DEFAULT_CAMERA_INDEX: int = int(os.getenv("DEFAULT_CAMERA_INDEX", 0))
    FRAME_WIDTH: int = int(os.getenv("FRAME_WIDTH", 640))
    FRAME_HEIGHT: int = int(os.getenv("FRAME_HEIGHT", 480))
    
    # Exercise counter settings
    MIN_DETECTION_CONFIDENCE: float = float(os.getenv("MIN_DETECTION_CONFIDENCE", 0.5))
    MIN_TRACKING_CONFIDENCE: float = float(os.getenv("MIN_TRACKING_CONFIDENCE", 0.5))
    
    # File paths
    TEMP_DIR: str = os.getenv("TEMP_DIR", "temp")
    VIDEO_DIR: str = os.getenv("VIDEO_DIR", "videos")
    
    # Supported exercise types
    SUPPORTED_EXERCISES: list = [
        "squats",
        "pushups",
        "deadlifts",
        "pullups",
        "bicep_curls"
    ]
    
    @classmethod
    def create_directories(cls):
        """
        Create necessary directories if they don't exist.
        """
        os.makedirs(cls.TEMP_DIR, exist_ok=True)
        os.makedirs(cls.VIDEO_DIR, exist_ok=True)


# Initialize configuration
config = Config()
config.create_directories()