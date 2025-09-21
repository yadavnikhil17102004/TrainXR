import logging
import os
from datetime import datetime
from core.config import config


def setup_logger(name: str, log_file: str = None, level: int = logging.INFO) -> logging.Logger:
    """
    Set up a logger with file and console handlers.
    
    Args:
        name (str): Name of the logger
        log_file (str, optional): Path to log file. If None, uses default.
        level (int): Logging level
        
    Returns:
        logging.Logger: Configured logger
    """
    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Prevent adding handlers multiple times
    if logger.handlers:
        return logger
    
    # Create formatters
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler (if log_file specified)
    if log_file:
        # Create logs directory if it doesn't exist
        log_dir = os.path.dirname(log_file)
        if log_dir:
            os.makedirs(log_dir, exist_ok=True)
            
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger


# Create default loggers
app_logger = setup_logger(
    "trainxr_app", 
    log_file=f"logs/app_{datetime.now().strftime('%Y%m%d')}.log"
)

api_logger = setup_logger(
    "trainxr_api", 
    log_file=f"logs/api_{datetime.now().strftime('%Y%m%d')}.log"
)

exercise_logger = setup_logger(
    "trainxr_exercise", 
    log_file=f"logs/exercise_{datetime.now().strftime('%Y%m%d')}.log"
)